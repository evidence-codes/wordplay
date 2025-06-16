import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/auth";

export const authService = {
  async signup(userData: User): Promise<boolean> {
    try {
      // Check if user already exists
      const users = await this.getUsers();
      if (users.some((user) => user.email === userData.email)) {
        return false;
      }

      // Add new user
      users.push(userData);
      await AsyncStorage.setItem("users", JSON.stringify(users));
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  },

  async login(email: string, password: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        await AsyncStorage.setItem("loggedIn", "true");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem("currentUser");
      await AsyncStorage.setItem("loggedIn", "false");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      const users = await AsyncStorage.getItem("users");
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Failed to get users:", error);
      return [];
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },
};
