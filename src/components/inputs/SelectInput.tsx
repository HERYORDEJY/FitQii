import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
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
  options: SelectOptionType[];
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
      const isSelected =
        props.selectedOptionValue === item.id ||
        props.selectedOptionValue === item.value;
      return (
        <TouchableOpacity
          key={`${item.id ?? item.value}-${index}`}
          onPress={() => handleSelectOption(item)}
          style={[
            styles.item,
            isSelected && {
              borderLeftColor: COLORS.primary,
              backgroundColor: COLORS.primary + "20",
            },
          ]}
        >
          <CustomText>{item.label}</CustomText>
        </TouchableOpacity>
      );
    },
    [props.selectedOptionValue],
  );

  useEffect(() => {
    setSelectedOption(() => {
      return props.options.find(
        (option) =>
          option.id === props.selectedOptionValue ||
          option.value === props.selectedOptionValue,
      );
    });
  }, [props.selectedOptionValue]);

  return (
    <>
      <TouchableOpacity onPress={handleOpenSelect} disabled={isDisabled}>
        <CustomTextInput
          {...props}
          placeholder={props.placeholder ?? "Select here"}
          renderRightElement={<ChevronDown />}
          pointerEvents={"none"}
          value={selectedOption?.label ?? selectedOption?.name}
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
            />
          );
        }}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    //
  },
  item: {
    height: 40,
    flexDirection: "row",
    borderLeftWidth: 6,
    borderLeftColor: "transparent",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  contentContainer: {
    rowGap: 10,
  },
});
