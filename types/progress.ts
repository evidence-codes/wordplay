export interface LevelProgress {
  basic: number;
  moderate: number;
  advanced: number;
}

export interface UserProgress {
  totalXP: number;
  levelXP: LevelProgress;
  lastPlayedDate: string;
  streak: number;
}

export const XP_LIMITS = {
  basic: 675,
  moderate: 975,
  advanced: 1000,
};
