import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import CustomActivityIndicator from "~/components/general/CustomActivityIndicator";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";

interface Props extends TouchableOpacityProps {
  type?: "primary" | "secondary";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: TextStyle;
  animating?: boolean;
  leftElement?: any;
  loading?: boolean;
  children?: string | React.ReactElement;
}

export default function CustomButton({
  type = "primary",
  ...props
}: Props): React.JSX.Element {
  const isPrimaryType = type === "primary";
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      {...props}
      style={[
        styles.container,
        {
          opacity: props.disabled ? 0.2 : 1,
        },
        isPrimaryType && {
          backgroundColor: props.loading
            ? `${COLORS.primary}65`
            : COLORS.primary,
        },
        !isPrimaryType && { borderColor: COLORS.outline.card, borderWidth: 2 },
        props.style,
      ]}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? (
        <CustomActivityIndicator color="white" size="small" />
      ) : typeof props.children === "string" ? (
        <>
          {props?.leftElement ? <View>{props?.leftElement}</View> : null}
          <CustomText
            color={isPrimaryType ? COLORS.background.screen : COLORS.primary}
            fontFamily={"bold"}
            fontSize={props.titleStyle?.fontSize ?? 16}
            style={[props.titleStyle]}
          >
            {props.children}
          </CustomText>
        </>
      ) : (
        props.children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
