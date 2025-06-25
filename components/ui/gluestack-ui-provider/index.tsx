import React, { useEffect } from "react";
import { config } from "./config";
import { View, ViewProps } from "react-native";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import { useColorScheme } from "nativewind";
import { create } from "zustand";
import { User } from "@/types/auth";
import { UserProgress } from "@/types/progress";

export type ModeType = "light" | "dark" | "system";

type WordEntry = { word: string; foundAt: string };
type Difficulty = "basic" | "moderate" | "advanced";

type VocabularyState = {
  words: Record<Difficulty, WordEntry[]>;
  favorites: string[];
  setWords: (words: Record<Difficulty, WordEntry[]>) => void;
  setFavorites: (favorites: string[]) => void;
  addWord: (word: string, difficulty: Difficulty) => void;
  toggleFavorite: (word: string) => void;
};

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  progress: UserProgress | null;
  setProgress: (progress: UserProgress | null) => void;
  updateProgress: (progress: Partial<UserProgress>) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (userUpdate) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userUpdate } : null,
    })),
  progress: null,
  setProgress: (progress) => set({ progress }),
  updateProgress: (progressUpdate) =>
    set((state) => ({
      progress: state.progress
        ? { ...state.progress, ...progressUpdate }
        : null,
    })),
}));

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  words: { basic: [], moderate: [], advanced: [] },
  favorites: [],
  setWords: (words) => set({ words }),
  setFavorites: (favorites) => set({ favorites }),
  addWord: (word, difficulty) =>
    set((state) => {
      if (state.words[difficulty].some((entry) => entry.word === word))
        return {};
      return {
        words: {
          ...state.words,
          [difficulty]: [
            ...state.words[difficulty],
            { word, foundAt: new Date().toISOString() },
          ],
        },
      };
    }),
  toggleFavorite: (word) =>
    set((state) => {
      const isFav = state.favorites.includes(word);
      return {
        favorites: isFav
          ? state.favorites.filter((w) => w !== word)
          : [...state.favorites, word],
      };
    }),
}));

export function GluestackUIProvider({
  mode = "light",
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <View
      style={[
        config[colorScheme!],
        { flex: 1, height: "100%", width: "100%" },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
