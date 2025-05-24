// components/DefaultText.tsx
import { Text as RNText, TextProps } from "react-native";

export default function Text(props: TextProps) {
  return (
    <RNText
      {...props}
      style={[{ fontFamily: "InstrumentSans-Regular" }, props.style]}
    >
      {props.children}
    </RNText>
  );
}
