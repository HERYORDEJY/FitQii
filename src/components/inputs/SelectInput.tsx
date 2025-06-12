import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomTextInput from "~/components/inputs/CustomTextInput";
import {
  CustomTextInputProps,
  SelectOptionType,
} from "~/components/inputs/types";
import ChevronDown from "~/components/svgs/ChevronDown";
import { BottomSheetRef } from "~/components/general/types";
import BottomSheet from "~/components/general/BottomSheet";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";

type Props = CustomTextInputProps & {
  selectTitle?: string;
  options: Array<SelectOptionType>;
  disabled?: boolean;
  onSelectOption: (option: SelectOptionType) => void;
  selectedOptionValue: string;
};

export default function SelectInput(props: Props): React.JSX.Element {
  const [selectedOption, setSelectedOption] = useState<SelectOptionType | null>(
    null,
  );
  const sheetRef = useRef<BottomSheetRef>(null);
  const isDisabled = props.disabled || !Boolean(props.options?.length);
  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);

  const handleOpenSelect = () => {
    sheetRef.current?.open({
      title: "Hello World",
      items: [...Array(10).keys()],
    });
  };

  const handleSelectOption = (option: SelectOptionType) => {
    props.onSelectOption?.(option);
    sheetRef.current?.close();
  };

  const renderItem: ListRenderItem<any> = useCallback(
    // TODO:: implement correct ListRenderItem type
    ({ item, index }) => {
      const isSelected = props.selectedOptionValue === item.value;
      return (
        <TouchableOpacity
          key={`${item.id ?? item.value}-${index}`}
          onPress={() => handleSelectOption(item)}
          style={[
            styles.item,
            // isSelected && {
            //   borderLeftColor: COLORS.primary,
            //   backgroundColor: COLORS.primary + "20",
            // },
          ]}
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
          <CustomText>{item.label}</CustomText>
        </TouchableOpacity>
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
        />
      </TouchableOpacity>

      <BottomSheet ref={sheetRef} title={props.selectTitle ?? "Select"}>
        {() => {
          return (
            <FlatList
              data={props.options}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyExtractor={keyExtractor}
              contentContainerStyle={[styles.contentContainer]}
              ItemSeparatorComponent={() => (
                <View style={[styles.itemSeparator]} />
              )}
            />
          );
        }}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  item: {
    height: 40,
    flexDirection: "row",
    // borderLeftWidth: 6,
    // borderLeftColor: "transparent",
    alignItems: "center",
    paddingHorizontal: 10,
    columnGap: 10,
  },
  contentContainer: {
    rowGap: 10,
    paddingBottom: 150,
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
  },
  itemRadioCheckActive: {
    height: "100%",
    width: "100%",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
});
