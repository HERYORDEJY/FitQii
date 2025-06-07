import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { COLORS } from "~/constants/Colors";
import { CustomTextInputProps } from "~/components/inputs/types";

interface Props extends CustomTextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: TextInputProps["style"];
  renderLeftElement?: React.ReactNode;
  renderRightElement?: React.ReactNode;
}

export default function CustomTextInput(props: Props): React.JSX.Element {
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.label ? <Text style={[styles.label]}>{props.label}</Text> : null}
      <View style={[styles.contentContainer, props.contentContainerStyle]}>
        {props.renderLeftElement}
        <TextInput
          {...props}
          style={[styles.textInput, props.textInputStyle]}
          placeholderTextColor={COLORS.text.tertiary}
        />
        {props.renderRightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  contentContainer: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background.card,
    height: 40,
    paddingHorizontal: 10,
    columnGap: 10,
  },
  label: {},
  textInput: {
    flex: 1,
    fontFamily: "regular",
    fontSize: 14,
    color: COLORS.text.primary,
  },
});
