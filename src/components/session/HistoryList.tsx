import React, { useCallback } from "react";
import {
  SectionList,
  SectionListData,
  SectionListProps,
  SectionListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import CustomText from "~/components/general/CustomText";
import { addDays, format } from "date-fns";
import { COLORS } from "~/constants/Colors";
import TodaySessionListItem from "~/components/session/TodaySessionListItem";

interface Props extends Partial<SectionListProps<any>> {
  // TODO:: implement correct ListRenderItem type
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  selectedDate?: Date; // Optional prop to set the active date
}

export default function HistoryList(props: Props): React.JSX.Element {
  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);

  const renderItem: SectionListRenderItem<any> = useCallback(
    // TODO:: implement correct ListRenderItem type
    ({ item, index, section }) => {
      const isLastItem = index === section.data.length - 1;
      return (
        <>
          <TodaySessionListItem item={item} key={`${index}`} />
          {isLastItem ? <View style={[styles.headerLine]} /> : null}
        </>
      );
    },
    [],
  );

  const renderSectionHeader = useCallback(
    // TODO:: implement correct ListRenderItem type   //<Item, Section>
    ({ section: { title, index } }: { section: SectionListData<any, any> }) => {
      const sectionIndex = sections.findIndex((s) => s.title === title);
      const itemDate = addDays(new Date(), sectionIndex);
      const isToday =
        format(itemDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

      return (
        <View style={styles.sectionHeader} key={`${index}`}>
          <CustomText fontFamily={"medium"} fontSize={16} color={"#FFF"}>
            {format(itemDate, "EEE, d MMMM, yyyy")}
          </CustomText>
          <View style={{ flex: 1 }} />
          <CustomText fontSize={12} color={COLORS.text.tertiary}>
            Week {format(itemDate, "w")}
          </CustomText>
          {/*<CustomText style={styles.sectionHeaderTitle}>{title}</CustomText>*/}
        </View>
      );
    },
    [],
  );

  return (
    <SectionList
      sections={sections}
      {...props}
      style={[styles.container, props.containerStyle]}
      data={[...Array(10).keys()]} // TODO:: add actual data
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={[
        styles.contentContainer,
        props.contentContainerStyle,
      ]}
      renderSectionHeader={renderSectionHeader}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    //
  },
  contentContainer: {
    rowGap: 12,
    paddingBottom: 150,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    backgroundColor: COLORS.background.screen,
    paddingBottom: 5,
  },
  sectionHeaderTitle: {},
  headerLine: {
    height: 2,
    backgroundColor: COLORS.background.card,
    marginTop: 10,
  },
});

const sections = [
  {
    title: "Section 1",
    data: ["Item 1", "Item 2"],
  },
  {
    title: "Section 2",
    data: ["Item 3", "Item 4", "Item 5"],
  },
  {
    title: "Section 3",
    data: ["Item 6"],
  },
  {
    title: "Section 4",
    data: ["Item 1", "Item 2"],
  },
  {
    title: "Section 5",
    data: ["Item 3", "Item 4", "Item 5"],
  },
  {
    title: "Section 6",
    data: ["Item 6"],
  },
];
