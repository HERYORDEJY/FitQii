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
      height={16}
      viewBox={"0 0 16 16"}
      fill="none"
      {...props}
    >
      <Path
        fill="#BBD39D"
        d="M8 .5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15ZM8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm0 1.5a.75.75 0 0 1 .745.662l.005.088v3.44l2.03 2.03a.75.75 0 0 1-.99 1.122l-.07-.062-2.25-2.25a.75.75 0 0 1-.213-.432L7.25 8V4.25A.75.75 0 0 1 8 3.5Z"
      />
    </Svg>
  );
}

const ClockIcon = React.memo(SvgComponent);
export default ClockIcon;
