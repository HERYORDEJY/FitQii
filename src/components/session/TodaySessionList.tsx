import React, { useCallback } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import TodaySessionListItem from "~/components/session/TodaySessionListItem";

interface Props extends Partial<FlatListProps<any>> {
  // TODO:: implement correct ListRenderItem type
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function TodaySessionList(props: Props): React.JSX.Element {
  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);

  const renderItem: ListRenderItem<any> = useCallback(
    // TODO:: implement correct ListRenderItem type
    ({ item, index }) => {
      return <TodaySessionListItem item={item} key={index} />;
    },
    [],
  );

  return (
    <FlatList
      {...props}
      style={[styles.container, props.containerStyle]}
      data={[...Array(10).keys()]} // TODO:: add actual data
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={[
        styles.contentContainer,
        props.contentContainerStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    //
  },
  contentContainer: {
    rowGap: 12,
    paddingBottom: 200,
  },
});
