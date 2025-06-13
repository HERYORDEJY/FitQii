import React, { useState } from "react";
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
import { router } from "expo-router";

export default function Home(): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 69 + safeAreaInsets.bottom / 2;
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddSession = () => {
    router.push("/add-session");
  };

  const handleSearchSession = (searchText: string) => {
    setSearchQuery(searchText);
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
          onChangeText={setSearchQuery}
        />
        <View style={[styles.headerLine]} />
      </View>
      <View style={styles.container}>
        <TodaySessionList
          onSearchSession={handleSearchSession}
          searchQuery={searchQuery}
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
