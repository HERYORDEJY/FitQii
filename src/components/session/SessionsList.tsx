import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DefaultSectionT,
  LayoutChangeEvent,
  RefreshControl,
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
import { format } from "date-fns";
import { COLORS } from "~/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SessionItemDataType } from "~/components/session/types";
import { useWeeksSessions } from "~/services/db/actions";
import CustomActivityIndicator from "~/components/general/CustomActivityIndicator";
import { errorLogOnDev } from "~/utils/log-helpers";

interface Props extends Partial<SectionListProps<SessionItemDataType>> {
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  searchQuery?: string;
  selectedDate?: {
    date: Date;
    index: number;
  };
  headerHeight: number;
}

export default function SessionsList(props: Props): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 69 + safeAreaInsets.bottom / 2;
  const sectionListRef = useRef<SectionList<SessionItemDataType>>(null);
  const [itemHeight, setItemHeight] = useState(0);

  const weeksSessionsQuery = useWeeksSessions({
    // week: Number(format(new Date(), "w")),
    searchQuery: props.searchQuery,
    // referenceDate: new Date(),
  });

  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);

  const handleSetItemHeight = (event: LayoutChangeEvent, itemIndex: number) => {
    if (itemIndex === 0) {
      const { height } = event.nativeEvent.layout;
      setItemHeight(height);
    }
  };

  const handleRefreshList = async () => {
    try {
      await weeksSessionsQuery.refetch();
    } catch (error) {
      errorLogOnDev("Error refreshing sessions list:", error);
    }
  };

  const renderItem: SectionListRenderItem<SessionItemDataType> = useCallback(
    ({ item, index, section }) => {
      const isLastItem = index === section?.data?.length - 1;
      return (
        <View onLayout={(event) => handleSetItemHeight(event, index)}>
          <SessionsListItem item={item} key={`${index}`} />
          {isLastItem ? <View style={[styles.headerLine]} /> : null}
        </View>
      );
    },
    [],
  );

  const renderSectionHeader = useCallback(
    ({
      section: { title, data },
    }: {
      section: SectionListData<SessionItemDataType, DefaultSectionT>;
    }) => {
      const isToday =
        format(new Date(title), "yyyy-MM-dd") ===
        format(new Date(), "yyyy-MM-dd");

      return (
        <View style={styles.sectionHeader} key={`${title}`}>
          <View style={styles.sectionHeaderBody} key={`${title}`}>
            <CustomText
              fontFamily={"medium"}
              fontSize={16}
              color={isToday ? COLORS.secondary : "#FFF"}
            >
              {format(new Date(title), "eee, d MMM")}
            </CustomText>
            <CustomText color={isToday ? COLORS.secondary : "#FFF"}>
              {isToday ? "Today" : ""}
            </CustomText>
            <View style={{ flex: 1 }} />
            <CustomText fontSize={12} color={COLORS.text.tertiary}>
              Week {format(new Date(title), "w")}
            </CustomText>
          </View>

          {!Boolean(data?.length) ? (
            <View style={[styles.noSessionsWrapper]}>
              <CustomText
                color={COLORS.text.tertiary}
                style={{ letterSpacing: -0.02 * 14 }}
              >
                {Boolean(props.searchQuery?.trim())
                  ? "No session match search query"
                  : "No Session"}
              </CustomText>
              <View style={[styles.headerLine]} />
            </View>
          ) : null}
        </View>
      );
    },
    [props.searchQuery],
  );

  const renderListEmptyComponent = useCallback(() => {
    return (
      <View style={[styles.noSessionsWrapper]}>
        <CustomText
          style={{
            textAlign: "center",
          }}
          color={COLORS.text.secondary}
        >
          {Boolean(props.searchQuery)
            ? "No session meets search query"
            : "No sessions available for the week."}
        </CustomText>
      </View>
    );
  }, [props.searchQuery]);

  useEffect(() => {
    if (!isNaN(props.selectedDate?.index!)) {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: props.selectedDate?.index!,
        itemIndex: 0,
        animated: true,
        viewOffset: 20, // Optional: give space from top
      });
    }
  }, [props.selectedDate]);

  if (
    (!Boolean(weeksSessionsQuery?.data?.length) &&
      weeksSessionsQuery?.isLoading) ||
    !Boolean(props.headerHeight)
  ) {
    return (
      <>
        <CustomActivityIndicator />
      </>
    );
  }

  return (
    <>
      <SectionList
        {...props}
        // @ts-ignore
        sections={weeksSessionsQuery?.data ?? []}
        ref={sectionListRef}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.contentContainer,
          props.contentContainerStyle,
          { paddingBottom: 320 + TAB_BAR_HEIGHT },
        ]}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderListEmptyComponent}
        getItemLayout={(data, index) => ({
          length: itemHeight,
          offset:
            itemHeight * index + props.headerHeight * Math.floor(index / 2), // adjust if needed
          index,
        })}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefreshList}
            refreshing={weeksSessionsQuery.isRefetching}
          />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    rowGap: 12,
    paddingBottom: 320,
  },
  sectionHeader: {
    rowGap: 20,
  },
  sectionHeaderBody: {
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
  noSessionsWrapper: {
    rowGap: 0,
  },
});
