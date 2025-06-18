import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { errorLogOnDev } from "~/utils/log-helpers";
import { useCreateSession, useUpdateSession } from "~/services/db/actions";
import ArrowRightIcon from "~/components/svgs/ArrowRightIcon";
import CustomButton from "~/components/buttons/CustomButton";
import { toast } from "sonner-native";

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

export default function AddSession(): React.JSX.Element {
  const localSearchParams = useLocalSearchParams(),
    isEditMode = localSearchParams.editMode
      ? Boolean(JSON.parse(localSearchParams?.editMode as string))
      : false,
    sessionData = Boolean(localSearchParams?.sessionData)
      ? JSON.parse(localSearchParams?.sessionData as string)
      : null;
  const [currentStep, setCurrentStep] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [formData, setFormData] = useState<Record<string, any>>({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  });
  const [isLinkValid, setIsLinkValid] = useState(false);

  const createSession = useCreateSession(),
    updateSession = useUpdateSession();

  /*
  const isLinkValid = useMemo(() => {
    return Boolean(formData.step3.link?.match(urlRegex));
  }, [formData.step3.link]);
*/

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
        !isNaN(formData.step2.reminder) &&
        !isNaN(formData.step2.repetition)
      );
    }
    if (currentStep === 3) {
      return (
        Boolean(formData.step3.mode) &&
        (isLinkValid || Boolean(formData.step3.location))
      );
    }

    return currentStep === 4;
  }, [currentStep, formData, isLinkValid]);

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

  const handleSaveSession = async () => {
    try {
      let dataToSave = {
        ...formData.step1,
        ...formData.step2,
        ...formData.step3,
        ...formData.step4,
      };
      if (Boolean(dataToSave.attachments?.length)) {
        dataToSave = {
          ...dataToSave,
          attachments: JSON.stringify(formData.step3.attachments),
        };
      }

      if (isEditMode) {
        await updateSession.mutateAsync({
          id: sessionData?.id ?? 3!,
          data: dataToSave,
        });
      } else {
        await createSession.mutateAsync(dataToSave);
      }
      toast.success("Session saved successfully.");
      router.back();
    } catch (error: any) {
      errorLogOnDev("\n\nsessionsDb.insert error :>> \t\t", error, "\n\n---");
    }
  };

  const handleNext = async () => {
    if (currentStep < FormSteps.length) {
      scrollViewRef.current?.scrollTo({
        x: screenDimensions.width * currentStep,
        animated: true,
      });
      setCurrentStep(currentStep + 1);
    } else {
      await handleSaveSession();
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

  useEffect(() => {
    if (isEditMode && sessionData) {
      setFormData(sessionData);
      setCurrentStep(1); // Set to preview step
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLinkValid(urlRegex.test(formData.step3.link?.trim()));
    }, 300); // debounce 300ms

    return () => clearTimeout(timeout);
  }, [formData.step3.link]);

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
          {isEditMode ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={[{ transform: [{ rotate: "180deg" }] }]}
            >
              <ArrowRightIcon width={24} height={24} />
            </TouchableOpacity>
          ) : (
            <PlusIcon />
          )}
          <CustomText fontSize={22} fontFamily={"medium"}>
            {isEditMode ? "Edit" : "Add"} Session{" "}
            {currentStep === 4 ? "(Preview)" : ""}
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
        <CustomButton type={"secondary"} onPress={handlePrev}>
          {currentStep === 1 ? "Cancel" : "Prev"}
        </CustomButton>
        <CustomButton onPress={handleNext} disabled={!canGoNext}>
          {currentStep === FormSteps.length ? "Save" : "Next"}
        </CustomButton>
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
