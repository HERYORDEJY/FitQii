import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { COLORS } from "~/constants/Colors";

interface Props extends TextProps {
  color?: string;
  fontSize?: number;
  fontFamily?:
    | "light"
    | "regular"
    | "medium"
    | "bold"
    | "black"
    | "Space Grotesk";
}

export default function CustomText(props: Props): React.JSX.Element {
  const {
    color = COLORS.text.primary,
    fontSize = 14,
    fontFamily = "regular",
  } = props;
  return (
    <Text
      {...props}
      style={[
        styles.container,
        {
          color,
          fontSize,
          fontFamily,
          fontWeight: 300,
        },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
});
