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
      height={18}
      viewBox={"0 0 18 18"}
      fill="none"
      {...props}
    >
      <Path
        fill="#BBD39D"
        d="M5.25 8.25h1.5v1.5h-1.5v-1.5Zm0 3h1.5v1.5h-1.5v-1.5Zm3-3h1.5v1.5h-1.5v-1.5Zm0 3h1.5v1.5h-1.5v-1.5Zm3-3h1.5v1.5h-1.5v-1.5Zm0 3h1.5v1.5h-1.5v-1.5Z"
      />
      <Path
        fill="#BBD39D"
        d="M3.75 16.5h10.5c.827 0 1.5-.673 1.5-1.5V4.5c0-.827-.673-1.5-1.5-1.5h-1.5V1.5h-1.5V3h-4.5V1.5h-1.5V3h-1.5c-.827 0-1.5.673-1.5 1.5V15c0 .827.673 1.5 1.5 1.5ZM14.25 6v9H3.75V6h10.5Z"
      />
    </Svg>
  );
}

const CalendarIcon = React.memo(SvgComponent);
export default CalendarIcon;
