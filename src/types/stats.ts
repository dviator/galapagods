export enum GeneGrade { S = 'S', A = 'A', B = 'B', C = 'C', D = 'D', F = 'F' }

export interface Genome {
  ferocity: GeneGrade; // Grade for ferocity stat
  quickness: GeneGrade; // Grade for quickness stat
  survival: GeneGrade; // Grade for survival stat
  instinct: GeneGrade; // Grade for instinct stat
}

export interface LevelProgression {
  level: number; // Current level
  xp: number; // Current XP
  xpToNext: number; // XP required for next level
}

export function getStatGrowth(grade: GeneGrade): number {
  switch (grade) {
    case GeneGrade.S: return Math.floor(Math.random() * 3) + 8; // 8-10
    case GeneGrade.A: return Math.floor(Math.random() * 3) + 6; // 6-8
    case GeneGrade.B: return Math.floor(Math.random() * 2) + 4; // 4-5
    case GeneGrade.C: return Math.floor(Math.random() * 2) + 3; // 3-4
    case GeneGrade.D: return 2;
    case GeneGrade.F: return 1;
    default: return 1;
  }
}