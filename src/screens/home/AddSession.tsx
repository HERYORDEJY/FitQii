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
];

export default function AddSession(props: Props): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState(2);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [formData, setFormData] = useState<Record<string, any>>({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  });
  console.log("\n\n formData :>> \t\t", formData, "\n\n---");
  const canGoNext = useMemo(() => {
    if (currentStep === 1) {
      return Boolean(formData.step1.name) && Boolean(formData.step1.category);
    }

    return false;
  }, [currentStep, formData.step1]);

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
    }
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
    scrollViewRef.current?.scrollTo({
      x: screenDimensions.width * currentStep,
      animated: true,
    });
  }, []);

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
            Add Session
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
                formData: { ...stepData, name: formData?.["step1"]?.name },
              })}
            </Fragment>
          );
        })}
      </Animated.ScrollView>

      <View style={[styles.footer]}>
        <TouchableOpacity style={[styles.cancelButton]} onPress={handlePrev}>
          <CustomText color={COLORS.primary} fontFamily={"bold"} fontSize={16}>
            Cancel
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
