export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
}

export interface UserProgress {
  totalXP: number;
  levelXP: {
    basic: number;
    moderate: number;
    advanced: number;
  };
  lastPlayedDate: string;
  streak: number;
}
