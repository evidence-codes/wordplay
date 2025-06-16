import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  LayoutChangeEvent,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import GameModal from "@/components/GameModal"; // Adjust the import based on your file structure
import { progressService } from "@/utils/progressService"; // Adjust the import based on your file structure

// Sample dictionary words
const wordList = ["TEAM", "THIS", "SEAS", "STAT", "MATS"];

// Scramble the letters while maintaining valid words
const puzzleLetters = [
  ["T", "H", "I", "S"],
  ["E", "A", "D", "E"],
  ["A", "R", "T", "A"],
  ["M", "A", "T", "S"],
];

type Direction = "horizontal" | "vertical" | "diagonal" | "none";
type Position = { row: number; col: number };

const getDirection = (prev: Position, current: Position): Direction => {
  const rowDiff = Math.abs(current.row - prev.row);
  const colDiff = Math.abs(current.col - prev.col);

  if (rowDiff === 0 && colDiff === 1) return "horizontal";
  if (rowDiff === 1 && colDiff === 0) return "vertical";
  if (rowDiff === 1 && colDiff === 1) return "diagonal";
  return "none";
};

const isValidMove = (
  prevPositions: Position[],
  newPosition: Position,
  currentDirection: Direction
): boolean => {
  if (prevPositions.length === 0) return true;

  const lastPosition = prevPositions[prevPositions.length - 1];
  const newDirection = getDirection(lastPosition, newPosition);

  // First move establishes direction
  if (prevPositions.length === 1) return newDirection !== "none";

  // Subsequent moves must follow same direction
  if (newDirection !== currentDirection) return false;

  // Check if position is already selected
  return !prevPositions.some(
    (pos) => pos.row === newPosition.row && pos.col === newPosition.col
  );
};

