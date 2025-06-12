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
        width={28}
        height={25}
        fill="none"
        {...props}
      >
        <Path
          fill="#BBD39D"
          fillRule="evenodd"
          d="M15.637.584a2.667 2.667 0 0 0-3.274 0L1.184 9.277c-1.003.783-.45 2.39.82 2.39h1.33v10.666A2.667 2.667 0 0 0 6 25h6.667v-9.333a1.333 1.333 0 1 1 2.666 0V25H22a2.667 2.667 0 0 0 2.667-2.667V11.667h1.329c1.27 0 1.824-1.607.82-2.388L15.637.584Z"
          clipRule="evenodd"
        />
      </Svg>
    );
  }
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={23}
      fill="none"
      {...props}
    >
      <Path
        fill="#fff"
        fillOpacity={0.6}
        fillRule="evenodd"
        d="M13.433 1.136a2.333 2.333 0 0 0-2.866 0L.786 8.743c-.877.685-.394 2.09.718 2.09h1.163v9.334A2.333 2.333 0 0 0 5 22.5h14a2.333 2.333 0 0 0 2.333-2.333v-9.334h1.164c1.11 0 1.596-1.405.717-2.09l-9.781-7.607Zm-.266 19.03v-7a1.167 1.167 0 1 0-2.334 0v7H5V9.679c0-.37-.17-.7-.437-.915L12 2.978l7.438 5.785a1.166 1.166 0 0 0-.438.915v10.489h-5.833Z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

const HomeTabIcon = React.memo(SvgComponent);
export default HomeTabIcon;
