import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SearchInput from "~/components/inputs/SearchInput";
import CustomScreenContainer from "~/components/general/CustomScreenContainer";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import HistoryList from "~/components/session/HistoryList";

export default function History(): React.JSX.Element {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSession = () => {
    // TODO:: implement search for session
  };

  return (
    <CustomScreenContainer>
      {/*  Header */}
      <View
        style={[styles.header]}
        onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      >
        <View style={[styles.navbar]}>
          <View style={[styles.navbarLeft]}>
            <CustomText fontFamily={"medium"} fontSize={22}>
              Session History
            </CustomText>
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
        <HistoryList
          contentContainerStyle={{ paddingHorizontal: 20 }}
          searchQuery={searchQuery}
          headerHeight={headerHeight}
        />
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
