import Svg, { Path } from 'react-native-svg';
import { type IconProp, getProps } from './utils';

export function IconClose(props: IconProp) {
  return (
    <Svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      {...getProps(props)}
    >
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.826028 9.71864C0.394011 10.1507 0.39401 10.8511 0.826028 11.2831V11.2831C1.25805 11.7151 1.95849 11.7151 2.3905 11.2831L5.31384 8.35978C5.75318 7.92044 6.46549 7.92044 6.90483 8.35978L9.8282 11.2832C10.2602 11.7152 10.9607 11.7152 11.3927 11.2832V11.2832C11.8247 10.8511 11.8247 10.1507 11.3927 9.71868L8.4693 6.79531C8.02996 6.35597 8.02996 5.64366 8.4693 5.20432L11.3925 2.28112C11.8245 1.84911 11.8245 1.14867 11.3925 0.716651V0.716651C10.9605 0.284633 10.26 0.284634 9.82802 0.716652L6.90483 3.63984C6.46549 4.07918 5.75318 4.07918 5.31384 3.63984L2.39069 0.716693C1.95867 0.284676 1.25823 0.284675 0.826215 0.716693V0.716693C0.394197 1.14871 0.394198 1.84915 0.826215 2.28117L3.74936 5.20432C4.1887 5.64366 4.1887 6.35597 3.74936 6.79531L0.826028 9.71864Z"
        fill="white"
      />
    </Svg>
  );
}