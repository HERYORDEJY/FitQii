import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface Props extends SvgProps {
  //
}

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      {...props}
    >
      <Path
        d="M2.12053 3.87295C2.26663 3.72392 2.49525 3.71037 2.65636 3.83231L2.70251 3.87295L6 7.23671L9.29749 3.87295C9.44359 3.72392 9.67221 3.71037 9.83331 3.83231L9.87947 3.87295C10.0256 4.02198 10.0388 4.25519 9.91931 4.41952L9.87947 4.4666L6.29099 8.12705C6.14489 8.27608 5.91627 8.28963 5.75517 8.1677L5.70901 8.12705L2.12053 4.4666C1.95982 4.30267 1.95982 4.03688 2.12053 3.87295Z"
        fill={props.color ?? "#FFF"}
      />
    </Svg>
  );
}

const ChevronDown = React.memo(SvgComponent);
export default ChevronDown;
