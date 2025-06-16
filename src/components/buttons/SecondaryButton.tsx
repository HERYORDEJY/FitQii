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
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: TextStyle;
  animating?: boolean;
  leftElement?: any;
  loading?: boolean;
  children?: string | React.ReactElement;
}

export default function SecondaryButton(props: Props): React.JSX.Element {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      {...props}
      style={[
        styles.container,
        {
          opacity: props.disabled ? 0.2 : 1,
        },
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
            color={COLORS.primary}
            fontFamily={"bold"}
            fontSize={16}
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
    backgroundColor: "transparent",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: COLORS.outline.card,
    borderWidth: 2,
  },
});
