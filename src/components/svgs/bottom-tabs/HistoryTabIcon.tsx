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
        width={33}
        height={32}
        fill="none"
        {...props}
      >
        <Path
          fill="#BBD39D"
          d="M16.667 2.667A13.356 13.356 0 0 0 7.34 6.496V4a1.333 1.333 0 0 0-2.666 0v6a1.333 1.333 0 0 0 1.333 1.333h6a1.333 1.333 0 0 0 0-2.666h-3.05A10.64 10.64 0 1 1 6 16a1.333 1.333 0 0 0-2.667 0A13.333 13.333 0 1 0 16.668 2.667Z"
        />
        <Path
          fill="#BBD39D"
          d="M19.334 17.333h-2.667A1.333 1.333 0 0 1 15.333 16v-4A1.334 1.334 0 0 1 18 12v2.667h1.334a1.333 1.333 0 0 1 0 2.666Z"
        />
        <Path
          fill="#BBD39D"
          d="M16.667 5.333a10.678 10.678 0 0 0-7.71 3.334h3.051a1.333 1.333 0 0 1 0 2.666h-6a1.32 1.32 0 0 1-1.304-1.185A13.23 13.23 0 0 0 3.334 16 1.333 1.333 0 1 1 6 16 10.667 10.667 0 1 0 16.667 5.333Zm2.666 12h-2.666A1.334 1.334 0 0 1 15.333 16v-4A1.333 1.333 0 0 1 18 12v2.667h1.334a1.333 1.333 0 1 1 0 2.666Z"
          opacity={0.5}
        />
      </Svg>
    );
  }
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <Path
        fill="#fff"
        fillOpacity={0.6}
        d="M22.104 6.167c3.222 5.58 1.31 12.716-4.27 15.936-4.81 2.777-10.772 1.74-14.391-2.17a1.167 1.167 0 0 1 1.713-1.584 9.333 9.333 0 1 0-2.404-7.611l1.495-.391c1.221-.319 2.12 1.132 1.292 2.085L2.912 15.45c-.663.76-1.942.502-2.207-.518A11.667 11.667 0 0 1 6.167 1.897c5.58-3.222 12.715-1.31 15.937 4.27ZM12 5a1.167 1.167 0 0 1 1.167 1.167v5.35l3.158 3.158a1.17 1.17 0 0 1 .015 1.664 1.168 1.168 0 0 1-1.665-.014l-3.5-3.5a1.167 1.167 0 0 1-.341-.825V6.167A1.167 1.167 0 0 1 12 5Z"
      />
    </Svg>
  );
}

const HistoryTabIcon = React.memo(SvgComponent);
export default HistoryTabIcon;
