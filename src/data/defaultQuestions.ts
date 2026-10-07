import { Question } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    question: '¿Qué principio económico describe que los recursos son limitados frente a necesidades ilimitadas?',
    options: ['Principio de Escasez', 'Ley de Rendimientos Crecientes', 'Paradoja de Giffen'],
    correctIndex: 0,
    explanation: 'La escasez es el problema económico fundamental de tener deseos ilimitados en un mundo de recursos finitos.'
  },
  {
    id: 2,
    question: '¿Cuál es el gas más abundante en la atmósfera terrestre?',
    options: ['Oxígeno', 'Nitrógeno', 'Dióxido de Carbono'],
    correctIndex: 1,
    explanation: 'El nitrógeno constituye aproximadamente el 78% de la atmósfera de la Tierra.'
  },
  {
    id: 3,
    question: 'En metodología ágil (Scrum), ¿cuál es la duración máxima recomendada para el Daily Standup?',
    options: ['15 minutos', '30 minutos', '45 minutos'],
    correctIndex: 0,
    explanation: 'El Scrum Guide estipula un timebox estricto de máximo 15 minutos para la reunión diaria.'
  },
  {
    id: 4,
    question: '¿En qué año cayó el Muro de Berlín, marcando el fin simbólico de la Guerra Fría?',
    options: ['1987', '1989', '1991'],
    correctIndex: 1,
    explanation: 'El Muro de Berlín cayó la noche del 9 de noviembre de 1989.'
  },
  {
    id: 5,
    question: 'En gestión de proyectos, ¿qué representa la "Ruta Crítica"?',
    options: ['La secuencia de actividades sin holgura que determina la duración del proyecto', 'La lista de los riesgos más costosos', 'El camino con menor presupuesto'],
    correctIndex: 0,
    explanation: 'Cualquier retraso en una actividad de la ruta crítica retrasará la fecha final del proyecto.'
  },
  {
    id: 6,
    question: '¿Qué científico formuló las tres leyes fundamentales del movimiento y la ley de gravitación universal?',
    options: ['Galileo Galilei', 'Isaac Newton', 'Johannes Kepler'],
    correctIndex: 1,
    explanation: 'Isaac Newton publicó estas leyes en su obra cumbre "Philosophiae Naturalis Principia Mathematica" en 1687.'
  },
  {
    id: 7,
    question: 'En ciberseguridad, ¿qué técnica simula un ataque autorizado para encontrar vulnerabilidades?',
    options: ['Phishing reverso', 'Penetration Testing (Pentest)', 'Denegación de Servicio'],
    correctIndex: 1,
    explanation: 'El Pentesting evalúa la seguridad de los sistemas intentando vulnerarlos de forma ética y controlada.'
  },
  {
    id: 8,
    question: '¿Cuál es el océano más grande y profundo del planeta Tierra?',
    options: ['Océano Atlántico', 'Océano Índico', 'Océano Pacífico'],
    correctIndex: 2,
    explanation: 'El Océano Pacífico cubre más de 165 millones de km² y alberga la Fosa de las Marianas.'
  },
  {
    id: 9,
    question: '¿Qué término define la capacidad de una organización o individuo para adaptarse positivamente a situaciones adversas?',
    options: ['Resiliencia', 'Conformismo', 'Procrastinación'],
    correctIndex: 0,
    explanation: 'La resiliencia permite superar crisis, transformando la adversidad en aprendizaje y fortaleza.'
  },
  {
    id: 10,
    question: '¿Qué civilización antigua construyó la ciudadela de Machu Picchu en los Andes?',
    options: ['Maya', 'Azteca', 'Inca'],
    correctIndex: 2,
    explanation: 'Machu Picchu fue construida en el siglo XV durante el apogeo del Imperio Inca.'
  },
  {
    id: 11,
    question: '¿Cuál de los siguientes no es uno de los cuatro pilares del análisis FODA / SWOT?',
    options: ['Oportunidades', 'Destrezas', 'Amenazas'],
    correctIndex: 1,
    explanation: 'El FODA evalúa Fortalezas, Oportunidades, Debilidades y Amenazas. "Destrezas" no forma parte del acrónimo.'
  },
  {
    id: 12,
    question: '¿Qué partícula subatómica posee carga eléctrica positiva y se ubica en el núcleo atómico?',
    options: ['Protón', 'Electrón', 'Neutrón'],
    correctIndex: 0,
    explanation: 'Los protones poseen carga positiva (+1), mientras los neutrones son neutros y los electrones negativos.'
  },
  {
    id: 13,
    question: '¿Cuál es el metal más conductor de la electricidad a temperatura ambiente?',
    options: ['Cobre', 'Plata', 'Oro'],
    correctIndex: 1,
    explanation: 'La plata tiene la conductividad eléctrica y térmica más alta de todos los metales.'
  },
  {
    id: 14,
    question: 'En la teoría de la comunicación, ¿qué elemento interfiere o distorsiona el mensaje?',
    options: ['Canal', 'Ruido', 'Retroalimentación'],
    correctIndex: 1,
    explanation: 'El ruido es cualquier perturbación externa o interna que altera la fidelidad de la transmisión.'
  },
  {
    id: 15,
    question: '¿Quién escribió la famosa obra sobre estrategia militar y toma de decisiones "El Arte de la Guerra"?',
    options: ['Sun Tzu', 'Confucio', 'Lao Tse'],
    correctIndex: 0,
    explanation: 'Sun Tzu fue un general y filósofo militar de la antigua China al que se atribuye este tratado clásico.'
  },
  {
    id: 16,
    question: '¿Qué planeta del Sistema Solar es conocido como el "Planeta Rojo"?',
    options: ['Mercurio', 'Marte', 'Júpiter'],
    correctIndex: 1,
    explanation: 'Marte debe su color rojizo a la abundancia de óxido de hierro en su superficie.'
  },
  {
    id: 17,
    question: 'En finanzas corporativas, ¿qué significa el término ROI?',
    options: ['Retorno Sobre la Inversión', 'Riesgo Operativo Inmediato', 'Rango de Ingresos'],
    correctIndex: 0,
    explanation: 'Return On Investment (Retorno Sobre la Inversión) mide la rentabilidad generada respecto al capital invertido.'
  },
  {
    id: 18,
    question: '¿Qué órgano del cuerpo humano consume aproximadamente el 20% del oxígeno total en reposo?',
    options: ['Corazón', 'Hígado', 'Cerebro'],
    correctIndex: 2,
    explanation: 'El cerebro humano, aunque representa cerca del 2% del peso corporal, consume una quinta parte de la energía y oxígeno.'
  },
  {
    id: 19,
    question: '¿Cuál es el río más caudaloso y largo del mundo?',
    options: ['Río Amazonas', 'Río Nilo', 'Río Misisipi'],
    correctIndex: 0,
    explanation: 'El Río Amazonas contiene más agua dulce que los siguientes siete ríos combinados y es el de mayor longitud.'
  },
  {
    id: 20,
    question: 'En negociación, ¿qué significa la sigla MAAN (o BATNA en inglés)?',
    options: ['Mejor Alternativa a un Acuerdo Negociado', 'Monto Anual Asignado Neto', 'Método Acelerado de Arbitraje'],
    correctIndex: 0,
    explanation: 'Es el curso de acción óptimo que puede tomar una parte si las negociaciones actuales fracasan.'
  },
  {
    id: 21,
    question: '¿Cuál es la velocidad aproximada de la luz en el vacío?',
    options: ['300,000 km/s', '150,000 km/s', '3,000,000 km/s'],
    correctIndex: 0,
    explanation: 'La constante c es exactamente 299,792,458 metros por segundo, aproximada a 300,000 km/s.'
  },
  {
    id: 22,
    question: '¿Qué tipo de energía se encuentra almacenada en los enlaces químicos de los alimentos y combustibles?',
    options: ['Energía Cinética', 'Energía Térmica', 'Energía Potencial Química'],
    correctIndex: 2,
    explanation: 'La energía química es una forma de energía potencial almacenada en las uniones moleculares.'
  },
  {
    id: 23,
    question: 'En el ciclo de mejora continua de Deming (PDCA), ¿qué significan las siglas en español?',
    options: ['Planificar, Hacer, Verificar, Actuar', 'Proyectar, Distribuir, Cobrar, Ajustar', 'Pensar, Diseñar, Construir, Auditar'],
    correctIndex: 0,
    explanation: 'Plan-Do-Check-Act: Planificar, Hacer/Desarrollar, Verificar y Actuar/Ajustar.'
  },
  {
    id: 24,
    question: '¿Qué filósofo griego fue maestro de Alejandro Magno?',
    options: ['Sócrates', 'Platón', 'Aristóteles'],
    correctIndex: 2,
    explanation: 'Aristóteles fue convocado por el rey Filipo II de Macedonia para ser el tutor personal del joven Alejandro.'
  },
  {
    id: 25,
    question: '¿Qué estructura celular contiene el material genético (ADN) en células eucariotas?',
    options: ['Mitocondria', 'Núcleo', 'Ribosoma'],
    correctIndex: 1,
    explanation: 'El núcleo celular está delimitado por una doble membrana y alberga el genoma de la célula.'
  },
  {
    id: 26,
    question: '¿Cuál es el instrumento contable que resume los activos, pasivos y patrimonio de una empresa en una fecha dada?',
    options: ['Estado de Resultados', 'Balance General', 'Flujo de Efectivo'],
    correctIndex: 1,
    explanation: 'El Balance General o Estado de Situación Financiera ofrece una foto exacta de la posición patrimonial.'
  },
  {
    id: 27,
    question: '¿Qué invento del siglo XV de Johannes Gutenberg revolucionó la difusión del conocimiento en Europa?',
    options: ['La imprenta de tipos móviles', 'El telescopio reflector', 'La brújula magnética'],
    correctIndex: 0,
    explanation: 'La imprenta moderna democratizó el acceso a los libros y aceleró el Renacimiento científico.'
  },
  {
    id: 28,
    question: 'En estadística y gestión de calidad, ¿qué establece el Principio de Pareto?',
    options: ['El 80% de los efectos proviene del 20% de las causas', 'Todos los eventos tienen igual probabilidad', 'La mitad del trabajo toma el doble del tiempo'],
    correctIndex: 0,
    explanation: 'La regla 80/20 indica que una minoría de factores produce la gran mayoría de los resultados o problemas.'
  },
  {
    id: 29,
    question: '¿Cuál es el hueso más largo y resistente del esqueleto humano?',
    options: ['Húmero', 'Fémur', 'Tibia'],
    correctIndex: 1,
    explanation: 'El fémur soporta gran parte del peso corporal en el muslo y es el más largo y fuerte.'
  },
  {
    id: 30,
    question: 'En diseño centrado en el usuario (UX), ¿qué técnica consiste en agrupar contenidos con tarjetas rotuladas por los usuarios?',
    options: ['Card Sorting', 'A/B Testing', 'Benchmarking'],
    correctIndex: 0,
    explanation: 'El Card Sorting ayuda a estructurar la arquitectura de información según los modelos mentales de los usuarios.'
  },
  {
    id: 31,
    question: '¿Qué científico descubrió accidentalmente la penicilina en 1928?',
    options: ['Louis Pasteur', 'Alexander Fleming', 'Robert Koch'],
    correctIndex: 1,
    explanation: 'Fleming observó que el hongo Penicillium notatum inhibía el crecimiento de colonias de estafilococos.'
  },
  {
    id: 32,
    question: '¿Cuál es el país con mayor superficie territorial del mundo?',
    options: ['Canadá', 'China', 'Rusia'],
    correctIndex: 2,
    explanation: 'Rusia abarca más de 17 millones de kilómetros cuadrados a través de Europa y Asia.'
  },
  {
    id: 33,
    question: 'En gestión del tiempo, ¿qué matriz divide las tareas según su "Urgencia" e "Importancia"?',
    options: ['Matriz de Eisenhower', 'Diagrama de Gantt', 'Tablero Kanban'],
    correctIndex: 0,
    explanation: 'La matriz de Eisenhower ayuda a priorizar clasificando entre urgente/no urgente e importante/no importante.'
  },
  {
    id: 34,
    question: '¿Cuál de las siguientes magnitudes físicas es vectorial (requiere dirección y sentido)?',
    options: ['Masa', 'Velocidad', 'Temperatura'],
    correctIndex: 1,
    explanation: 'La velocidad tiene módulo, dirección y sentido; la masa y la temperatura son magnitudes escalares.'
  },
  {
    id: 35,
    question: '¿En qué año se firmó la Declaración Universal de los Derechos Humanos por la ONU?',
    options: ['1945', '1948', '1955'],
    correctIndex: 1,
    explanation: 'Fue proclamada en París el 10 de diciembre de 1948 tras el término de la Segunda Guerra Mundial.'
  },
  {
    id: 36,
    question: 'En economía del comportamiento, ¿cómo se llama la tendencia a dar más valor a algo simplemente por poseerlo?',
    options: ['Efecto Anclaje', 'Efecto Dotación (Endowment Effect)', 'Sesgo de Confirmación'],
    correctIndex: 1,
    explanation: 'El efecto dotación hace que valoremos los bienes propios por encima del precio de mercado.'
  },
  {
    id: 37,
    question: '¿Cuál es el elemento químico con símbolo Au en la tabla periódica?',
    options: ['Plata', 'Oro', 'Platino'],
    correctIndex: 1,
    explanation: 'Au proviene del latín "aurum", que significa brillante o resplandeciente.'
  },
  {
    id: 38,
    question: '¿Qué teoría psicológica de Abraham Maslow jerarquiza las necesidades humanas en forma de pirámide?',
    options: ['Pirámide de Necesidades Humanas', 'Teoría de los Dos Factores', 'Condicionamiento Operante'],
    correctIndex: 0,
    explanation: 'Maslow estructuró desde las necesidades fisiológicas básicas hasta la autorrealización.'
  },
  {
    id: 39,
    question: '¿Qué cordillera montañosa alberga la cumbre más alta del planeta (Monte Everest)?',
    options: ['Los Andes', 'Los Alpes', 'El Himalaya'],
    correctIndex: 2,
    explanation: 'El Himalaya se extiende a través de cinco países y posee más de cincuenta montañas de más de 7,200 metros.'
  },
  {
    id: 40,
    question: 'En desarrollo de software, ¿qué principio de diseño sugiere que cada módulo debe tener una sola razón para cambiar?',
    options: ['Principio de Responsabilidad Única (SRP)', 'Principio DRY (Don\'t Repeat Yourself)', 'Ley de Moore'],
    correctIndex: 0,
    explanation: 'El Single Responsibility Principle es la \'S\' de los principios SOLID de arquitectura limpia.'
  },
  {
    id: 41,
    question: '¿Quién descubrió la estructura helicoidal del ADN junto a Francis Crick, apoyándose en la Foto 51 de Rosalind Franklin?',
    options: ['James Watson', 'Gregor Mendel', 'Charles Darwin'],
    correctIndex: 0,
    explanation: 'Watson y Crick propusieron el modelo de doble hélice del ADN en 1953.'
  },
  {
    id: 42,
    question: '¿Cuál es el principal gas de efecto invernadero emitido por la quema de combustibles fósiles?',
    options: ['Metano', 'Dióxido de Carbono (CO2)', 'Óxido Nitroso'],
    correctIndex: 1,
    explanation: 'El CO2 representa la gran mayoría de las emisiones antropogénicas que impulsan el calentamiento global.'
  },
  {
    id: 43,
    question: 'En estrategia empresarial, ¿cuál de estas no es una de las 5 Fuerzas de Michael Porter?',
    options: ['Poder de negociación de los clientes', 'Amenaza de nuevos entrantes', 'Tasa de inflación nacional'],
    correctIndex: 2,
    explanation: 'Las 5 Fuerzas analizan la estructura del sector industrial: clientes, proveedores, entrantes, sustitutos y rivalidad.'
  },
  {
    id: 44,
    question: '¿Qué matemático y criptoanalista británico lideró el descifrado de la máquina Enigma en Bletchley Park?',
    options: ['Alan Turing', 'John von Neumann', 'Ada Lovelace'],
    correctIndex: 0,
    explanation: 'Alan Turing diseñó la máquina "Bombe" que descifraba los mensajes cifrados del ejército alemán.'
  },
  {
    id: 45,
    question: '¿Cuál es la unidad básica del Sistema Internacional para medir la fuerza?',
    options: ['Joule', 'Newton', 'Pascal'],
    correctIndex: 1,
    explanation: 'Un Newton (N) equivale a la fuerza necesaria para acelerar 1 kg a 1 m/s².'
  },
  {
    id: 46,
    question: 'En oratoria y persuasión aristotélica, ¿qué apelación se basa en la credibilidad y el carácter ético del emisor?',
    options: ['Ethos', 'Pathos', 'Logos'],
    correctIndex: 0,
    explanation: 'Ethos apela a la autoridad moral y credibilidad, Pathos a la emoción, y Logos a la lógica y la razón.'
  },
  {
    id: 47,
    question: '¿Qué estrecho separa el extremo oriental de Asia del extremo occidental de América del Norte?',
    options: ['Estrecho de Gibraltar', 'Estrecho de Bering', 'Estrecho de Magallanes'],
    correctIndex: 1,
    explanation: 'El estrecho de Bering conecta el mar de Bering con el mar de Chukotka entre Rusia y Alaska.'
  },
  {
    id: 48,
    question: '¿Qué concepto clave de la física cuántica formuló Werner Heisenberg sobre la imposibilidad de medir simultáneamente posición y momento?',
    options: ['Principio de Incertidumbre', 'Efecto Fotoeléctrico', 'Relatividad Especial'],
    correctIndex: 0,
    explanation: 'El Principio de Incertidumbre establece un límite fundamental a la precisión con que ciertas parejas de propiedades físicas pueden conocerse.'
  },
  {
    id: 49,
    question: 'En gestión de equipos de alto rendimiento, ¿cuál es el primer estadio según el modelo de Tuckman?',
    options: ['Forming (Formación)', 'Storming (Conflicto)', 'Performing (Desempeño)'],
    correctIndex: 0,
    explanation: 'Las etapas de Tuckman son: Forming (Formación), Storming (Conflicto), Norming (Normalización) y Performing (Desempeño).'
  },
  {
    id: 50,
    question: '¿Qué hito espacial se logró el 20 de julio de 1969 con la misión Apolo 11?',
    options: ['Primer satélite artificial en órbita', 'Primer alunizaje tripulado en la Luna', 'Primer vuelo tripulado al espacio'],
    correctIndex: 1,
    explanation: 'Neil Armstrong y Buzz Aldrin se convirtieron en los primeros seres humanos en pisar la superficie lunar.'
  }
];
