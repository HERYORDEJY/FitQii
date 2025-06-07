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
      height={19}
      fill="none"
      {...props}
    >
      <Path
        fill="#BBD39D"
        d="M9 0a7 7 0 0 0-7 7v3.528a1 1 0 0 1-.105.447L.178 14.408A1.1 1.1 0 0 0 1.162 16h15.676a1.1 1.1 0 0 0 .984-1.592l-1.716-3.433a1.001 1.001 0 0 1-.106-.447V7a7 7 0 0 0-7-7Zm0 19a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 9 19Z"
      />
    </Svg>
  );
}

const NotificationBellIcon = React.memo(SvgComponent);
export default NotificationBellIcon;
