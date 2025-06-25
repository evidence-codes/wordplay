import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  validWords: string[];
  isSuccess?: boolean;
  timeTaken?: string;
};

const GameModal = ({
  visible,
  onClose,
  validWords,
  isSuccess = false,
  timeTaken,
}: ModalProps) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <BlurView intensity={20} tint="dark" style={{ flex: 1 }}>
      <View className="flex-1 justify-center items-center">
        <View className="bg-white w-[85%] rounded-[24px] px-8 pt-24 pb-10 items-center relative overflow-hidden shadow-2xl">
          {/* Decorative Elements */}
          {isSuccess && (
            <Image
              source={require("../assets/images/confetti.png")}
              width={100}
              height={100}
              className="width-[200px] h-[200px] absolute top-0 left-0 right-0"
            />
          )}
          {/* Trophy/Clock Container with Shadow */}
          <View
            className="absolute -top-14 rounded-full shadow-xl"
            // style={{
            //   shadowColor: "#000",
            //   shadowOffset: { width: 0, height: 4 },
            //   shadowOpacity: 0.15,
            //   shadowRadius: 12,
            //   elevation: 8,
            // }}
          >
            <Image
              source={
                isSuccess
                  ? require("../assets/images/trophy.png")
                  : require("../assets/images/clock.png")
              }
              className="w-[300px] h-[300px] pt-20"
            />
          </View>
          {/* Content */}
          <View className="pt-[200px]">
            <Text
              className={`text-[36px] ${
                isSuccess ? "text-[#3E3BEE]" : "text-[#FF1214]"
              } font-instrument_semibold text-center leading-[100%]`}
              // className=
              style={{ letterSpacing: 0.5 }}
            >
              {isSuccess ? "Well Done!" : "Time's Up!"}
            </Text>
          </View>

          {/* Use proper ternary for conditional rendering */}
          {isSuccess ? (
            <>
              <View className="w-full space-y-6 flex-row justify-around items-center">
                {/* Time Stats */}
                <View className="p-4">
                  <Text className="text-[14px] text-[#666] text-right font-instrument_regular">
                    Time Taken
                  </Text>
                  <Text className="text-[32px] font-instrument_bold text-[#3E3BEE] text-center">
                    {timeTaken}
                  </Text>
                </View>

                {/* XP Stats */}
                <View className="p-4">
                  <Text className="text-[14px] text-[#666] text-left font-instrument_regular">
                    XP Earned
                  </Text>
                  <Text className="text-[32px] font-instrument_bold text-[#FFBB32] text-center">
                    +{validWords.length * 45}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row justify-between w-full mt-8 mb-6">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 mx-2 items-center"
                >
                  <MaterialCommunityIcons
                    name="refresh"
                    size={24}
                    color="#3E3BEE"
                  />
                  <Text className="text-[#3E3BEE] text-center font-instrument_semibold text-[10px]">
                    Replay Puzzle
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 mx-2 items-center"
                >
                  <MaterialCommunityIcons
                    name="home"
                    size={24}
                    color="#3E3BEE"
                  />
                  <Text className="text-[#3E3BEE] text-center font-instrument_semibold text-[10px]">
                    Home
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Main Action Button */}
              <TouchableOpacity
                onPress={onClose}
                className="w-full mt-2 bg-[#3E3BEE] rounded-[8px] py-4"
                style={{
                  shadowColor: "#3E3BEE",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Text className="text-white text-center font-instrument_bold text-[16px]">
                  Next Puzzle
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View className="w-full justify-center items-center">
                {/* Time Stats */}
                <View className="p-4">
                  <Text className="text-[14px] text-[#666] text-right font-instrument_regular">
                    Time Taken
                  </Text>
                  <Text className="text-[32px] font-instrument_bold text-[#FF1214] text-center">
                    {timeTaken}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row justify-between w-full mt-8 mb-6">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 mx-2 items-center"
                >
                  <MaterialCommunityIcons
                    name="refresh"
                    size={24}
                    color="#3E3BEE"
                  />
                  <Text className="text-[#3E3BEE] text-center font-instrument_semibold text-[10px]">
                    Replay Puzzle
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 mx-2 items-center"
                >
                  <MaterialCommunityIcons
                    name="home"
                    size={24}
                    color="#3E3BEE"
                  />
                  <Text className="text-[#3E3BEE] text-center font-instrument_semibold text-[10px]">
                    Home
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </BlurView>
  </Modal>
);

export default GameModal;
