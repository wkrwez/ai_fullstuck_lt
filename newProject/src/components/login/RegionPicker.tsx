import {
  FlatList,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import { Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CITY_CODE, CITY_NAME, CountryAbbr } from '@/src/constants';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { colorsUI, spacing } from '@/src/theme';
import { BounceView } from '../animation/BounceView';
import { Icon } from '../icons';
import { Header } from '../screen';
import { Text } from '../text';

type RegionPickProps = {
  visible: boolean;
  city: CountryAbbr;
  onSelect: (city: CountryAbbr | null) => void;
};

export const RegionPicker = ({ visible, city, onSelect }: RegionPickProps) => {
  const { paddingTop } = useSafeAreaInsetsStyle(['top'], 'padding');
  const citys = Object.keys(CITY_CODE) as CountryAbbr[];
  const renderItem = ({ item }: { item: CountryAbbr }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        key={item}
        onPress={() => onSelect(item)}
      >
        <View style={[$itemWrapStyle]}>
          <Text>
            {CITY_NAME[item]} {CITY_CODE[item]}
          </Text>
          {city === item && (
            <BounceView>
              <Icon color={colorsUI.Text.default.body} icon="right_outline" />
            </BounceView>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Modal animationType="slide" visible={visible}>
      <View
        style={{
          paddingTop
        }}
      >
        <Header
          headerLeft={() => (
            <Icon
              icon="close_outline"
              onPress={() => {
                onSelect(null);
              }}
            />
          )}
          title="选择国家/地区"
        />
        <FlatList
          data={citys}
          renderItem={renderItem}
          keyExtractor={item => item}
          style={{
            paddingHorizontal: spacing.mlg
          }}
        />
      </View>
    </Modal>
  );
};

const $itemWrapStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 56
  // backgroundColor: colors.backgroundGray,
};
