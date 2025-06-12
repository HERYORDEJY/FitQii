import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomScreenContainer from "~/components/general/CustomScreenContainer";
import FitQiiLogoIcon1 from "~/components/svgs/FitQiiLogoIcon1";
import FitQiiLogoName1 from "~/components/svgs/FitQiiLogoName1";
import SearchInput from "~/components/inputs/SearchInput";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import TodaySessionList from "~/components/session/TodaySessionList";
import PlusIcon from "~/components/svgs/PlusIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sessionsDb } from "~/db";
import migrations from "~/db/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { sessionsSchema } from "~/db/schema";
import { addDays, addMinutes } from "date-fns";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export default function Home(): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 69 + safeAreaInsets.bottom / 2;

  const { success, error } = useMigrations(sessionsDb, migrations);
  const sessionDbLiveQuery = useLiveQuery(
    sessionsDb.select().from(sessionsSchema),
  );

  console.log(
    "\n\n { success, error } :>> \t\t",
    { data: sessionDbLiveQuery.data },
    "\n\n---",
  );

  const handleAddSession = async () => {
    try {
      // router.push("/add-session");
      await sessionsDb.insert(sessionsSchema).values([
        {
          name: "Another Village meeting",
          category: "meeting",
          start_date: new Date().toString(),
          end_date: addDays(new Date(), 1).toString(),
          start_time: addMinutes(new Date(), 20).toString(),
          end_time: addMinutes(addDays(new Date(), 1), 50).toString(),
          mode: "online",
          link: "www.google.com",
          description: "No descriptions for now",
          timezone: "-07:00",
          reminder: 600,
          repetition: 2592000,
        },
      ]);
    } catch (error: any) {
      console.error("\n\nsessionsDb.insert error :>> \t\t", error, "\n\n---");
    }
  };

  return (
    <CustomScreenContainer>
      {/*  Header */}
      <View style={[styles.header]}>
        <View style={[styles.navbar]}>
          <View style={[styles.navbarLeft]}>
            <FitQiiLogoIcon1 />
            <FitQiiLogoName1 />
          </View>
        </View>
        <SearchInput
          placeholder={" Search by Session..."}
          containerStyle={{ marginHorizontal: 20 }}
        />
        <View style={[styles.headerLine]} />
      </View>
      <View style={styles.container}>
        <TodaySessionList
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ListHeaderComponent={
            <CustomText fontFamily={"bold"} fontSize={22}>
              Your today’s Session
            </CustomText>
          }
        />
      </View>

      <TouchableOpacity
        style={[styles.addButton, { bottom: TAB_BAR_HEIGHT + 20 }]}
        onPress={handleAddSession}
      >
        <PlusIcon />
      </TouchableOpacity>
    </CustomScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 20,
    paddingVertical: 20,
  },
  header: {
    rowGap: 16,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 50,
  },
  navbarLeft: { flexDirection: "row", alignItems: "center", columnGap: 20 },
  navbarRight: {},
  notificationButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  notificationIndicator: {
    borderRadius: 6,
    width: 6,
    height: 6,
    position: "absolute",
    backgroundColor: COLORS.secondary,
    top: 15,
    right: 0,
  },
  headerLine: {
    height: 2,
    backgroundColor: COLORS.background.card,
  },
  addButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    shadowColor: "#CCCCCC",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 4,
  },
});
