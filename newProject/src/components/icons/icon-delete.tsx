import Svg, { Path } from 'react-native-svg';
import { type IconProp, getProps } from './utils';

export function IconDelete(props: IconProp) {
  return (
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...getProps(props)}
    >
      <Path
        d="M1.66602 3.87329H3.00284M14.3327 3.87329H13.1012M5.21066 3.87329L5.21071 3.16258C5.21077 2.42624 5.80771 1.82935 6.54405 1.82935H9.33997C10.0764 1.82935 10.6734 2.42636 10.6733 3.16278L10.6732 3.87329M5.21066 3.87329H10.6732M5.21066 3.87329H3.00284M10.6732 3.87329H13.1012M3.00284 3.87329L3.00296 12.0287C3.00298 13.2069 3.9581 14.162 5.1363 14.162H10.968C12.1462 14.162 13.1013 13.2069 13.1013 12.0287L13.1012 3.87329"
        stroke="#ED798E"
        stroke-linecap="round"
      />
      <Path
        d="M6.33398 7.23438V10.4065"
        stroke="#ED798E"
        stroke-width="1.49333"
        stroke-linecap="round"
      />
      <Path
        d="M9.66602 7.23438V10.4065"
        stroke="#ED798E"
        stroke-width="1.49333"
        stroke-linecap="round"
      />
    </Svg>
  );
}
