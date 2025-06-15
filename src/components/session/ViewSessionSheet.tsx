import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";
import { urlRegex } from "~/utils/regex-helpers";
import * as Linking from "expo-linking";
import CalendarIcon from "~/components/svgs/CalendarIcon";
import { format } from "date-fns";
import ArrowRightIcon from "~/components/svgs/ArrowRightIcon";
import ClockIcon from "~/components/svgs/ClockIcon";
import LinkIcon from "~/components/svgs/LinkIcon";
import LocationIcon from "~/components/svgs/LocationIcon";
import GlobeIcon from "~/components/svgs/GlobeIcon";
import { Timezones } from "~/data/timezones";
import AlarmClockIcon from "~/components/svgs/AlarmClockIcon";
import { ReminderOptions, RepetitionOptions } from "~/data/add-session-options";
import RepeatIcon from "~/components/svgs/RepeatIcon";
import AttachmentIcon from "~/components/svgs/AttachmentIcon";
import * as DocumentPicker from "expo-document-picker";
import { SessionItemDataType } from "~/components/session/types";
import { useToastNotification } from "~/hooks/useToastNotification";
import CustomBottomSheet, {
  CustomBottomSheetContainerProps,
} from "~/components/general/CustomActionSheet";
import CustomActivityIndicator from "~/components/general/CustomActivityIndicator";
import { isValidDate } from "~/utils/date-helpers";
import { router } from "expo-router";
import { useDeleteSession, useUpdateSession } from "~/services/db/actions";

interface Props extends CustomBottomSheetContainerProps {
  sessionData?: SessionItemDataType;
}

