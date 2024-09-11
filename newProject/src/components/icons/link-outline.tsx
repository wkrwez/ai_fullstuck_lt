import { type IconProp, getProps } from './utils';
import Svg, { Path } from 'react-native-svg';

export const IconLinkOutline: React.FC<IconProp> = (props) => {
  return (
    <Svg {...getProps(props)} viewBox="0 0 48 48">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.1715 9.85786C25.8577 5.17157 33.4557 5.17157 38.142 9.85786C42.8283 14.5441 42.8283 22.1421 38.142 26.8284L36.7278 28.2426C35.9468 29.0237 34.6804 29.0237 33.8994 28.2426C33.1183 27.4616 33.1183 26.1953 33.8994 25.4142L35.3136 24C38.4378 20.8758 38.4378 15.8105 35.3136 12.6863C32.1894 9.56209 27.1241 9.56209 23.9999 12.6863L19.7572 16.9289C18.9762 17.71 17.7099 17.71 16.9288 16.9289C16.1478 16.1479 16.1478 14.8815 16.9288 14.1005L21.1715 9.85786ZM26.8285 38.1421C22.1423 42.8284 14.5443 42.8284 9.85798 38.1421C5.17169 33.4558 5.17169 25.8579 9.85798 21.1716L11.2722 19.7574C12.0532 18.9763 13.3196 18.9763 14.1006 19.7574C14.8817 20.5384 14.8817 21.8047 14.1006 22.5858L12.6864 24C9.56221 27.1242 9.56221 32.1895 12.6864 35.3137C15.8106 38.4379 20.8759 38.4379 24.0001 35.3137L28.2428 31.0711C29.0238 30.29 30.2901 30.29 31.0712 31.0711C31.8522 31.8521 31.8522 33.1184 31.0712 33.8995L26.8285 38.1421ZM28.9499 21.8787C29.7309 21.0976 29.7309 19.8313 28.9499 19.0502C28.1688 18.2692 26.9025 18.2692 26.1214 19.0502L19.0504 26.1213C18.2693 26.9024 18.2693 28.1687 19.0504 28.9497C19.8314 29.7308 21.0977 29.7308 21.8788 28.9497L28.9499 21.8787Z"
      ></Path>
    </Svg>
  );
};
