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
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <Path
        fill="#D9D9D9"
        d="M20 11.25h-8.75V20h-2.5v-8.75H0v-2.5h8.75V0h2.5v8.75H20v2.5Z"
      />
    </Svg>
  );
}

const PlusIcon = React.memo(SvgComponent);
export default PlusIcon;
