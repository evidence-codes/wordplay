import AsyncStorage from "@react-native-async-storage/async-storage";
// import { auth, db } from "../config/firebase";
import { User } from "../types/auth";
import { useUserStore } from "@/components/ui/gluestack-ui-provider";

export const authService = {
  async signup(userData: Omit<User, "id">): Promise<boolean> {
    try {
      const users = await this.getUsers();

      // Check if email already exists
      if (users.some((user) => user.email === userData.email)) {
        return false;
      }

      // Create new user with unique ID
      const newUser = {
        ...userData,
        id: Date.now().toString(),
      };

      users.push(newUser);
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
        // Update Zustand store
        const setUser = useUserStore.getState().setUser;
        setUser(user);
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
      await AsyncStorage.multiRemove(["currentUser", "loggedIn"]);
      // Update Zustand store
      const setUser = useUserStore.getState().setUser;
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Get current user failed:", error);
      return null;
    }
  },

  async checkAuth(): Promise<boolean> {
    try {
      const isLoggedIn = await AsyncStorage.getItem("loggedIn");
      return isLoggedIn === "true";
    } catch (error) {
      return false;
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      const users = await AsyncStorage.getItem("users");
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Get users failed:", error);
      return [];
    }
  },

  async updateUser(updatedUser: User): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const index = users.findIndex((u) => u.id === updatedUser.id);

      if (index === -1) return false;

      users[index] = updatedUser;
      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));
      // Update Zustand store
      const setUser = useUserStore.getState().setUser;
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Update user failed:", error);
      return false;
    }
  },
};
