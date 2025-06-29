import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface Props extends SvgProps {
  active?: boolean;
}

function SvgComponent(props: Props) {
  if (props.active) {
    return (
      <Svg
        //@ts-ignore
        xmlns="http://www.w3.org/2000/svg"
        width={27}
        height={30}
        fill="none"
        {...props}
      >
        <Path
          fill="#BBD39D"
          fillRule="evenodd"
          d="M6.93.833h13.473c1.642 0 2.462 0 3.125.231a4.314 4.314 0 0 1 2.665 2.743c.224.683.224 1.527.224 3.217v19.84c0 1.215-1.396 1.86-2.278 1.053a1.34 1.34 0 0 0-1.82 0l-.683.626a2.347 2.347 0 0 1-3.188 0 2.348 2.348 0 0 0-3.188 0 2.347 2.347 0 0 1-3.187 0 2.348 2.348 0 0 0-3.188 0 2.347 2.347 0 0 1-3.187 0l-.684-.626a1.34 1.34 0 0 0-1.82 0c-.882.808-2.277.162-2.277-1.054V7.024c0-1.69 0-2.536.224-3.216a4.313 4.313 0 0 1 2.664-2.744c.663-.23 1.484-.23 3.126-.23Zm-.347 6.73a1.062 1.062 0 0 0 0 2.124h.709a1.062 1.062 0 0 0 0-2.125h-.709Zm4.959 0a1.063 1.063 0 0 0 0 2.124h9.208a1.063 1.063 0 0 0 0-2.125h-9.208ZM6.583 12.52a1.063 1.063 0 0 0 0 2.125h.709a1.062 1.062 0 1 0 0-2.125h-.709Zm4.959 0a1.063 1.063 0 0 0 0 2.125h9.208a1.062 1.062 0 1 0 0-2.125h-9.208Zm-4.959 4.958a1.063 1.063 0 0 0 0 2.125h.709a1.062 1.062 0 1 0 0-2.125h-.709Zm4.959 0a1.063 1.063 0 0 0 0 2.125h9.208a1.062 1.062 0 1 0 0-2.125h-9.208Z"
          clipRule="evenodd"
        />
      </Svg>
    );
  }
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={23}
      height={26}
      fill="none"
      {...props}
    >
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeOpacity={0.6}
        strokeWidth={1.5}
        d="M9.917 11.833H17.5m-11.667 0h.584M5.833 7.75h.584m-.584 8.167h.584m11.083 0h-1.167m-6.416 0h3.5M17.5 7.75H14m-4.083 0h1.166m11.084-.583v-.735c0-1.392 0-2.089-.185-2.649a3.553 3.553 0 0 0-2.194-2.26c-.546-.19-1.222-.19-2.574-.19H6.12c-1.352 0-2.027 0-2.573.19a3.554 3.554 0 0 0-2.195 2.26c-.184.561-.184 1.257-.184 2.649V16.5m21-4.667V22.77c0 1-1.15 1.533-1.876.868a1.104 1.104 0 0 0-1.498 0l-.564.515a1.933 1.933 0 0 1-2.625 0 1.933 1.933 0 0 0-2.625 0 1.933 1.933 0 0 1-2.625 0 1.933 1.933 0 0 0-2.625 0 1.933 1.933 0 0 1-2.625 0l-.563-.515a1.104 1.104 0 0 0-1.498 0c-.727.665-1.876.133-1.876-.868v-1.603"
      />
    </Svg>
  );
}

const SessionsTabIcon = React.memo(SvgComponent);
export default SessionsTabIcon;
