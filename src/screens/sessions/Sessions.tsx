import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SearchInput from "~/components/inputs/SearchInput";
import CustomScreenContainer from "~/components/general/CustomScreenContainer";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import { getWeekDates } from "~/utils/date-helpers";
import { format, isToday } from "date-fns";
import PlusIcon from "~/components/svgs/PlusIcon";
import SessionsList from "~/components/session/SessionsList";

export default function Sessions(): React.JSX.Element {
  const weekDates = getWeekDates();

  const handleSelectDateRowItem = () => {
    // TODO:: implement select date row item action
  };

  const handleAddSession = () => {
    // TODO:: implement add session action
  };

  const handleSearchSession = () => {
    // TODO:: implement search for session
  };

  return (
    <CustomScreenContainer>
      {/*  Header */}
      <View style={[styles.header]}>
        <View style={[styles.navbar]}>
          <View style={[styles.navbarLeft]}>
            <CustomText fontFamily={"medium"} fontSize={16}>
              8 July, 2024
            </CustomText>
            <CustomText>Today</CustomText>
          </View>
        </View>
        <SearchInput
          placeholder={" Search by Session..."}
          containerStyle={{ marginHorizontal: 20 }}
          onChangeText={handleSearchSession}
        />

        <View style={[styles.dateRow]}>
          {weekDates.map((date) => {
            return (
              <TouchableOpacity
                key={new Date(date).toLocaleDateString()}
                onPress={handleSelectDateRowItem}
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
        <SessionsList contentContainerStyle={{ paddingHorizontal: 20 }} />
      </View>

      <TouchableOpacity style={[styles.plusIcon]} onPress={handleAddSession}>
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
