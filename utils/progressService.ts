import AsyncStorage from "@react-native-async-storage/async-storage";
import { LevelProgress, UserProgress, XP_LIMITS } from "../types/progress";

export const progressService = {
  async initProgress(): Promise<void> {
    const defaultProgress: UserProgress = {
      totalXP: 0,
      levelXP: {
        basic: 0,
        moderate: 0,
        advanced: 0,
      },
      lastPlayedDate: new Date().toISOString().split("T")[0],
      streak: 0,
    };

    const existing = await AsyncStorage.getItem("userProgress");
    if (!existing) {
      await AsyncStorage.setItem(
        "userProgress",
        JSON.stringify(defaultProgress)
      );
    }
  },

  async updateXP(level: keyof LevelProgress, newXP: number): Promise<number> {
    const progress = await this.getProgress();
    const currentLevelXP = progress.levelXP[level];

    // If new XP is higher than current but within limit, update it
    if (newXP > currentLevelXP && newXP <= XP_LIMITS[level]) {
      const xpDiff = newXP - currentLevelXP;
      progress.levelXP[level] = newXP;
      progress.totalXP = this.calculateTotalXP(progress.levelXP);
      await this.saveProgress(progress);
    }

    return progress.totalXP;
  },

  async updateStreak(): Promise<void> {
    const progress = await this.getProgress();
    const today = new Date().toISOString().split("T")[0];
    const lastPlayed = progress.lastPlayedDate;

    if (today === lastPlayed) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastPlayed === yesterdayStr) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }

    progress.lastPlayedDate = today;
    await this.saveProgress(progress);
  },

  calculateTotalXP(levelXP: LevelProgress): number {
    return Object.values(levelXP).reduce((sum, xp) => sum + xp, 0);
  },

  async getProgress(): Promise<UserProgress> {
    const data = await AsyncStorage.getItem("userProgress");
    return data
      ? JSON.parse(data)
      : {
          totalXP: 0,
          levelXP: {
            basic: 0,
            moderate: 0,
            advanced: 0,
          },
          lastPlayedDate: new Date().toISOString().split("T")[0],
          streak: 0,
        };
  },

  async saveProgress(progress: UserProgress): Promise<void> {
    await AsyncStorage.setItem("userProgress", JSON.stringify(progress));
  },
};
