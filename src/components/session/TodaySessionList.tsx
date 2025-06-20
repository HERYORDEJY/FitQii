import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  RefreshControl,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import TodaySessionListItem from "~/components/session/TodaySessionListItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SessionItemDataType } from "~/components/session/types";
import { sessionsDb } from "~/db";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "~/db/drizzle/migrations";
import { useTodaySessions } from "~/services/db/actions";
import CustomActivityIndicator from "~/components/general/CustomActivityIndicator";
import { errorLogOnDev } from "~/utils/log-helpers";

interface Props extends Partial<FlatListProps<SessionItemDataType>> {
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onSearchSession?: (searchText: string) => void;
  searchQuery?: string;
}

export default function TodaySessionList(props: Props): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 69 + safeAreaInsets.bottom / 2;
  const sessionsDbMigrations = useMigrations(sessionsDb, migrations);
  const [filteredSessionsData, setFilteredSessionsData] = useState<
    Array<SessionItemDataType>
  >([]);

  const todaySessionsQuery = useTodaySessions();

  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);

  const handleSearchSession = () => {
    if (!Boolean(props.searchQuery)) {
      setFilteredSessionsData(todaySessionsQuery.data);
      return;
    }

    setFilteredSessionsData(() => {
      return todaySessionsQuery.data.filter((session) => {
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

  const handleRefreshList = async () => {
    try {
      await todaySessionsQuery.refetch();
    } catch (error) {
      errorLogOnDev("Error refreshing sessions list:", error);
    }
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

  useEffect(() => {
    if (Boolean(todaySessionsQuery.data?.length)) {
      setFilteredSessionsData(todaySessionsQuery?.data!);
    }
  }, [todaySessionsQuery?.data]);

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
          Migration error: {sessionsDbMigrations.error.message}
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

  if (
    !Boolean(todaySessionsQuery?.data?.length) &&
    todaySessionsQuery?.isLoading
  ) {
    return (
      <>
        <CustomActivityIndicator />
      </>
    );
  }

  return (
    <>
      <FlatList
        {...props}
        style={[styles.container, props.containerStyle]}
        data={filteredSessionsData}
        horizontal={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.contentContainer,
          props.contentContainerStyle,
          { paddingBottom: 220 + TAB_BAR_HEIGHT },
        ]}
        ListEmptyComponent={renderListEmptyComponent}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefreshList}
            refreshing={todaySessionsQuery.isRefetching}
          />
        }
      />
    </>
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
