export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
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
