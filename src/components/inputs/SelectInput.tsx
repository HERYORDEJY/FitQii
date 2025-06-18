import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import CustomTextInput from "~/components/inputs/CustomTextInput";
import {
  CustomTextInputProps,
  SelectOptionType,
} from "~/components/inputs/types";
import ChevronDown from "~/components/svgs/ChevronDown";
import CustomText from "~/components/general/CustomText";
import CustomActionSheet from "~/components/general/CustomActionSheet";
import { ActionSheetRef } from "react-native-actions-sheet";

type Props = CustomTextInputProps & {
  selectTitle?: string;
  options: Array<SelectOptionType>;
  disabled?: boolean;
  onSelectOption: (option: SelectOptionType) => void;
  selectedOptionValue: string;
  sheetContentContainerStyle?: StyleProp<ViewStyle>;
};

export default function SelectInput(props: Props): React.JSX.Element {
  const [selectedOption, setSelectedOption] = useState<SelectOptionType | null>(
    null,
  );
  const sheetRef = useRef<ActionSheetRef>(null);
  const isDisabled = props.disabled || !Boolean(props.options?.length);
  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);

  const handleOpenSelect = () => {
    sheetRef.current?.show();
  };

  const handleSelectOption = (option: SelectOptionType) => {
    setSelectedOption(option);
    props.onSelectOption?.(option);
    sheetRef.current?.hide();
  };

  const renderItem: ListRenderItem<SelectOptionType> = useCallback(
    ({ item, index }) => {
      const isSelected =
        selectedOption?.value === item.value &&
        selectedOption?.label === item.label;
      return (
        <CustomActionSheet.Item
          key={`${item.id ?? item.value}-${index}`}
          onPress={() => handleSelectOption(item)}
          style={[styles.item]}
          active={isSelected}
        >
          {item.label}
        </CustomActionSheet.Item>
      );
    },
    [props.selectedOptionValue],
  );

  useEffect(() => {
    setSelectedOption(() => {
      return props.options.find((option) => {
        return option.value === props.selectedOptionValue;
      });
    });
  }, [props.selectedOptionValue]);

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenSelect}
        disabled={isDisabled}
        style={styles.container}
      >
        {props.label ? (
          <CustomText style={[styles.label]}>{props.label}</CustomText>
        ) : null}
        <CustomTextInput
          {...props}
          placeholder={props.placeholder ?? "Select here"}
          renderRightElement={<ChevronDown />}
          pointerEvents={"none"}
          value={selectedOption?.label ?? selectedOption?.name}
          label={undefined}
          editable={false}
        />
      </TouchableOpacity>

      <CustomActionSheet.Container
        sheetRef={sheetRef}
        title={props.selectTitle ?? "Select"}
      >
        <FlatList
          data={props.options}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.contentContainer,
            props.sheetContentContainerStyle,
          ]}
          ItemSeparatorComponent={() => <View style={[styles.itemSeparator]} />}
        />
      </CustomActionSheet.Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  item: {
    // height: 40,
    flexDirection: "row",
    // borderLeftWidth: 6,
    // borderLeftColor: "transparent",
    alignItems: "center",
    columnGap: 10,
  },
  contentContainer: {
    rowGap: 10,
  },
  label: {},
  itemSeparator: {
    height: 2,
    width: "100%",
    backgroundColor: "#00000020",
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
