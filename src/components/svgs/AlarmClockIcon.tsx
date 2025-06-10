import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface Props extends SvgProps {
  //
}

function SvgComponent(props: Props) {
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={16}
      fill="none"
      {...props}
    >
      <Path
        stroke="#BBD39D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 14.75a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
      />
      <Path
        stroke="#BBD39D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5.75v3l1.5 1.5m-6.75-9L1.5 3.5m15 0-2.25-2.25M4.785 13.025 3 14.75m10.23-1.748L15 14.75"
      />
    </Svg>
  );
}

const AlarmClockIcon = React.memo(SvgComponent);
export default AlarmClockIcon;
