import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "~/components/general/CustomText";
import { screenDimensions } from "~/utils/size-helpers";
import { COLORS } from "~/constants/Colors";
import CalendarIcon from "~/components/svgs/CalendarIcon";
import { format } from "date-fns";
import ArrowRightIcon from "~/components/svgs/ArrowRightIcon";
import ClockIcon from "~/components/svgs/ClockIcon";
import LinkIcon from "~/components/svgs/LinkIcon";
import * as Linking from "expo-linking";
import { urlRegex } from "~/utils/regex-helpers";
import LocationIcon from "~/components/svgs/LocationIcon";
import { Timezones } from "~/data/timezones";
import GlobeIcon from "~/components/svgs/GlobeIcon";
import AlarmClockIcon from "~/components/svgs/AlarmClockIcon";
import { ReminderOptions, RepetitionOptions } from "~/data/add-session-options";
import RepeatIcon from "~/components/svgs/RepeatIcon";
import AttachmentIcon from "~/components/svgs/AttachmentIcon";
import * as DocumentPicker from "expo-document-picker";

interface Props {
  step: number;
  onEnterData?: (step: number, data: any) => void;
  formData: Record<string, any>;
}

export default function AddSessionStep4({
  formData,
  ...props
}: Props): React.JSX.Element {
  const isLocationLink =
    `${formData?.step3?.location}`.match(urlRegex) ||
    `${formData?.step3?.location}`?.startsWith("https://") ||
    `${formData?.step3?.location}`?.startsWith("http://");

  const handleOpenLink = async () => {
    try {
      await Linking.openURL(formData.step3.link);
    } catch (error: any) {
      //
    }
  };

  const handleOpenLocation = async () => {
    if (!isLocationLink) {
      return;
    }
    try {
      await Linking.openURL(formData.step3.location);
    } catch (error: any) {
      //
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.contentContainer]}>
        <View style={[styles.itemsWrapper, { flex: 1 }]}>
          <View style={[styles.sessionTitleWrapper]}>
            <CustomText fontSize={22} fontFamily={"medium"}>
              {formData?.step1.name}
            </CustomText>
          </View>

          {Boolean(formData.step2.start_date) &&
          Boolean(formData.step2.end_date) ? (
            <View style={[styles.stepItemRow]}>
              <CalendarIcon width={20} height={20} />
              <CustomText fontSize={16}>
                {format(formData.step2.start_date, "MMMM d, yyy")}
              </CustomText>
              <ArrowRightIcon color={"#FFF"} width={18} height={30} />
              <CustomText fontSize={16}>
                {format(formData.step2.end_date, "MMMM d, yyy")}
              </CustomText>
            </View>
          ) : null}

          {Boolean(formData.step2.start_time) &&
          Boolean(formData.step2.end_time) ? (
            <View style={[styles.stepItemRow]}>
              <ClockIcon width={20} height={20} />
              <CustomText fontSize={16}>
                {format(formData.step2.start_time, "h:mm a")}
              </CustomText>
              <ArrowRightIcon color={"#FFF"} width={18} height={30} />
              <CustomText fontSize={16}>
                {format(formData.step2.end_time, "h:mm a")}
              </CustomText>
            </View>
          ) : null}

          {Boolean(formData.step3.link) ? (
            <View style={[styles.stepItemRow]}>
              <View style={{}}>
                <LinkIcon width={20} height={20} />
              </View>
              <CustomText
                fontSize={16}
                color={"#0961F5"}
                onPress={handleOpenLink}
                numberOfLines={2}
                ellipsizeMode={"middle"}
                // style={{ flex: 1 }}
              >
                {formData.step3.link}
              </CustomText>
            </View>
          ) : null}

          {Boolean(formData.step3.location) ? (
            <View
              style={[
                styles.stepItemRow,
                { minHeight: 40, maxHeight: undefined },
              ]}
            >
              <LocationIcon width={20} height={20} />
              <CustomText
                numberOfLines={2}
                fontSize={16}
                color={isLocationLink ? "#0961F5" : COLORS.text.primary}
                onPress={handleOpenLocation}
                disabled={!isLocationLink}
                style={{}}
              >
                {formData.step3.location}
              </CustomText>
            </View>
          ) : null}

          <View style={[styles.stepItemRow]}>
            <GlobeIcon width={20} height={20} />
            <CustomText fontSize={16}>
              {
                Timezones.find(
                  (timezone) => timezone.value === formData.step2.timezone,
                )?.label
              }
            </CustomText>
          </View>

          <View style={[styles.stepItemRow]}>
            <AlarmClockIcon width={20} height={20} />
            <CustomText fontSize={16}>
              {
                ReminderOptions.find(
                  (reminder) => reminder.value === formData.step2.reminder,
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
                    repetition.value === formData.step2.repetition,
                )?.label
              }
            </CustomText>
          </View>

          <View style={[styles.stepItemRow]}>
            <CustomText fontSize={16}>{formData.step3.description}</CustomText>
          </View>

          {Boolean(formData?.step3.attachments?.length) ? (
            <View style={[styles.fieldGroup, { rowGap: 5 }]}>
              <TouchableOpacity style={[styles.stepItemRow]}>
                <AttachmentIcon />
                <CustomText>Attachments</CustomText>
              </TouchableOpacity>

              <View style={[styles.attachments]}>
                {formData?.step3.attachments?.map(
                  (
                    attachment: DocumentPicker.DocumentPickerAsset,
                    index: number,
                  ) => {
                    return (
                      <View style={[styles.attachmentsItem]} key={`${index}`}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenDimensions.width,
  },
  contentContainer: {
    width: screenDimensions.width,
    paddingVertical: 20,
    paddingHorizontal: 20,
    rowGap: 40,
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
    overflow: "hidden",
    width: "100%",
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
