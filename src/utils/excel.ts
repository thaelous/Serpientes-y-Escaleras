import * as XLSX from 'xlsx';
import { Question } from '../types';

export function downloadQuestionsExcel(questions: Question[]) {
  const data = questions.map(q => ({
    ID: q.id,
    Pregunta: q.question,
    Opcion_A: q.options[0],
    Opcion_B: q.options[1],
    Opcion_C: q.options[2],
    Respuesta_Correcta: q.correctIndex === 0 ? 'A' : q.correctIndex === 1 ? 'B' : 'C',
    Explicacion: q.explanation || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  // Auto-fit column widths
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 60 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 18 },
    { wch: 60 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Preguntas_Arena50');

  XLSX.writeFile(workbook, 'Arena50_Banco_Preguntas.xlsx');
}

export async function parseExcelQuestions(file: File): Promise<{ success: boolean; questions?: Question[]; count?: number; error?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return { success: false, error: 'El archivo Excel no contiene hojas de cálculo.' };
    }

    const worksheet = workbook.Sheets[firstSheetName];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = XLSX.utils.sheet_to_json<any>(worksheet);

    if (!rows || rows.length === 0) {
      return { success: false, error: 'La hoja de cálculo está vacía.' };
    }

    const parsedQuestions: Question[] = [];

    rows.forEach((row, idx) => {
      // Flexible key matching in case of capitalization or spaces
      const questionText = row['Pregunta'] || row['pregunta'] || row['Question'] || row['PREGUNTA'];
      const optA = row['Opcion_A'] || row['Opcion A'] || row['opcion_a'] || row['A'];
      const optB = row['Opcion_B'] || row['Opcion B'] || row['opcion_b'] || row['B'];
      const optC = row['Opcion_C'] || row['Opcion C'] || row['opcion_c'] || row['C'];
      const correctVal = String(row['Respuesta_Correcta'] || row['Respuesta Correcta'] || row['correcta'] || row['Respuesta'] || 'A').trim().toUpperCase();
      const explanation = row['Explicacion'] || row['explicacion'] || row['Explanation'] || '';

      if (questionText && optA && optB && optC) {
        let correctIndex = 0;
        if (correctVal === 'B' || correctVal === '2' || correctVal === 'OPCION_B') {
          correctIndex = 1;
        } else if (correctVal === 'C' || correctVal === '3' || correctVal === 'OPCION_C') {
          correctIndex = 2;
        }

        parsedQuestions.push({
          id: Number(row['ID']) || (idx + 1),
          question: String(questionText).trim(),
          options: [String(optA).trim(), String(optB).trim(), String(optC).trim()],
          correctIndex,
          explanation: String(explanation).trim()
        });
      }
    });

    if (parsedQuestions.length === 0) {
      return { success: false, error: 'No se encontraron filas con las columnas requeridas (Pregunta, Opcion_A, Opcion_B, Opcion_C, Respuesta_Correcta).' };
    }

    return {
      success: true,
      questions: parsedQuestions,
      count: parsedQuestions.length
    };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Error al procesar el archivo Excel.' };
  }
}