function BasicGame() {
  const router = useRouter();
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<
    { x: number; y: number }[]
  >([]);
  const [word, setWord] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [validWords, setValidWords] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [currentDirection, setCurrentDirection] = useState<Direction>("none");
  const [selectionTimer, setSelectionTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [hints, setHints] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [startTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  const handleLetterPress = (letter: string, row: number, col: number) => {
    if (selectedLetters.length >= 4) return;

    const newPosition = { row, col };
    const isValid = isValidMove(
      selectedPositions,
      newPosition,
      currentDirection
    );

    if (!isValid) return;

    // Clear existing timer if any
    if (selectionTimer) {
      clearTimeout(selectionTimer);
    }

    setSelectedPositions((prev) => [...prev, newPosition]);
    setSelectedLetters((prev) => [...prev, letter]);

    if (selectedPositions.length === 0) {
      // First selection
      setCurrentDirection("none");
    } else if (selectedPositions.length === 1) {
      // Second selection establishes direction
      setCurrentDirection(getDirection(selectedPositions[0], newPosition));
    }

    // Set new timer
    const timer = setTimeout(() => {
      resetSelection();
    }, 2000);

    setSelectionTimer(timer);
  };

  const handleLayout = (event: LayoutChangeEvent, row: number, col: number) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    tileRefs.current[`${row}-${col}`] = {
      x: x + width / 2,
      y: y + height / 2,
    };
  };

  // First, add a helper function to check words in both directions
  const checkWord = (word: string): boolean => {
    const forward = word;
    const backward = word.split("").reverse().join("");
    return wordList.includes(forward) || wordList.includes(backward);
  };

  // Then update the useEffect hook
  useEffect(() => {
    if (selectedLetters.length === 4) {
      if (selectionTimer) {
        clearTimeout(selectionTimer);
        setSelectionTimer(null);
      }

      const word = selectedLetters.join("");
      setWord(word);

      if (checkWord(word)) {
        if (!validWords.includes(word)) {
          setValidWords((prev) => [...prev, word]);
          setScore((prev) => prev + 100);
        }
      } else {
        // Clear the word display for invalid words
        setTimeout(() => {
          setWord("");
        }, 300);
      }

      // Reset selected letters and coords
      setTimeout(() => {
        resetSelection();
      }, 600);
    }
  }, [selectedLetters]);

  // Add this helper function to handle reset
  const resetSelection = () => {
    setSelectedLetters([]);
    setSelectedCoords([]);
    setSelectedPositions([]);
    setCurrentDirection("none");
    setWord("");
    if (selectionTimer) {
      clearTimeout(selectionTimer);
      setSelectionTimer(null);
    }
  };

  const getRandomHint = (): string => {
    const availableWords = wordList.filter(
      (word) => !validWords.includes(word) && !hints.includes(word)
    );
    if (availableWords.length === 0) return "";
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  };

  // Update the handleHint function
  const handleHint = () => {
    // Only allow 2 hints
    if (hintsUsed >= 2) return;

    const hint = getRandomHint();
    if (hint) {
      setHints((prev) => [...prev, hint]);
      setHintsUsed((prev) => prev + 1);
      // Deduct points for using hint
      setScore((prev) => Math.max(0, prev - 50));
    }
  };

  const handleSubmit = () => {
    if (selectedLetters.length !== 4) return;

    const word = selectedLetters.join("");
    if (checkWord(word)) {
      if (!validWords.includes(word)) {
        setValidWords((prev) => [...prev, word]);
        setScore((prev) => prev + 100);

        // Check if all words are found
        if (validWords.length + 1 === wordList.length) {
          setShowSuccessModal(true);
        }
      }
    }
    resetSelection();
  };

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (selectionTimer) {
        clearTimeout(selectionTimer);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      setEndTime(Date.now());
      setShowTimeUpModal(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Helper function for time formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleGameComplete = async () => {
    const gameXP = validWords.length * 45;
    await progressService.updateXP("basic", gameXP);
    await progressService.updateStreak();
  };

  // Update the success check to set end time when all words are found
  useEffect(() => {
    if (validWords.length === wordList.length) {
      setEndTime(Date.now());
      handleGameComplete();
      setShowSuccessModal(true);
    }
  }, [validWords]);

  // Update the calculateTimeTaken function to use endTime
  const calculateTimeTaken = (): string => {
    if (!endTime) return "00:00";
    const timeElapsed = Math.floor((endTime - startTime) / 1000); // in seconds
    const minutesTaken = Math.floor(timeElapsed / 60);
    const secondsTaken = timeElapsed % 60;
    return `${String(minutesTaken).padStart(2, "0")}:${String(
      secondsTaken
    ).padStart(2, "0")}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-[#3E3BEE] flex-row items-center">
        <Text className="text-[30px] font-instrument_bold text-center text-white flex-1 px-6 py-12">
          Basic Vocabulary
        </Text>
      </View>

      <ImageBackground
        source={require("../../../assets/images/puzzle-bg.png")}
        className="flex-1"
        imageStyle={{
          opacity: 0.5,
          resizeMode: "cover",
          width: "120%",
          height: "120%",
        }}
      >
        <View className="flex-1 bg-[#C6C5FF]/80">
          <View className="flex-row justify-around py-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-[24px]">⏱️</Text>
              <Text className="text-[16px] font-instrument_semibold text-[#3E3BEE]">
                {formatTime(timeLeft)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-[24px]">🧮</Text>
              <Text className="text-[16px] font-instrument_semibold text-[#3E3BEE]">
                {score}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-[24px]">⭐</Text>
              <Text className="text-[16px] font-instrument_semibold text-[#3E3BEE]">
                + {validWords.length * 45} XP
              </Text>
            </View>
          </View>

          {/* Selected Word */}
          <View
            className={`w-[210px] h-[50px] rounded-[5px] mx-auto mb-4 
  ${validWords.includes(word) ? "bg-[#FFBB32]" : "bg-[#666666]"}`}
          >
            <Text className="text-white font-instrument_bold text-[36px] text-center">
              {word}
            </Text>
          </View>

          {/* Puzzle Grid */}
          <View className="items-center px-4 mt-8">
            {puzzleLetters.map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row mb-4">
                {row.map((letter, colIndex) => {
                  const isSelected = selectedPositions.some(
                    (pos) => pos.row === rowIndex && pos.col === colIndex
                  );
                  return (
                    <TouchableOpacity
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-[75px] h-[75px] rounded-md mx-2 items-center justify-center 
                        ${isSelected ? "bg-[#FFBB32]" : "bg-[#FFF1B8]"}
                        shadow-inner`}
                      style={{
                        shadowColor: "#00000040",
                        shadowOffset: { width: 2, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                      onPress={() =>
                        handleLetterPress(letter, rowIndex, colIndex)
                      }
                    >
                      <Text
                        className={`text-[32px] font-instrument_bold ${
                          isSelected ? "text-white" : "text-[#666666]"
                        }`}
                      >
                        {letter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Hint and Submit Buttons */}
          <View className="flex-row justify-center items-center gap-4 mb-4">
            <TouchableOpacity
              onPress={handleHint}
              className={`px-6 py-2 rounded-full ${
                hintsUsed >= 2 ? "bg-[#CCCCCC]" : "bg-[#3E3BEE]"
              }`}
              disabled={hintsUsed >= 2}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-[20px]">💡</Text>
                <Text className="text-white font-instrument_semibold">
                  Hint ({2 - hintsUsed})
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className={`px-6 py-2 rounded-full ${
                selectedLetters.length === 4 ? "bg-[#FFBB32]" : "bg-[#CCCCCC]"
              }`}
              disabled={selectedLetters.length !== 4}
            >
              <Text className="text-white font-instrument_semibold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Show active hint if available */}
          {hints.length > 0 && (
            <View className="items-center mb-4">
              <Text className="text-[#3E3BEE] font-instrument_semibold">
                Hint: Find "{hints[hints.length - 1]}"
              </Text>
            </View>
          )}

          {/* Game Modals */}
          <GameModal
            visible={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              router.back();
            }}
            score={score}
            validWords={validWords}
            isSuccess={true}
            timeTaken={calculateTimeTaken()}
          />

          <GameModal
            visible={showTimeUpModal}
            onClose={() => {
              setShowTimeUpModal(false);
              router.back();
            }}
            score={score}
            validWords={validWords}
            isSuccess={false}
            timeTaken={formatTime(300 - timeLeft)} // Shows actual time taken before timeout
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default BasicGame;
