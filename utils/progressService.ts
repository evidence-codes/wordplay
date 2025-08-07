import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProgress } from "../types/auth";
import { useUserStore } from "@/components/ui/gluestack-ui-provider";

export const progressService = {
  async getProgress(): Promise<UserProgress> {
    try {
      const progress = await AsyncStorage.getItem("userProgress");
      return progress ? JSON.parse(progress) : this.getDefaultProgress();
    } catch (error) {
      return this.getDefaultProgress();
    }
  },

  async updateXP(
    level: "basic" | "moderate" | "advanced",
    newXP: number
  ): Promise<void> {
    try {
      const progress = await this.getProgress();
      progress.levelXP[level] = Math.max(progress.levelXP[level], newXP);
      progress.totalXP = this.calculateTotalXP(progress.levelXP);
      await this.saveProgress(progress);
      // Update Zustand store
      const setProgress = useUserStore.getState().setProgress;
      setProgress(progress);
    } catch (error) {
      console.error("Update XP failed:", error);
    }
  },

  async updateStreak(): Promise<void> {
    try {
      const progress = await this.getProgress();
      const today = new Date().toISOString().split("T")[0];

      if (today === progress.lastPlayedDate) return;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (yesterdayStr === progress.lastPlayedDate) {
        progress.streak += 1;
      } else {
        progress.streak = 1;
      }

      progress.lastPlayedDate = today;
      await this.saveProgress(progress);
      // Update Zustand store
      const setProgress = useUserStore.getState().setProgress;
      setProgress(progress);
    } catch (error) {
      console.error("Update streak failed:", error);
    }
  },

  async getLastPlayedBoard(
    level: "basic" | "moderate" | "advanced"
  ): Promise<number> {
    try {
      const key = `lastPlayedBoard_${level}`;
      const lastBoard = await AsyncStorage.getItem(key);
      return lastBoard ? parseInt(lastBoard) : -1;
    } catch (error) {
      console.error("Get last played board failed:", error);
      return -1;
    }
  },

  async setLastPlayedBoard(
    level: "basic" | "moderate" | "advanced",
    boardIndex: number
  ): Promise<void> {
    try {
      const key = `lastPlayedBoard_${level}`;
      await AsyncStorage.setItem(key, boardIndex.toString());
    } catch (error) {
      console.error("Set last played board failed:", error);
    }
  },

  getDefaultProgress(): UserProgress {
    return {
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

  calculateTotalXP(levelXP: UserProgress["levelXP"]): number {
    return Object.values(levelXP).reduce((sum, xp) => sum + xp, 0);
  },

  async saveProgress(progress: UserProgress): Promise<void> {
    await AsyncStorage.setItem("userProgress", JSON.stringify(progress));
  },
};
