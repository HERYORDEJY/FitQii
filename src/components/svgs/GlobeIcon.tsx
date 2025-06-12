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
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <Path
        fill="#BBD39D"
        d="M8 .688A7.312 7.312 0 1 0 15.313 8 7.321 7.321 0 0 0 8 .687ZM14.188 8a6.16 6.16 0 0 1-.235 1.688h-2.707a11.064 11.064 0 0 0 0-3.376h2.707A6.16 6.16 0 0 1 14.188 8Zm-8.016 2.813h3.656A8.093 8.093 0 0 1 8 13.976a8.108 8.108 0 0 1-1.828-3.165Zm-.274-1.126a9.9 9.9 0 0 1 0-3.374h4.21a9.904 9.904 0 0 1 0 3.375h-4.21ZM1.813 8c-.001-.57.078-1.139.234-1.688h2.707a11.067 11.067 0 0 0 0 3.375H2.047A6.16 6.16 0 0 1 1.812 8Zm8.015-2.813H6.172A8.093 8.093 0 0 1 8 2.023a8.107 8.107 0 0 1 1.828 3.164Zm3.68 0h-2.505a9.514 9.514 0 0 0-1.568-3.206 6.208 6.208 0 0 1 4.075 3.207h-.002ZM6.565 1.982a9.513 9.513 0 0 0-1.568 3.207H2.49A6.208 6.208 0 0 1 6.565 1.98ZM2.49 10.813h2.507a9.514 9.514 0 0 0 1.568 3.206 6.209 6.209 0 0 1-4.075-3.207Zm6.945 3.206a9.515 9.515 0 0 0 1.568-3.207h2.507a6.207 6.207 0 0 1-4.075 3.207Z"
      />
    </Svg>
  );
}

const GlobeIcon = React.memo(SvgComponent);
export default GlobeIcon;
