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
      height={14}
      fill="none"
      {...props}
    >
      <Path
        stroke="#BBD39D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m4.713 9.488 5.72-5.064c.717-.635 1.75-.75 2.47-.115.717.636.588 1.552-.13 2.187l-5.98 5.294c-1.04.92-3.12.92-4.42-.23-1.3-1.151-1.3-2.992-.26-3.913l5.98-5.294c.899-.782 2.11-1.217 3.37-1.212 1.26.005 2.467.45 3.358 1.24.89.788 1.394 1.857 1.4 2.972.005 1.116-.487 2.188-1.37 2.984l-3.379 2.992"
      />
    </Svg>
  );
}

const AttachmentIcon = React.memo(SvgComponent);
export default AttachmentIcon;
