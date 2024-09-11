import Svg, { Path } from 'react-native-svg';
import { type IconProp, getProps } from './utils';

export function IconDownload(props: IconProp) {
  return (
    <Svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      {...getProps(props)}
    >
      <Path
        d="M4.30181 8.37657C3.64176 7.82102 4.03461 6.7442 4.89734 6.7442H5.46584C6.079 6.7442 6.57606 6.24713 6.57606 5.63397V3.09924C6.57606 2.48608 7.07313 1.98901 7.68629 1.98901H10.221C10.8342 1.98901 11.3313 2.48608 11.3313 3.09924V5.63397C11.3313 6.24713 11.8283 6.7442 12.4415 6.7442H13.01C13.8727 6.7442 14.2655 7.82102 13.6055 8.37657L9.66858 11.6902C9.25541 12.0379 8.65192 12.0379 8.23874 11.6902L4.30181 8.37657Z"
        fill="white"
      />
      <Path
        d="M4.41406 13.5398H13.4944"
        stroke="white"
        stroke-width="1.27273"
        stroke-linecap="round"
      />
    </Svg>
  );
}
