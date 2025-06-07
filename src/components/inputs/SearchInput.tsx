import React from "react";
import { StyleSheet } from "react-native";
import CustomTextInput from "~/components/inputs/CustomTextInput";
import { CustomTextInputProps } from "~/components/inputs/types";
import SearchIcon from "~/components/svgs/SearchIcon";

type Props = CustomTextInputProps;

export default function SearchInput(props: Props): React.JSX.Element {
  return (
    <CustomTextInput
      {...props}
      placeholder={props.placeholder ?? "Search here"}
      renderLeftElement={<SearchIcon />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    //
  },
});
