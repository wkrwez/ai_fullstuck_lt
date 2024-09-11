import { useLocalSearchParams } from 'expo-router';
import { ReactNode } from 'react';
import { Platform, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { spacing } from '@/src/theme';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { reportClick } from '@/src/utils/report';
import { Icon } from '@Components/icons';
import { SheetModal } from '@Components/sheet';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';

interface IShareSheetModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  maskClosable?: boolean;
  theme?: Theme;
  maskChildren?: React.ReactNode;
}

export function ShareSheetModal(props: IShareSheetModalProps) {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);

  const { id: cardId } = useLocalSearchParams();

  const themeConfig = getThemeColor(props.theme);

  const onClickClose = (isClickIcon: boolean) => {
    reportClick('share_component', {
      contentid: cardId,
      share_component: isClickIcon ? '10' : '11'
    });

    props.onClose();
  };

  return (
    <SheetModal
      maskClosable={props.maskClosable ?? true}
      maskShown={true}
      remainHeight={0}
      isVisible={props.visible}
      onClose={() => onClickClose(false)}
      style={{ backgroundColor: themeConfig.bg }}
      theme={props.theme}
      maskChildren={props.maskChildren}
    >
      <View style={[st.$wrap]}>
        <View
          style={[StyleSheet.rowStyle, { justifyContent: 'space-between' }]}
        >
          <Text preset="title" style={{ color: themeConfig.fontColor }}>
            分享至
          </Text>
          <TouchableOpacity onPress={() => onClickClose(true)}>
            <View style={[$closeBtn, { backgroundColor: themeConfig.eleBg }]}>
              <Icon
                color={themeConfig.fontColor2}
                icon="close_outline"
                size={18}
                hitSlop={spacing.xs}
              />
            </View>
          </TouchableOpacity>
        </View>
        {props.children}
      </View>
    </SheetModal>
  );
}

const st = StyleSheet.create({
  $wrap: {
    width: '100%',
    borderRadius: 20,
    padding: 16,
    paddingBottom: 0
  },
  $title: {
    fontSize: 16,
    fontWeight: '600'
  }
});

const $closeBtn: ViewStyle = {
  borderRadius: 100,
  padding: 4
};
