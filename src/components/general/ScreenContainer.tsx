import React, { PropsWithChildren } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { StatusBar, StatusBarProps } from "expo-status-bar";
import { Edges, SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "~/constants/Colors";

interface Props extends PropsWithChildren {
  style?: ViewStyle;
  edges?: Edges;
  topSafeArea?: boolean;
  bottomSafeArea?: boolean;
  leftSafeArea?: boolean;
  rightSafeArea?: boolean;
  statusBar?: StatusBarProps;
}

export default function ScreenContainer({
  bottomSafeArea = false,
  leftSafeArea = true,
  rightSafeArea = true,
  topSafeArea = false,
  ...props
}: Props): React.JSX.Element {
  const edges = [
    ...(topSafeArea ? ["top"] : []),
    ...(leftSafeArea ? ["left"] : []),
    ...(rightSafeArea ? ["right"] : []),
    ...(bottomSafeArea ? ["bottom"] : []),
  ] as Edges;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: COLORS.background.screen,
        },
        props.style,
      ]}
      edges={edges}
    >
      <StatusBar
        style={"light"}
        backgroundColor={"transparent"}
        translucent={true}
        {...props.statusBar}
      />
      <>{props.children}</>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
