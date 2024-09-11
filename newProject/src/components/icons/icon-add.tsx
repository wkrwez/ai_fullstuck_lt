import Svg, { Path } from 'react-native-svg';
import { type IconProp, getProps } from './utils';

export const IconAdd = (props: IconProp) => {
  return (
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      {...getProps(props)}
      fill="none"
    >
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.1153 21.3593C11.1153 22.2079 11.8032 22.8958 12.6518 22.8958C13.5004 22.8958 14.1883 22.2079 14.1883 21.3593L14.1883 16.0988C14.1883 15.2359 14.8878 14.5363 15.7508 14.5363H21.0111C21.8596 14.5363 22.5475 13.8484 22.5475 12.9999C22.5475 12.1513 21.8596 11.4634 21.0111 11.4634H15.7508C14.8878 11.4634 14.1883 10.7638 14.1883 9.9009L14.1883 4.64058C14.1883 3.79202 13.5004 3.10413 12.6518 3.10413C11.8032 3.10413 11.1153 3.79202 11.1153 4.64058V9.9009C11.1153 10.7638 10.4158 11.4634 9.55284 11.4634H4.29232C3.44376 11.4634 2.75586 12.1513 2.75586 12.9999C2.75586 13.8484 3.44375 14.5363 4.29232 14.5363H9.55284C10.4158 14.5363 11.1153 15.2359 11.1153 16.0988V21.3593Z"
        fill="white"
      />
    </Svg>
  );
};
