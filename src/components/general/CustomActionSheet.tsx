import React, { RefObject } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import ActionSheet, {
  ActionSheetProps,
  ActionSheetRef,
} from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import SearchInput from "~/components/inputs/SearchInput";

export interface CustomActionSheetContainerProps extends ActionSheetProps {
  sheetRef: RefObject<ActionSheetRef | null>;
  title?: string;
  subtitle?: string;
  showDone?: boolean;
  onDone?: (props?: any) => void | Promise<void>;
  onClose?: () => void | Promise<void>;
  onSearch?: (text: string) => void;
  containerStyle?: ViewStyle;
  showSearch?: boolean;
  searchStyle?: StyleProp<ViewStyle>;
  selectIndicatorType?: "radio" | "check" | null;
  renderDoneElement?: React.ReactNode;
  doneTitle?: string;
  closeTitle?: string;
  showHeader?: boolean;
  style?: ViewStyle;
}

export interface CustomActionSheetItemProps extends TouchableOpacityProps {
  active?: boolean;
  children: string | React.ReactNode;
  titleStyle?: TextStyle;
}

function CustomActionSheetContainer({
  showHeader = true,
  showSearch = false,
  headerAlwaysVisible = true,
  backgroundInteractionEnabled = false,
  selectIndicatorType = "radio",
  ...props
}: CustomActionSheetContainerProps): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();

  const handleDone = async () => {
    await props.onDone?.();
    props.sheetRef?.current?.hide();
  };

  const handleClose = async () => {
    await props.onClose?.();
    props.sheetRef?.current?.hide();
  };

  return (
    <View>
      <ActionSheet
        testIDs={{ modal: "action-sheet-modal" }}
        {...props}
        overlayColor={"#000000"}
        defaultOverlayOpacity={0.7}
        ref={props.sheetRef}
        backgroundInteractionEnabled={backgroundInteractionEnabled}
        useBottomSafeAreaPadding={true}
        safeAreaInsets={{
          bottom: 0, //safeAreaInsets.bottom,
          top: 0,
          left: 0,
          right: 0,
          ...props.safeAreaInsets,
        }}
        containerStyle={{
          ...styles.sheetContainer,

          backgroundColor: COLORS.background.card,
          ...props.style,
        }}
        headerAlwaysVisible={headerAlwaysVisible}
        indicatorStyle={{
          ...styles.sheetHandleBarLine,
          backgroundColor: COLORS.background.screen,
        }}
        onClose={props.onClose}
      >
        {showHeader ? (
          <View style={{}}>
            <View style={styles.header}>
              <View style={{ flex: 0.2 }}>
                <TouchableOpacity onPress={handleClose} testID="close-button">
                  <CustomText
                    fontFamily={"medium"}
                    style={[styles.done]}
                    color={COLORS.text.tertiary}
                    testID={"close-button-text"}
                  >
                    {props.closeTitle ?? "Close"}
                  </CustomText>
                </TouchableOpacity>
              </View>

              <View
                style={styles.titleWrapper}
                testID={"action-sheet-title-wrapper"}
              >
                {props.title ? (
                  <CustomText
                    fontFamily={"bold"}
                    style={[styles.title]}
                    testID={"action-sheet-title"}
                  >
                    {props.title}
                  </CustomText>
                ) : null}
              </View>

              <View style={{ flex: 0.2 }}>
                {props.showDone
                  ? (props.renderDoneElement ?? (
                      <TouchableOpacity
                        onPress={handleDone}
                        testID={"done-button"}
                      >
                        <CustomText
                          fontFamily={"medium"}
                          style={[styles.done]}
                          color={COLORS.primary}
                          testID={"done-button-text"}
                        >
                          {props.doneTitle ?? "Done"}
                        </CustomText>
                      </TouchableOpacity>
                    ))
                  : null}
              </View>
            </View>
            {props.subtitle ? (
              <CustomText
                style={[styles.subtitle]}
                color={COLORS.text.secondary}
              >
                {props.subtitle}
              </CustomText>
            ) : null}
          </View>
        ) : null}
        {showSearch ? <SearchInput onChangeText={props.onSearch} /> : null}

        <View
          style={[
            styles.container,
            {
              paddingBottom: safeAreaInsets.bottom,
            },
            props.containerStyle,
          ]}
        >
          {props.children}
        </View>
      </ActionSheet>
    </View>
  );
}

function CustomActionSheetItem({
  ...props
}: CustomActionSheetItemProps): React.JSX.Element {
  const isSelected = props.active;
  const isDisabled = props.disabled;

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.85}
      style={[styles.item, { opacity: isDisabled ? 0.4 : 1 }, props.style]}
    >
      <View
        style={[
          styles.itemRadioCheck,
          isSelected && { borderColor: COLORS.secondary },
        ]}
      >
        <View
          style={[
            styles.itemRadioCheckActive,
            isSelected && { backgroundColor: COLORS.secondary },
          ]}
        />
      </View>
      {typeof props.children === "string" ? (
        <CustomText style={[styles.itemTitle, props.titleStyle]}>
          {props.children}
        </CustomText>
      ) : (
        props.children
      )}
    </TouchableOpacity>
  );
}

function Component(): React.JSX.Element {
  return <></>;
}

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    width: "100%",
    paddingVertical: 20,
    paddingTop: 5,
    paddingHorizontal: 20,
    rowGap: 8,
    overflow: "hidden",
  },
  sheetHandleBar: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 18,
    paddingBottom: 20,
  },
  sheetHandleBarLine: {
    width: 40,
    height: 5,
    borderRadius: 5,
    marginTop: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    lineHeight: 27.28,
  },
  subtitle: {
    // fontSize: 15,
    lineHeight: 20.46,
    textAlign: "center",
    marginTop: 9,
    paddingHorizontal: 20,
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",

    width: "100%",
  },
  header: {
    rowGap: 31,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // flex: 1,
  },

  done: { fontSize: 15, lineHeight: 24.55 },
  searchBar: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    height: 41,
    borderRadius: 12,
    columnGap: 11,
    paddingLeft: 18,
    marginHorizontal: 20,
  },
  textInput: {
    height: "100%",
    flex: 1,
  },
  item: {
    paddingTop: 0,
    // backgroundColor: "#F4F4F490",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    paddingHorizontal: 25,
    columnGap: 25,
  },
  itemTitle: {
    fontSize: 18,
  },
  itemRadioCheck: {
    height: 16,
    width: 16,
    borderRadius: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF60",
    padding: 2.5,
    overflow: "hidden",
  },
  itemRadioCheckActive: {
    height: "100%",
    width: "100%",
    borderRadius: 100,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
});

type ComposedSheetComponent = typeof Component & {
  Item: typeof CustomActionSheetItem;
  Container: typeof CustomActionSheetContainer;
};

const CustomActionSheet = Component as ComposedSheetComponent;
CustomActionSheet.Item = CustomActionSheetItem;
CustomActionSheet.Container = CustomActionSheetContainer;

export default CustomActionSheet;
