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
      width={10}
      height={8}
      viewBox={`0 0 10 8`}
      fill="none"
      {...props}
    >
      <Path
        fill={props.color ?? "#fff"}
        d="m5.452 8-.657-.648 2.702-2.701H.5v-.938h6.997L4.795 1.02l.657-.656L9.27 4.182 5.452 8Z"
      />
    </Svg>
  );
}

const ArrowRightIcon = React.memo(SvgComponent);
export default ArrowRightIcon;
