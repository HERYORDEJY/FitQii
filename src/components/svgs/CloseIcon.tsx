import * as React from "react";
import { memo } from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const SvgComponent = (props: SvgProps) => (
  <Svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    //@ts-ignore
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0.922193 14.7411C0.586233 15.0771 0.576351 15.6502 0.922193 15.9862C1.26804 16.3221 1.84114 16.3221 2.17711 15.9862L8.50107 9.66221L14.825 15.9862C15.161 16.3221 15.744 16.332 16.08 15.9862C16.4159 15.6403 16.4159 15.0771 16.08 14.7411L9.75599 8.40729L16.08 2.08333C16.4159 1.74737 16.4258 1.17426 16.08 0.838295C15.7341 0.492453 15.161 0.492453 14.825 0.838295L8.50107 7.16226L2.17711 0.838295C1.84114 0.492453 1.25815 0.482572 0.922193 0.838295C0.586233 1.18414 0.586233 1.74737 0.922193 2.08333L7.24616 8.40729L0.922193 14.7411Z"
      fill={props.color ?? "#292D32"}
    />
  </Svg>
);
const CloseIcon = memo(SvgComponent);
export default CloseIcon;