export default function ViewSessionSheet({
  sessionData,
  ...props
}: Props): React.JSX.Element {
  const isSessionUpcoming = sessionData?.status === "upcoming";
  const isSessionPending = sessionData?.status === "pending";
  const toastNotification = useToastNotification();
  const isLocationLink =
    `${sessionData?.location}`.match(urlRegex) ||
    `${sessionData?.location}`?.startsWith("https://") ||
    `${sessionData?.location}`?.startsWith("http://");

  const deleteSession = useDeleteSession(),
    updateSession = useUpdateSession();

  const handleOpenLink = async () => {
    try {
      await Linking.openURL(sessionData?.link!);
    } catch (error: any) {
      //
    }
  };

  const handleOpenLocation = async () => {
    if (!isLocationLink) {
      return;
    }
    try {
      await Linking.openURL(sessionData?.location!);
    } catch (error: any) {
      //
    }
  };

  const handleSessionStatus = async (status: SessionItemDataType["status"]) => {
    try {
      await updateSession.mutateAsync({
        id: sessionData?.id!,
        data: { status },
      });
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = async () => {
    try {
      await handleSessionStatus("cancelled");
      props.sheetRef.current?.hide();
      toastNotification.success("Session cancelled successfully.");
      // onActionCompleted?.();
    } catch (error: any) {
      toastNotification.error("Unable to cancel session.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSession.mutateAsync(sessionData?.id!);
      toastNotification.success("Session deleted successfully.");
      props.sheetRef.current?.hide();
    } catch (error) {
      toastNotification.error("Unable to delete session.");

      throw error;
    }
  };

  const handleEdit = () => {
    props.sheetRef.current?.hide();
    router.push({
      pathname: "/add-session",
      params: {
        editMode: JSON.stringify(true),
        sessionData: JSON.stringify({
          id: sessionData?.id,
          step1: {
            name: sessionData?.name,
            category: sessionData?.category,
          },
          step2: {
            start_time: sessionData?.start_time,
            end_time: sessionData?.end_time,
            start_date: sessionData?.start_date,
            end_date: sessionData?.end_date,
            timezone: sessionData?.timezone,
            reminder: sessionData?.reminder,
            repetition: sessionData?.repetition,
          },
          step3: {
            mode: sessionData?.mode,
            link: sessionData?.link,
            location: sessionData?.location,
            description: sessionData?.description,
            attachments: sessionData?.attachments,
          },
          step4: {},
        }),
      },
    });
  };

  return (
    <>
      <CustomBottomSheet.Container
        sheetRef={props.sheetRef}
        title={"View Session"}
      >
        <View style={styles.container}>
          <ScrollView
            horizontal={false}
            contentContainerStyle={[styles.contentContainer]}
            showsHorizontalScrollIndicator={false}
          >
            <View style={[styles.itemsWrapper]}>
              <View style={[styles.sessionTitleWrapper]}>
                <CustomText fontSize={22} fontFamily={"medium"}>
                  {sessionData?.name}
                </CustomText>
              </View>

              <CustomText
                fontSize={12}
                color={COLORS.secondary}
                fontFamily={"medium"}
                style={{ textTransform: "capitalize" }}
              >
                🧭 {sessionData?.status}
              </CustomText>

              {isValidDate(sessionData?.start_date) &&
              isValidDate(sessionData?.end_date) ? (
                <View style={[styles.stepItemRow]}>
                  <CalendarIcon width={20} height={20} />
                  <CustomText fontSize={16}>
                    {format(sessionData?.start_date!, "MMMM d, yyy")}
                  </CustomText>
                  <ArrowRightIcon color={"#FFF"} width={18} height={30} />
                  <CustomText fontSize={16}>
                    {format(sessionData?.end_date!, "MMMM d, yyy")}
                  </CustomText>
                </View>
              ) : null}

              {isValidDate(sessionData?.start_time) &&
              isValidDate(sessionData?.end_time) ? (
                <View style={[styles.stepItemRow]}>
                  <ClockIcon width={20} height={20} />
                  <CustomText fontSize={16}>
                    {format(sessionData?.start_time!, "h:mm a")}
                  </CustomText>
                  <ArrowRightIcon color={"#FFF"} width={18} height={30} />
                  <CustomText fontSize={16}>
                    {format(sessionData?.end_time!, "h:mm a")}
                  </CustomText>
                </View>
              ) : null}

              {Boolean(sessionData?.link) ? (
                <View style={[styles.stepItemRow]}>
                  <LinkIcon width={20} height={20} />
                  <CustomText
                    fontSize={16}
                    color={"#0961F5"}
                    onPress={handleOpenLink}
                  >
                    {sessionData?.link}
                  </CustomText>
                </View>
              ) : null}

              {Boolean(sessionData?.location) ? (
                <View style={[styles.stepItemRow]}>
                  <LocationIcon width={20} height={20} />
                  <CustomText
                    fontSize={16}
                    color={isLocationLink ? "#0961F5" : COLORS.text.primary}
                    disabled={!isLocationLink}
                    onPress={handleOpenLocation}
                    numberOfLines={2}
                  >
                    {sessionData?.location}
                  </CustomText>
                </View>
              ) : null}

              <View style={[styles.stepItemRow]}>
                <GlobeIcon width={20} height={20} />
                <CustomText fontSize={16}>
                  {
                    Timezones.find(
                      (timezone) => timezone.value === sessionData?.timezone,
                    )?.label
                  }
                </CustomText>
              </View>

              <View style={[styles.stepItemRow]}>
                <AlarmClockIcon width={20} height={20} />
                <CustomText fontSize={16}>
                  {
                    ReminderOptions.find(
                      (reminder) => reminder.value === sessionData?.reminder,
                    )?.label
                  }
                </CustomText>
              </View>

              <View style={[styles.stepItemRow]}>
                <RepeatIcon width={20} height={20} />
                <CustomText fontSize={16}>
                  {
                    RepetitionOptions.find(
                      (repetition) =>
                        repetition.value === sessionData?.repetition,
                    )?.label
                  }
                </CustomText>
              </View>

              <View style={[styles.stepItemRow]}>
                <CustomText fontSize={16}>
                  {sessionData?.description}
                </CustomText>
              </View>

              {Boolean(sessionData?.attachments?.length) ? (
                <View style={[styles.fieldGroup, { rowGap: 5 }]}>
                  <TouchableOpacity style={[styles.stepItemRow]}>
                    <AttachmentIcon />
                    <CustomText>Attachments</CustomText>
                  </TouchableOpacity>

                  <View style={[styles.attachments]}>
                    {sessionData?.attachments?.map(
                      (
                        attachment: DocumentPicker.DocumentPickerAsset,
                        index: number,
                      ) => {
                        return (
                          <View
                            style={[styles.attachmentsItem]}
                            key={`${index}`}
                          >
                            <CustomText
                              numberOfLines={1}
                              ellipsizeMode={"middle"}
                              style={{ flex: 1 }}
                              color={"#FFFFFF40"}
                            >
                              {attachment.name}
                            </CustomText>
                          </View>
                        );
                      },
                    )}
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>

          {isSessionUpcoming || isSessionPending ? (
            <View style={[styles.footer]}>
              <TouchableOpacity
                style={[styles.cancelButton]}
                onPress={handleDelete}
              >
                <CustomText color={"#FF0000"} fontFamily={"bold"} fontSize={16}>
                  Delete
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.nextButton]}
                onPress={handleEdit}
              >
                <CustomText
                  color={COLORS.background.screen}
                  fontFamily={"bold"}
                  fontSize={16}
                >
                  Edit
                </CustomText>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {deleteSession.status === "loading" ||
        updateSession.status === "loading" ? (
          <CustomActivityIndicator
            position={"overlay"}
            overlayBackgroundType={"blurred"}
          />
        ) : null}
      </CustomBottomSheet.Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  contentContainer: {
    rowGap: 40,
  },
  header: {
    rowGap: 16,
    paddingHorizontal: 20,
  },
  headerTitleBar: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  progresBar: {
    height: 4,
    borderRadius: 100,
    backgroundColor: "#222222",
    overflow: "hidden",
    width: "100%",
    position: "relative",
  },
  progresBarActive: {
    height: "100%",
    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  cancelButton: {
    borderColor: "#222222",
    borderWidth: 2,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
  },
  itemsWrapper: {
    rowGap: 12,
    paddingTop: 12,
  },
  fieldGroup: {
    rowGap: 12,
  },
  stepItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 12,
    minHeight: 40,
  },
  sessionTitleWrapper: {
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary + 20,
    backgroundColor: COLORS.primary + 10,
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sessionTitleText: {
    //
  },
  attachments: {
    rowGap: 5,
  },
  attachmentsItem: {
    alignItems: "center",
    paddingLeft: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.outline.card,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    // columnGap: 10,
  },
});
