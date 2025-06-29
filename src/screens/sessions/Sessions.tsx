import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SearchInput from "~/components/inputs/SearchInput";
import CustomScreenContainer from "~/components/general/CustomScreenContainer";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import { getWeekDates } from "~/utils/date-helpers";
import { format, isToday } from "date-fns";
import PlusIcon from "~/components/svgs/PlusIcon";
import SessionsList from "~/components/session/SessionsList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

let todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

export default function Sessions(): React.JSX.Element {
  const { weekDates, currentWeekDate } = getWeekDates();
  const safeAreaInsets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 69 + safeAreaInsets.bottom / 2;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(currentWeekDate);
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleSelectDateRowItem = (date: Date, index: number) => {
    setSelectedDate({ date, index });
  };

  const handleAddSession = () => {
    router.push("/add-session");
  };

  return (
    <CustomScreenContainer>
      {/*  Header */}
      <View style={[styles.header]}>
        <View style={[styles.navbar]}>
          <View style={[styles.navbarLeft]}>
            <CustomText fontFamily={"medium"} fontSize={22}>
              {format(new Date(), "d MMMM, yyyy")}
            </CustomText>
            <CustomText>Today</CustomText>
          </View>
        </View>
        <SearchInput
          placeholder={" Search by Session..."}
          containerStyle={{ marginHorizontal: 20 }}
          onChangeText={setSearchQuery}
        />

        <View
          style={[styles.dateRow]}
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
        >
          {weekDates.map((date, index) => {
            return (
              <TouchableOpacity
                key={new Date(date).toLocaleDateString()}
                onPress={() => handleSelectDateRowItem(date, index)}
                style={[styles.dateRowItem]}
              >
                <CustomText
                  fontFamily={"medium"}
                  fontSize={16}
                  color={isToday(date) ? COLORS.primary : "#FFF"}
                >
                  {format(date, "E")?.[0]}
                </CustomText>
                <View
                  style={[
                    styles.dateRowItemDateWrapper,
                    isToday(date) && { backgroundColor: COLORS.primary },
                  ]}
                >
                  <CustomText
                    fontFamily={"medium"}
                    fontSize={16}
                    color={isToday(date) ? "#000" : "#FFF"}
                  >
                    {format(date, "d")}
                  </CustomText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.headerLine]} />
      </View>
      <View style={styles.container}>
        <SessionsList
          selectedDate={selectedDate}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          searchQuery={searchQuery}
          headerHeight={headerHeight}
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
    flex: 1,
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
