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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import GameModal from "@/components/GameModal"; // Adjust the import based on your file structure
import { progressService } from "@/utils/progressService"; // Adjust the import based on your file structure
import { vocabularyService } from "@/utils/vocabularyService";

// Update the word list with 6-letter words
const wordList = [
  "EASTWARD",
  "ADVANCED",
  "EAGERLY",
  "DIVERSE",
  "ACCUSED",
  "ABROAD",
  "COUNT",
  "DISCI",
  "GIRTH",
  "EARTH",
  "VEER",
  "CITE",
  "IDEA",
  "DATE",
  "CEDE",
];

// Create a 8x8
const puzzleLetters = [
  ["A", "Y", "L", "R", "E", "G", "A", "E"],
  ["C", "D", "I", "S", "C", "I", "A", "A"],
  ["C", "A", "V", "E", "E", "R", "A", "S"],
  ["U", "T", "D", "A", "T", "T", "I", "T"],
  ["S", "E", "T", "H", "N", "H", "I", "W"],
  ["E", "T", "N", "U", "O", "C", "D", "A"],
  ["D", "I", "V", "E", "R", "S", "E", "R"],
  ["O", "C", "A", "B", "R", "O", "A", "D"],
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

// Update the isValidMove function
const isValidMove = (
  prevPositions: Position[],
  newPosition: Position,
  currentDirection: Direction
): boolean => {
  if (prevPositions.length === 0) return true;

  const lastPosition = prevPositions[prevPositions.length - 1];
  const newDirection = getDirection(lastPosition, newPosition);

  // First move establishes direction
  if (prevPositions.length === 1) {
    return newDirection !== "none";
  }

  // Check if position is already selected
  if (
    prevPositions.some(
      (pos) => pos.row === newPosition.row && pos.col === newPosition.col
    )
  ) {
    return false;
  }

  // If direction is not established yet, allow the move
  if (currentDirection === "none") {
    return newDirection !== "none";
  }

  // Subsequent moves must follow same direction
  return newDirection === currentDirection;
};

export default function AdvancedGame() {
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
    if (selectedLetters.length >= 8) return; // Keep at 8 for advanced level

    const newPosition = { row, col };
    const isValid = isValidMove(
      selectedPositions,
      newPosition,
      currentDirection
    );

    if (!isValid) return;

    if (selectedPositions.length === 1) {
      // Set direction when selecting second letter
      const newDirection = getDirection(selectedPositions[0], newPosition);
      setCurrentDirection(newDirection);
    }

    if (selectionTimer) {
      clearTimeout(selectionTimer);
    }

    // Update selected letters and display word immediately
    const newSelectedLetters = [...selectedLetters, letter];
    setSelectedLetters(newSelectedLetters);
    setSelectedPositions((prev) => [...prev, newPosition]);
    setWord(newSelectedLetters.join("")); // Update word display immediately

    // Check if word is valid
    const currentWord = newSelectedLetters.join("");
    if (newSelectedLetters.length >= 4 && checkWord(currentWord)) {
      if (!validWords.includes(currentWord)) {
        setValidWords((prev) => [...prev, currentWord]);
        setScore((prev) => prev + currentWord.length * 50);
        // Store the word
        vocabularyService.storeWord(currentWord, "advanced");
      }
    }

    const timer = setTimeout(resetSelection, 2000);
    setSelectionTimer(timer);
  };

  const handleLayout = (event: LayoutChangeEvent, row: number, col: number) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    tileRefs.current[`${row}-${col}`] = {
      x: x + width / 2,
      y: y + height / 2,
    };
  };

  // Update the checkWord function
  const checkWord = (word: string): boolean => {
    if (word.length < 4 || word.length > 8) return false; // Check length constraints
    const forward = word;
    const backward = word.split("").reverse().join("");
    return wordList.includes(forward) || wordList.includes(backward);
  };

  // Then update the useEffect hook
  useEffect(() => {
    if (selectedLetters.length === 8) {
      // Changed from 4 to 6
      if (selectionTimer) {
        clearTimeout(selectionTimer);
        setSelectionTimer(null);
      }

      const word = selectedLetters.join("");
      setWord(word);

      if (checkWord(word)) {
        if (!validWords.includes(word)) {
          setValidWords((prev) => [...prev, word]);
          setScore((prev) => prev + 250); // Increased score for moderate level
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
    // Only allow 3 hints
    if (hintsUsed >= 3) return;

    const hint = getRandomHint();
    if (hint) {
      setHints((prev) => [...prev, hint]);
      setHintsUsed((prev) => prev + 1);
      // Deduct points for using hint
      setScore((prev) => Math.max(0, prev - 50));
    }
  };

  // Update the handleSubmit function
  const handleSubmit = () => {
    if (selectedLetters.length < 4) return; // Minimum 3 letters

    const word = selectedLetters.join("");
    if (checkWord(word)) {
      if (!validWords.includes(word)) {
        setValidWords((prev) => [...prev, word]);
        setScore((prev) => prev + word.length * 50);
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
    const gameXP = validWords.length * 85; // Increased XP per word for moderate level
    await progressService.updateXP("advanced", gameXP);
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
          Advanced Vocabulary
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
                + {validWords.length * 85} XP
              </Text>
            </View>
          </View>

          {/* Selected Word */}
          <View
            className={`w-[280px] h-[50px] rounded-[5px] mx-auto ${
              Platform.OS === "android" ? "mb-2" : "mb-4"
            } ${
              word && checkWord(word) ? "bg-[#FFBB32]" : "bg-[#666666]"
            } justify-center`}
          >
            <Text className="text-white font-instrument_bold text-[36px] text-center">
              {word}
            </Text>
          </View>

          {/* Puzzle Grid */}
          <View
            className={`items-center px-4 ${
              Platform.OS === "android" ? "mt-4" : "mt-8"
            }`}
          >
            {puzzleLetters.map((row, rowIndex) => (
              <View
                key={rowIndex}
                className={`flex-row ${
                  Platform.OS === "android" ? "mb-2" : "mb-4"
                }`}
              >
                {row.map((letter, colIndex) => {
                  const isSelected = selectedPositions.some(
                    (pos) => pos.row === rowIndex && pos.col === colIndex
                  );
                  return (
                    <TouchableOpacity
                      key={`${rowIndex}-${colIndex}`}
                      className={`${
                        Platform.OS === "android"
                          ? "w-[35px] h-[35px] mx-1" // Smaller tiles for 8x8 grid on Android
                          : "w-[45px] h-[45px] mx-1" // Smaller tiles for 8x8 grid on iOS
                      } rounded-md items-center justify-center 
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
                        className={`${
                          Platform.OS === "android"
                            ? "text-[20px]" // Smaller font for Android
                            : "text-[24px]" // Smaller font for iOS
                        } font-instrument_bold ${
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
                selectedLetters.length === 6 ? "bg-[#FFBB32]" : "bg-[#CCCCCC]"
              }`}
              disabled={selectedLetters.length !== 6}
            >
              <Text className="text-white font-instrument_semibold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add this new Word Progress section */}
          <View className="px-8 py-2 mx-4 bg-white/50 rounded-lg">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-instrument_regular text-[#666666]">
                  Words Found
                </Text>
                <Text className="font-instrument_bold text-[24px] text-[#3E3BEE]">
                  {validWords.length}
                  <Text className="font-instrument_regular text-[16px] text-[#666666]">
                    /{wordList.length}
                  </Text>
                </Text>
              </View>
              <View className="items-end">
                <Text className="font-instrument_regular text-[#666666]">
                  Remaining
                </Text>
                <Text className="font-instrument_bold text-[24px] text-[#FF1214]">
                  {wordList.length - validWords.length}
                </Text>
              </View>
            </View>
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
