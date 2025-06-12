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
      width={17}
      height={18}
      fill="none"
      {...props}
    >
      <Path
        stroke="#BBD39D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m5.928 11.767 5.254-5.115M4.027 8.5l-1.97 1.918a3.667 3.667 0 1 0 5.114 5.255l1.97-1.918M7.969 4.664l1.97-1.918A3.667 3.667 0 0 1 15.054 8l-1.97 1.918"
      />
    </Svg>
  );
}

const LinkIcon = React.memo(SvgComponent);
export default LinkIcon;
