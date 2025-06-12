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
      height={14}
      viewBox="0 0 17 14"
      fill="none"
      {...props}
    >
      <Path
        fill="#BBD39D"
        d="M10.125 4H9v3.75l3.21 1.905.54-.907-2.625-1.56V4ZM9.75.25A6.75 6.75 0 0 0 3 7H.75l2.97 3.023L6.75 7H4.5a5.25 5.25 0 1 1 5.25 5.25 5.208 5.208 0 0 1-3.705-1.545L4.98 11.77a6.674 6.674 0 0 0 4.77 1.98 6.75 6.75 0 0 0 0-13.5Z"
      />
    </Svg>
  );
}

const RepeatIcon = React.memo(SvgComponent);
export default RepeatIcon;
