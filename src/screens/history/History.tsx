import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SearchInput from "~/components/inputs/SearchInput";
import CustomScreenContainer from "~/components/general/CustomScreenContainer";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import { getWeekDates } from "~/utils/date-helpers";
import NotificationBellIcon from "~/components/svgs/NotificationBellIcon";
import HistoryList from "~/components/session/HistoryList";

export default function History(): React.JSX.Element {
  const weekDates = getWeekDates();

  const handleSearchSession = () => {
    // TODO:: implement search for session
  };

  const handleNotificationPress = () => {
    // TODO:: implement notification action
  };

  return (
    <CustomScreenContainer>
      {/*  Header */}
      <View style={[styles.header]}>
        <View style={[styles.navbar]}>
          <View style={[styles.navbarLeft]}>
            <CustomText fontFamily={"medium"} fontSize={22}>
              Session History
            </CustomText>
          </View>

          <View style={[styles.navbarRight]}>
            <TouchableOpacity
              style={[styles.notificationButton]}
              onPress={handleNotificationPress}
            >
              <NotificationBellIcon />
              <View style={[styles.notificationIndicator]} />
            </TouchableOpacity>
          </View>
        </View>
        <SearchInput
          placeholder={" Search by Session..."}
          containerStyle={{ marginHorizontal: 20 }}
          onChangeText={handleSearchSession}
        />

        <View style={[styles.headerLine]} />
      </View>
      <View style={styles.container}>
        <HistoryList contentContainerStyle={{ paddingHorizontal: 20 }} />
      </View>
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
  navbarLeft: { flexDirection: "row", alignItems: "center", columnGap: 10 },
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
  plusIcon: {
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
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  dateRowItem: {
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: 15,
    width: 25,
  },
  dateRowItemDateWrapper: {
    width: 25,
    height: 25,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
  },
});
