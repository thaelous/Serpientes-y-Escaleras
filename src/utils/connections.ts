import { Connection } from '../types';

export function getTerrace(tile: number): number {
  if (tile <= 10) return 1;
  if (tile <= 20) return 2;
  if (tile <= 30) return 3;
  if (tile <= 40) return 4;
  return 5;
}

export function generateInitialConnections(): Connection[] {
  return [
    { id: 'ladder-1', type: 'LADDER', startTile: 4, endTile: 17 },   // T1 -> T2
    { id: 'ladder-2', type: 'LADDER', startTile: 14, endTile: 28 },  // T2 -> T3
    { id: 'ladder-3', type: 'LADDER', startTile: 24, endTile: 45 },  // T3 -> T5
    // 3 Distinct Snake Species:
    { id: 'tube-1', type: 'TUBE', startTile: 47, endTile: 12, snakeSpecies: 'BOA' },        // 3-4 levels (T5 -> T2)
    { id: 'tube-2', type: 'TUBE', startTile: 36, endTile: 18, snakeSpecies: 'CASCABEL' },   // 2 levels (T4 -> T2)
    { id: 'tube-3', type: 'TUBE', startTile: 26, endTile: 15, snakeSpecies: 'CORALILLO' }  // 1 level (T3 -> T2)
  ];
}

export function relocateConnection(
  currentConnections: Connection[],
  connectionIdToRelocate: string
): Connection[] {
  const connIndex = currentConnections.findIndex(c => c.id === connectionIdToRelocate);
  if (connIndex === -1) return currentConnections;

  const target = currentConnections[connIndex];
  const occupiedStarts = new Set(currentConnections.map(c => c.startTile));
  const occupiedEnds = new Set(currentConnections.map(c => c.endTile));

  let attempts = 0;
  let newStart = target.startTile;
  let newEnd = target.endTile;

  while (attempts < 100) {
    attempts++;
    if (target.type === 'LADDER') {
      const startT = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
      const endT = Math.min(5, startT + Math.floor(Math.random() * 2) + 1);
      
      const minStart = (startT - 1) * 10 + 2;
      const maxStart = startT * 10 - 1;
      const candStart = Math.floor(Math.random() * (maxStart - minStart + 1)) + minStart;

      const minEnd = (endT - 1) * 10 + 2;
      const maxEnd = Math.min(49, endT * 10 - 1);
      const candEnd = Math.floor(Math.random() * (maxEnd - minEnd + 1)) + minEnd;

      if (
        candEnd > candStart + 4 &&
        !occupiedStarts.has(candStart) &&
        !occupiedEnds.has(candStart) &&
        !occupiedStarts.has(candEnd) &&
        candStart !== target.startTile
      ) {
        newStart = candStart;
        newEnd = candEnd;
        break;
      }
    } else {
      // SNAKES BY SPECIES
      const species = target.snakeSpecies || 'CASCABEL';
      let startT = 4;
      let endT = 2;

      if (species === 'BOA') {
        // 3 to 4 levels difference
        startT = Math.random() > 0.5 ? 5 : 4;
        endT = startT >= 5 ? (Math.random() > 0.5 ? 1 : 2) : 1;
      } else if (species === 'CASCABEL') {
        // 2 levels difference
        const possibleStarts = [3, 4, 5];
        startT = possibleStarts[Math.floor(Math.random() * possibleStarts.length)];
        endT = startT - 2;
      } else {
        // CORALILLO: 1 level difference (short descent)
        const possibleStarts = [2, 3, 4, 5];
        startT = possibleStarts[Math.floor(Math.random() * possibleStarts.length)];
        endT = startT - 1;
      }

      const minStart = (startT - 1) * 10 + 2;
      const maxStart = Math.min(49, startT * 10 - 1);
      const candStart = Math.floor(Math.random() * (maxStart - minStart + 1)) + minStart;

      const minEnd = (endT - 1) * 10 + 2;
      const maxEnd = endT * 10 - 1;
      const candEnd = Math.floor(Math.random() * (maxEnd - minEnd + 1)) + minEnd;

      if (
        candStart > candEnd + 3 &&
        !occupiedStarts.has(candStart) &&
        !occupiedEnds.has(candStart) &&
        !occupiedStarts.has(candEnd) &&
        candStart !== target.startTile
      ) {
        newStart = candStart;
        newEnd = candEnd;
        break;
      }
    }
  }

  const updated = [...currentConnections];
  updated[connIndex] = {
    ...target,
    startTile: newStart,
    endTile: newEnd
  };
  return updated;
}
