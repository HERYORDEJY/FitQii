import React, { useCallback } from "react";
import {
  DefaultSectionT,
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
import { addDays, format, isToday } from "date-fns";
import { COLORS } from "~/constants/Colors";
import TodaySessionListItem from "~/components/session/TodaySessionListItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SessionItemDataType } from "~/components/session/types";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { sessionsDb } from "~/db";
import { sessionsSchema } from "~/db/schema";

interface Props extends Partial<SectionListProps<SessionItemDataType>> {
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  selectedDate?: Date; // Optional prop to set the active date
}

export default function HistoryList(props: Props): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 69 + safeAreaInsets.bottom / 2;
  const sessionDbLiveQuery = useLiveQuery(
      sessionsDb.select().from(sessionsSchema),
    ),
    data = sessionDbLiveQuery.data.filter((session) =>
      isToday(session.start_date),
    );

  console.log("\n\n data :>> \t\t", sessionDbLiveQuery.data, "\n\n---");

  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);

  const renderItem: SectionListRenderItem<SessionItemDataType> = useCallback(
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
    ({
      section: { title },
    }: {
      section: SectionListData<SessionItemDataType, DefaultSectionT>;
    }) => {
      const sectionIndex = sections.findIndex((s) => s.title === title);
      const itemDate = addDays(new Date(), sectionIndex);
      const isToday =
        format(itemDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

      return (
        <View style={styles.sectionHeader} key={`${title}`}>
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
      sections={[]} // TODO:: add actual data
      {...props}
      style={[styles.container, props.containerStyle]}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={[
        styles.contentContainer,
        props.contentContainerStyle,
        { paddingBottom: 150 + TAB_BAR_HEIGHT },
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

const sections = [] as Array<any>; // TODO:: remove
