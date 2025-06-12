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
import SessionsListItem from "~/components/session/SessionsListItem";
import CustomText from "~/components/general/CustomText";
import { addDays, format } from "date-fns";
import { COLORS } from "~/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SessionItemDataType } from "~/components/session/types";

interface Props extends Partial<SectionListProps<SessionItemDataType>> {
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  selectedDate?: Date; // Optional prop to set the active date
}

export default function SessionsList(props: Props): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 69 + safeAreaInsets.bottom / 2;

  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);

  const renderItem: SectionListRenderItem<SessionItemDataType> = useCallback(
    ({ item, index, section }) => {
      const isLastItem = index === section.data.length - 1;
      return (
        <>
          <SessionsListItem item={item} key={`${index}`} />
          {isLastItem ? <View style={[styles.headerLine]} /> : null}
        </>
      );
    },
    [],
  );

  const renderSectionHeader = useCallback(
    ({
      section: { title, index },
    }: {
      section: SectionListData<SessionItemDataType, DefaultSectionT>;
    }) => {
      const sectionIndex = sections.findIndex((s) => s.title === title);
      const itemDate = addDays(new Date(), sectionIndex);
      const isToday =
        format(itemDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

      return (
        <View style={styles.sectionHeader} key={`${index}`}>
          <CustomText
            fontFamily={"medium"}
            fontSize={16}
            color={isToday ? COLORS.secondary : "#FFF"}
          >
            {format(itemDate, "d MMM")}
          </CustomText>
          <CustomText color={isToday ? COLORS.secondary : "#FFF"}>
            {isToday ? "Today" : ""}
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
        { paddingBottom: 320 + TAB_BAR_HEIGHT },
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
    paddingBottom: 320,
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
