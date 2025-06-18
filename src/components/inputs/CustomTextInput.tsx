import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { COLORS } from "~/constants/Colors";
import { CustomTextInputProps } from "~/components/inputs/types";
import CustomText from "~/components/general/CustomText";

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
    <View
      testID={"input-container"}
      style={[styles.container, props.containerStyle]}
    >
      {props.label ? (
        <CustomText style={[styles.label]}>{props.label}</CustomText>
      ) : null}
      <View
        testID={"input-content-container"}
        style={[styles.contentContainer, props.contentContainerStyle]}
      >
        {props.renderLeftElement}
        <TextInput
          testID={"text-input"}
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
