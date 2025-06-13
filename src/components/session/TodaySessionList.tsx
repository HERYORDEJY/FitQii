import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import TodaySessionListItem from "~/components/session/TodaySessionListItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SessionItemDataType } from "~/components/session/types";
import { sessionsDb } from "~/db";
import { sessionsSchema } from "~/db/schema";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "~/db/drizzle/migrations";
import { useFocusEffect } from "expo-router";
import { useBooleanValue } from "~/hooks/useBooleanValue";

interface Props extends Partial<FlatListProps<any>> {
  // TODO:: implement correct ListRenderItem type
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onSearchSession?: (searchText: string) => void;
  searchQuery?: string;
}

export default function TodaySessionList(props: Props): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 69 + safeAreaInsets.bottom / 2;
  const sessionsDbMigrations = useMigrations(sessionsDb, migrations);
  const isFetchingSessionsData = useBooleanValue(true);
  const [todaySessionsData, setTodaySessionsData] = useState<
    Array<SessionItemDataType>
  >([]);
  const [filteredSessionsData, setFilteredSessionsData] = useState<
    Array<SessionItemDataType>
  >([]);

  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);

  const handleFetchSessions = async () => {
    isFetchingSessionsData.setTrueValue();
    try {
      const result = await sessionsDb.select().from(sessionsSchema);
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const todayEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );
      const todaySessions = result.filter((session) => {
        const sessionStart = new Date(session.start_date);
        const sessionEnd = new Date(session.end_date);

        return sessionStart <= todayEnd && sessionEnd >= todayStart;
      });

      return todaySessions as Array<SessionItemDataType>;
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      isFetchingSessionsData.setFalseValue();
    }
  };

  const handleSearchSession = () => {
    if (!Boolean(props.searchQuery)) {
      setFilteredSessionsData(todaySessionsData);
      return;
    }

    setFilteredSessionsData(() => {
      return todaySessionsData.filter((session) => {
        return (
          session.name
            .toLowerCase()
            .includes(props.searchQuery?.toLowerCase()!) ||
          session.description
            ?.toLowerCase()
            .includes(props.searchQuery?.toLowerCase()!)
        );
      });
    });
  };

  const renderItem: ListRenderItem<SessionItemDataType> = useCallback(
    ({ item, index }) => {
      return <TodaySessionListItem item={item} key={index} />;
    },
    [],
  );

  const renderListEmptyComponent = useCallback(() => {
    return (
      <View style={[styles.emptyContainer]}>
        <CustomText
          style={{
            textAlign: "center",
          }}
          color={COLORS.text.secondary}
        >
          {Boolean(props.searchQuery)
            ? "No session meets search query"
            : "No sessions available for today."}
        </CustomText>
      </View>
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleFetchSessions().then((data) => {
        setTodaySessionsData(data!);
        setFilteredSessionsData(data!);
      });
    }, []),
  );

  useEffect(() => {
    handleSearchSession();
  }, [props.searchQuery]);

  if (sessionsDbMigrations.error) {
    return (
      <View style={[styles.emptyContainer]}>
        <CustomText
          style={{
            textAlign: "center",
          }}
          color={COLORS.text.secondary}
        >
          Migration error: {sessionsDbMigrations.error?.message}
        </CustomText>
      </View>
    );
  }
  if (!sessionsDbMigrations.success) {
    return (
      <View>
        <CustomText
          style={{
            textAlign: "center",
          }}
          color={COLORS.text.secondary}
        >
          Migration is in progress...
        </CustomText>
      </View>
    );
  }

  /*
  if (
    sessionDbLiveQuery.data === null ||
    sessionDbLiveQuery.data.length === 0
  ) {
    return <>{renderListEmptyComponent()}</>;
  }
*/

  return (
    <FlatList
      {...props}
      style={[styles.container, props.containerStyle]}
      data={filteredSessionsData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={[
        styles.contentContainer,
        props.contentContainerStyle,
        { paddingBottom: 220 + TAB_BAR_HEIGHT },
      ]}
      ListEmptyComponent={renderListEmptyComponent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    //
  },
  contentContainer: {
    rowGap: 12,
    paddingBottom: 220,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
});
