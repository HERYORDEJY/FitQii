import { StyleProp, TextInputProps, ViewStyle } from "react-native";
import React from "react";

export interface CustomTextInputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: TextInputProps["style"];
  renderLeftElement?: React.ReactNode;
  renderRightElement?: React.ReactNode;
}

export type SelectOptionType = Record<string, any>;
