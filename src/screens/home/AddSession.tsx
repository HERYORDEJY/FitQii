import React, { Fragment, useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomScreenContainer from "~/components/general/CustomScreenContainer";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";
import AddSessionStep1 from "~/components/session/AddSessionStep1";
import { screenDimensions } from "~/utils/size-helpers";
import AddSessionStep2 from "~/components/session/AddSessionStep2";
import AddSessionStep3 from "~/components/session/AddSessionStep3";
import PlusIcon from "~/components/svgs/PlusIcon";
import AddSessionStep4 from "~/components/session/AddSessionStep4";
import { urlRegex } from "~/utils/regex-helpers";
import { router } from "expo-router";

interface Props {
  //
}

const FormSteps = [
  {
    step: 1,
    component: (props: any) => <AddSessionStep1 step={1} {...props} />,
  },
  {
    step: 2,
    component: (props: any) => <AddSessionStep2 step={2} {...props} />,
  },
  {
    step: 3,
    component: (props: any) => <AddSessionStep3 step={3} {...props} />,
  },
  {
    step: 4,
    component: (props: any) => <AddSessionStep4 step={4} {...props} />,
  },
];

export default function AddSession(props: Props): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [formData, setFormData] = useState<Record<string, any>>({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  });

  const canGoNext = useMemo(() => {
    if (currentStep === 1) {
      return Boolean(formData.step1.name) && Boolean(formData.step1.category);
    }
    if (currentStep === 2) {
      return (
        Boolean(formData.step2.start_date) &&
        Boolean(formData.step2.start_time) &&
        Boolean(formData.step2.end_date) &&
        Boolean(formData.step2.end_time) &&
        Boolean(formData.step2.timezone) &&
        Boolean(formData.step2.reminder) &&
        Boolean(formData.step2.repetition)
      );
    }
    if (currentStep === 3) {
      return (
        Boolean(formData.step3.mode) &&
        ((Boolean(formData.step3.link) &&
          `${formData.step3.link}`.match(urlRegex)) ||
          Boolean(formData.step3.location))
      );
    }

    if (currentStep === 4) {
      return true;
    }

    return false;
  }, [currentStep, formData]);

  const handleSetFormData = (step: number, data: any) => {
    setFormData((prevState) => {
      const _step = `step${step}`;
      const stepData = prevState[_step];
      return {
        ...prevState,
        [_step]: { ...stepData, ...data },
      };
    });
  };

  const handleNext = () => {
    if (currentStep < FormSteps.length) {
      scrollViewRef.current?.scrollTo({
        x: screenDimensions.width * currentStep,
        animated: true,
      });
      setCurrentStep(currentStep + 1);
    } else {
      // Save logic
      console.log("Submit form");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      scrollViewRef.current?.scrollTo({
        x: screenDimensions.width * (currentStep - 2),
        animated: true,
      });
      setCurrentStep(currentStep - 1);
      return;
    }
    router.back();
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const onMomentumScrollEnd = (event: any) => {
    const stepIndex = Math.round(
      event.nativeEvent.contentOffset.x / screenDimensions.width,
    );
    setCurrentStep(stepIndex + 1); // +1 to shift from 0-based to 1-based
    // setCurrentStep(stepIndex);
  };

  /*
  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: screenDimensions.width * currentStep,
      animated: true,
    });
  }, []);
*/

  return (
    <CustomScreenContainer bottomSafeArea={true}>
      <View style={[styles.header]}>
        <View style={[styles.progresBar]}>
          <View
            style={[
              styles.progresBarActive,
              { width: `${(currentStep / FormSteps.length) * 100}%` },
            ]}
          />
        </View>

        <View style={[styles.headerTitleBar]}>
          <PlusIcon />
          <CustomText fontSize={22} fontFamily={"medium"}>
            Add Session {currentStep === 4 ? "(Preview)" : ""}
          </CustomText>
        </View>
      </View>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal={true}
        style={[{ flexGrow: 1 }]}
        // snapToOffsets={screenDimensions.width}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {FormSteps.map((form, index) => {
          const _step = `step${form.step}`,
            stepData = formData[_step];
          return (
            <Fragment key={`${index}`}>
              {form.component({
                onEnterData: handleSetFormData,
                formData:
                  form.step === 4
                    ? { ...formData }
                    : { ...stepData, name: formData?.["step1"]?.name },
              })}
            </Fragment>
          );
        })}
      </Animated.ScrollView>

      <View style={[styles.footer]}>
        <TouchableOpacity style={[styles.cancelButton]} onPress={handlePrev}>
          <CustomText color={COLORS.primary} fontFamily={"bold"} fontSize={16}>
            {currentStep === 1 ? "Cancel" : "Prev"}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !canGoNext && { opacity: 0.2 }]}
          onPress={handleNext}
          disabled={!canGoNext}
        >
          <CustomText
            color={COLORS.background.screen}
            fontFamily={"bold"}
            fontSize={16}
          >
            {currentStep === FormSteps.length ? "Save" : "Next"}
          </CustomText>
        </TouchableOpacity>
      </View>
    </CustomScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    //
  },
  contentContainer: {
    paddingVertical: 20,
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
});

const _data = {
  formData: {
    step1: { name: "H", category: "gym" },
    step2: {
      start_time: "2025-06-12T10:01:30.000Z",
      end_time: "2025-06-12T10:02:30.000Z",
      start_date: "2025-07-12T10:02:03.000Z",
      end_date: "2025-07-12T10:02:03.000Z",
      timezone: "-07:00",
      reminder: 600,
      repetition: 2592000,
    },
    step3: {
      mode: "offline",
      location: "Ilorin Nigeria",
      description: "No decription",
      attachments: [
        {
          size: 2543770,
          mimeType: "application/pdf",
          name: "Google claims new Gemini AI 'thinks more carefully' - BBC News.pdf",
          uri: "file:///Users/heryordejy/Library/Developer/CoreSimulator/Devices/D6FE8D2D-97C7-4601-B60A-5ED501805700/data/Containers/Data/Application/FBD3FA7D-A9B9-43D0-829D-16EA6F870253/Library/Caches/ExponentExperienceData/@anonymous/FitQii-7e4ed325-d993-42df-aafd-9502b9dd71f7/DocumentPicker/2CD670D2-46F3-412B-8EB0-FA1AABAC25C8.pdf",
        },
      ],
    },
    step4: {},
  },
  currentStep: 4,
};

const yy = {
  name: "H",
  category: "gym",
  start_time: "2025-06-12T10:01:30.000Z",
  end_time: "2025-06-12T10:02:30.000Z",
  start_date: "2025-07-12T10:02:03.000Z",
  end_date: "2025-07-12T10:02:03.000Z",
  timezone: "-07:00",
  reminder: 600,
  repetition: 2592000,

  mode: "offline",
  location: "Ilorin Nigeria",
  link: null,
  description: "No decription",
  attachments: [
    {
      size: 2543770,
      mimeType: "application/pdf",
      name: "Google claims new Gemini AI 'thinks more carefully' - BBC News.pdf",
      uri: "file:///Users/heryordejy/Library/Developer/CoreSimulator/Devices/D6FE8D2D-97C7-4601-B60A-5ED501805700/data/Containers/Data/Application/FBD3FA7D-A9B9-43D0-829D-16EA6F870253/Library/Caches/ExponentExperienceData/@anonymous/FitQii-7e4ed325-d993-42df-aafd-9502b9dd71f7/DocumentPicker/2CD670D2-46F3-412B-8EB0-FA1AABAC25C8.pdf",
    },
  ],
};
