import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { screenDimensions } from "~/utils/size-helpers";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import { SelectOptionType } from "~/components/inputs/types";
import CustomTextInput from "~/components/inputs/CustomTextInput";
import LinkIcon from "~/components/svgs/LinkIcon";
import LocationIcon from "~/components/svgs/LocationIcon";
import AttachmentIcon from "~/components/svgs/AttachmentIcon";
import CloseIcon from "~/components/svgs/CloseIcon";
import * as DocumentPicker from "expo-document-picker";

interface Props {
  step: number;
  onEnterData: (step: number, data: any) => void;
  formData: Record<string, any>;
}

export default function AddSessionStep3(props: Props): React.JSX.Element {
  const handleEnterData = (key: string, value: any) => {
    props.onEnterData?.(props.step, { [key]: value });
  };

  const handlePickAttachment = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/png", "image/jpeg", "image/jpg"],
      });

      if (document.canceled) {
        return;
      }

      props.onEnterData?.(props.step, {
        attachments: [
          ...(props.formData?.attachments ?? []),
          ...document.assets,
        ],
      });
    } catch (error: any) {
      //
    }
  };

  // TODO:: implement the correct attachment type
  const handleDeleteAttachment = (
    index: number,
    attachment: DocumentPicker.DocumentPickerAsset,
  ) => {
    let attachments = props.formData?.attachments;
    attachments = attachments?.filter(
      (_attachment: DocumentPicker.DocumentPickerAsset) =>
        _attachment.uri !== attachment.uri,
    );
    props.onEnterData?.(props.step, { attachments });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.contentContainer]}>
        <View style={[styles.sessionTitleWrapper]}>
          <CustomText fontSize={22} fontFamily={"medium"}>
            {props.formData?.name ?? "Session"}
          </CustomText>
        </View>

        <View style={[styles.fieldGroup]}>
          <CustomText>Mode</CustomText>
          <View
            style={[
              styles.dateFieldsRow,
              {
                borderWidth: 1,
                borderColor: COLORS.outline.card,
                borderRadius: 10,
                columnGap: 0,
              },
            ]}
          >
            {SessionTypeOptions.map((option: any) => {
              const isSelected = props.formData?.mode === option.value;
              return (
                <Pressable
                  key={`${option.value}`}
                  style={[
                    styles.modeValuesWrapper,
                    option.value === "online" && {
                      borderRightWidth: 0.5,
                    },
                    option.value === "offline" && {
                      borderLeftWidth: 0.5,
                    },
                    isSelected && {
                      backgroundColor: COLORS.outline.card,
                    },
                  ]}
                  onPress={() => handleEnterData("mode", option.value)}
                >
                  <View
                    style={[
                      styles.itemRadioCheck,
                      isSelected && { borderColor: COLORS.secondary },
                    ]}
                  >
                    <View
                      style={[
                        styles.itemRadioCheckActive,
                        isSelected && { backgroundColor: COLORS.secondary },
                      ]}
                    />
                  </View>
                  <CustomText>{option.label}</CustomText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {props.formData.mode === "online" ? (
          <CustomTextInput
            placeholder={"Add session link here"}
            cursorColor={COLORS.primary}
            autoFocus={true}
            onChangeText={(text) => handleEnterData("link", text)}
            renderRightElement={<LinkIcon />}
            value={props.formData?.link}
          />
        ) : null}

        <View style={[styles.fieldGroup]}>
          <CustomText>Location</CustomText>
          <CustomTextInput
            placeholder={"Enter location here"}
            onChangeText={(text) => handleEnterData("location", text)}
            renderRightElement={<LocationIcon />}
            value={props.formData?.location}
          />
        </View>

        <View style={[styles.fieldGroup]}>
          <CustomText>Description (optional)</CustomText>
          <CustomTextInput
            placeholder={"You can add note or description about session"}
            onChangeText={(text) => handleEnterData("location", text)}
            contentContainerStyle={{ height: 100 }}
            multiline={true}
            textInputStyle={{
              textAlignVertical: "top",
              height: "100%",
              paddingVertical: 10,
            }}
            value={props.formData?.description}
          />
        </View>

        <View style={[styles.fieldGroup, { rowGap: 0 }]}>
          <TouchableOpacity
            onPress={handlePickAttachment}
            style={[styles.fieldGroup, styles.attachmentsButton]}
          >
            <CustomText>Attachment (optional)</CustomText>
            <AttachmentIcon />
          </TouchableOpacity>

          <View style={[styles.attachments]}>
            {props.formData?.attachments?.map(
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
                    <Pressable
                      onPress={() => handleDeleteAttachment(index, attachment)}
                      style={[styles.attachmentsItemCloseButton]}
                    >
                      <CloseIcon color={COLORS.primary} />
                    </Pressable>
                  </View>
                );
              },
            )}
          </View>
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
  fieldGroup: {
    rowGap: 12,
  },
  dateFieldsRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    overflow: "hidden",
  },
  sessionTitleWrapper: {
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
    backgroundColor: COLORS.primary + 30,
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sessionTitleText: {
    //
  },
  itemRadioCheck: {
    height: 16,
    width: 16,
    borderRadius: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF60",
    padding: 2.5,
  },
  itemRadioCheckActive: {
    height: "100%",
    width: "100%",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  modeValuesWrapper: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 30,
    borderColor: COLORS.outline.card,
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
  attachmentsItemCloseButton: {
    paddingHorizontal: 10,
    paddingLeft: 20,
    height: "100%",
  },
  attachmentsButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignItems: "flex-start",
  },
});

const SessionTypeOptions: Array<SelectOptionType> = [
  {
    label: "Online",
    value: "online",
  },
  {
    label: "Offline",
    value: "offline",
  },
];
