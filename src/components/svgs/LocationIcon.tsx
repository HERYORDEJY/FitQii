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
      width={16}
      height={18}
      fill="none"
      {...props}
    >
      <Path
        stroke="#BBD39D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8.513 17.085a.884.884 0 0 1-1.026 0C3.06 13.93-1.638 7.44 3.11 2.75A6.96 6.96 0 0 1 8 .75a6.96 6.96 0 0 1 4.889 2c4.749 4.689.051 11.178-4.376 14.335Z"
      />
      <Path
        stroke="#BBD39D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 9a1.833 1.833 0 1 0 0-3.667A1.833 1.833 0 0 0 8 9Z"
      />
    </Svg>
  );
}

const LocationIcon = React.memo(SvgComponent);
export default LocationIcon;
