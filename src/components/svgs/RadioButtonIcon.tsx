import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";

interface Props extends SvgProps {
  //
}

function SvgComponent(props: Props) {
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={12}
      fill="none"
      {...props}
    >
      <G fill="#fff" fillOpacity={0.6} clipPath="url(#a)">
        <Path d="M6.5 3c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3Z" />
        <Path d="M6.5.75A5.218 5.218 0 0 1 11.75 6a5.218 5.218 0 0 1-5.25 5.25A5.218 5.218 0 0 1 1.25 6 5.218 5.218 0 0 1 6.5.75Zm0-.75c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M.5 0h12v12H.5z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const RadioButtonIcon = React.memo(SvgComponent);
export default RadioButtonIcon;
