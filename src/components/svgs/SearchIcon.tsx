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
      height={17}
      fill="none"
      {...props}
    >
      <Path
        fill="#BBD39D"
        d="M12.208 10.833h-.724l-.256-.247a5.957 5.957 0 0 0 1.356-4.895c-.43-2.548-2.557-4.583-5.124-4.895A5.963 5.963 0 0 0 .796 7.46c.312 2.567 2.347 4.693 4.895 5.124a5.96 5.96 0 0 0 4.895-1.357l.247.257v.724l3.896 3.896a.968.968 0 0 0 1.366 0 .968.968 0 0 0 0-1.366l-3.887-3.905Zm-5.5 0a4.12 4.12 0 0 1-4.125-4.125 4.12 4.12 0 0 1 4.125-4.125 4.12 4.12 0 0 1 4.125 4.125 4.12 4.12 0 0 1-4.125 4.125Z"
      />
    </Svg>
  );
}

const SearchIcon = React.memo(SvgComponent);
export default SearchIcon;
