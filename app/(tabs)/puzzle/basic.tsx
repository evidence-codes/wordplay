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
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import GameModal from "@/components/GameModal"; // Adjust the import based on your file structure
import { progressService } from "@/utils/progressService"; // Adjust the import based on your file structure
import { vocabularyService } from "@/utils/vocabularyService";

// Update the word list with 2-4 letter words
const wordList = [
  // 4 letters
  "EASE",
  "TEAM",
  "THIS",
  "SEAS",
  "MATS",
  "STAT",
  // 3 letters
  "SEA",
  "TEA",
  "HIS",
  "MAT",
  "TAT",
  // 2 letters
  "AT",
  "AS",
  "AM",
  "HE",
];

// Multiple puzzle boards - each board has different letter arrangements
const puzzleBoards = [
  // Board 1
  [
    ["T", "H", "I", "S"],
    ["E", "A", "S", "E"],
    ["A", "S", "T", "A"],
    ["M", "A", "T", "S"],
  ],
  // Board 2
  [
    ["M", "A", "E", "T"],
    ["A", "S", "A", "H"],
    ["T", "T", "S", "I"],
    ["S", "A", "E", "S"],
  ],
  // Board 3
  [
    ["S", "T", "A", "M"],
    ["A", "T", "S", "A"],
    ["E", "S", "A", "E"],
    ["S", "I", "H", "T"],
  ],
  // Board 4
  [
    ["S", "E", "A", "S"],
    ["I", "S", "T", "T"],
    ["H", "A", "S", "A"],
    ["T", "E", "A", "M"],
  ],
  // Board 5
  // [
  //   ["S", "A", "E", "S"],
  //   ["T", "E", "A", "M"],
  //   ["A", "T", "A", "T"],
  //   ["H", "I", "S", "S"],
  // ],
  // // Board 6
  // [
  //   ["M", "A", "T", "S"],
  //   ["E", "A", "S", "E"],
  //   ["T", "H", "I", "S"],
  //   ["A", "S", "T", "A"],
  // ],
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

const XP_PER_WORD = 45;
const HINT_PENALTY = 30;

const BasicGame = () => {
  const router = useRouter();
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<
    { x: number; y: number }[]
  >([]);
  const [word, setWord] = useState<string>("");
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
  const [currentXP, setCurrentXP] = useState(0);
  const [showXPDeduction, setShowXPDeduction] = useState(false);
  const [xpDeductionAnim] = useState(new Animated.Value(0));
  const [currentBoard, setCurrentBoard] = useState<string[][]>([]);
  const [currentBoardIndex, setCurrentBoardIndex] = useState<number>(0);

  // Initialize board selection on component mount
  useEffect(() => {
    const initializeBoard = async () => {
      try {
        const lastPlayedBoard = await progressService.getLastPlayedBoard(
          "basic"
        );

        // Get available boards (exclude the last played one)
        const availableBoards = puzzleBoards
          .map((board, index) => ({ board, index }))
          .filter(({ index }) => index !== lastPlayedBoard);

        // If all boards have been played, reset and use any board
        if (availableBoards.length === 0) {
          const randomIndex = Math.floor(Math.random() * puzzleBoards.length);
          setCurrentBoard(puzzleBoards[randomIndex]);
          setCurrentBoardIndex(randomIndex);
          await progressService.setLastPlayedBoard("basic", randomIndex);
        } else {
          // Pick a random board from available ones
          const randomBoardData =
            availableBoards[Math.floor(Math.random() * availableBoards.length)];
          setCurrentBoard(randomBoardData.board);
          setCurrentBoardIndex(randomBoardData.index);
          await progressService.setLastPlayedBoard(
            "basic",
            randomBoardData.index
          );
        }
      } catch (error) {
        console.error("Failed to initialize board:", error);
        // Fallback to first board
        setCurrentBoard(puzzleBoards[0]);
        setCurrentBoardIndex(0);
      }
    };

    initializeBoard();
  }, []);

  // Update the handleLetterPress function
  const handleLetterPress = (letter: string, row: number, col: number) => {
    if (selectedLetters.length >= 4) return;

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
    if (newSelectedLetters.length >= 2 && checkWord(currentWord)) {
      if (!validWords.includes(currentWord)) {
        setValidWords((prev) => [...prev, currentWord]);
        // Store the word
        vocabularyService.storeWord(currentWord, "basic");
      }
    }

    const timer = setTimeout(resetSelection, 2000);
    setSelectionTimer(timer as unknown as NodeJS.Timeout);
  };

  const handleLayout = (event: LayoutChangeEvent, row: number, col: number) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    // Remove tileRefs usage since it's not defined
    // tileRefs.current[`${row}-${col}`] = {
    //   x: x + width / 2,
    //   y: y + height / 2,
    // };
  };

  // Update the checkWord function
  const checkWord = (word: string): boolean => {
    if (word.length < 2 || word.length > 4) return false;
    return wordList.includes(word);
  };

  // Then update the useEffect hook
  useEffect(() => {
    if (selectedLetters.length === 4) {
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
    setSelectedPositions([]);
    setCurrentDirection("none");
    setWord(""); // Clear the word display
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
  const handleHint = async () => {
    if (hintsUsed >= 2) return;
    const hint = getRandomHint();
    if (hint) {
      setHints((prev) => [...prev, hint]);
      setHintsUsed((prev) => prev + 1);
      // Deduct XP for using hint
      setCurrentXP((prev) => Math.max(0, prev - HINT_PENALTY));
      // Animate XP deduction
      setShowXPDeduction(true);
      xpDeductionAnim.setValue(1);
      Animated.timing(xpDeductionAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => setShowXPDeduction(false));
      const xp =
        validWords.length * XP_PER_WORD - (hintsUsed + 1) * HINT_PENALTY;
      await progressService.updateXP("basic", Math.max(0, xp));
    }
  };

  // Update the handleSubmit function
  const handleSubmit = () => {
    if (selectedLetters.length < 2) return; // Minimum 2 letters for basic

    const word = selectedLetters.join("");
    if (checkWord(word)) {
      if (!validWords.includes(word)) {
        setValidWords((prev) => [...prev, word]);
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
    const xp = validWords.length * XP_PER_WORD - hintsUsed * HINT_PENALTY;
    await progressService.updateXP("basic", Math.max(0, xp));
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

  useEffect(() => {
    setCurrentXP(validWords.length * XP_PER_WORD - hintsUsed * HINT_PENALTY);
  }, [validWords, hintsUsed]);

  // Don't render until board is loaded
  if (currentBoard.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-[#3E3BEE] flex-row items-center">
          <Text className="text-[30px] font-instrument_bold text-center text-white flex-1 px-6 py-12">
            Basic Vocabulary
          </Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <Text className="text-[18px] font-instrument_regular text-[#666666]">
            Loading puzzle...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
              <Text className="text-[24px]">⭐</Text>
              <Text className="text-[16px] font-instrument_semibold text-[#3E3BEE]">
                + {currentXP} XP
              </Text>
              {showXPDeduction && (
                <Animated.Text
                  style={{
                    color: "#FF1214",
                    fontWeight: "bold",
                    marginLeft: 8,
                    opacity: xpDeductionAnim,
                    transform: [
                      {
                        translateY: xpDeductionAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      },
                    ],
                  }}
                  className="text-[16px]"
                >
                  -{HINT_PENALTY} XP
                </Animated.Text>
              )}
            </View>
          </View>

          {/* Selected Word */}
          <View
            className={`w-[210px] h-[50px] rounded-[5px] mx-auto ${
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
            {currentBoard.map((row, rowIndex) => (
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
                          ? "w-[45px] h-[45px] mx-1" // Smaller tiles for 6x6 grid on Android
                          : "w-[55px] h-[55px] mx-1" // Smaller tiles for 6x6 grid on iOS
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
                hintsUsed >= 2 || getRandomHint() === ""
                  ? "bg-[#CCCCCC]"
                  : "bg-[#3E3BEE]"
              }`}
              disabled={hintsUsed >= 2 || getRandomHint() === ""}
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
                selectedLetters.length >= 2 ? "bg-[#FFBB32]" : "bg-[#CCCCCC]"
              }`}
              disabled={selectedLetters.length < 2}
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
            validWords={validWords}
            isSuccess={false}
            timeTaken={formatTime(300 - timeLeft)}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default BasicGame;
