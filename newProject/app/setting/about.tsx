import { ImageStyle } from 'expo-image';
import { router } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';
import { showToast } from '@/src/components/toast';
import {
  AGREEMENT_URL,
  ALGORITHUM_URL,
  CHILDREN_URL,
  PERSONAL_INFORMATION_URL,
  PRIVACY_SUMMARY_URL,
  PRIVACY_URL,
  REGISTERED_URL,
  SDK_URL,
  USER_MANAGEMENT_URL
} from '@/src/constants';
import { useJumpUpdate } from '@/src/hooks/useCheckUpdate';
import { getVersionStr } from '@/src/utils/getVersion';
import { Screen } from '@Components/screen';
import { SettingGroup, SettingItem } from '@Components/setting';
import { StyleSheet } from '@Utils/StyleSheet';
import { getChannel } from '@Utils/getChannel';

// import { useJumpUpdate } from "@/src/hooks/useCheckUpdate";
const appImage = require('@Assets/icon.png');

export default function AboutScreen() {
  const versionStr = getVersionStr();

  const jump = useJumpUpdate();
  const onCreatePress = (url: string, title: string) => () => {
    if (url) {
      // 跳转到协议详情页
      router.push({
        pathname: '/webview',
        params: {
          url,
          title
        }
      });
    } else {
      showToast('暂无实现');
    }
  };
  return (
    <Screen title="关于小狸" screenStyle={{ backgroundColor: '#f4f4f4' }}>
      <ScrollView>
        <View style={st.$head}>
          <Image source={appImage} style={st.$headImage as ImageStyle}></Image>
          <Text style={st.$appName}>狸谱</Text>
          <Text style={st.$version}>{versionStr}</Text>
        </View>
        <SettingGroup style={{ marginTop: 0, backgroundColor: '#ffffff' }}>
          <SettingItem
            key="versionUpdate"
            title="版本更新"
            leftIcon={''}
            onPress={jump}
          ></SettingItem>
          <SettingItem
            key={AGREEMENT_URL}
            title="用户协议"
            leftIcon={''}
            onPress={onCreatePress(AGREEMENT_URL, '用户协议')}
          ></SettingItem>

          <SettingItem
            key={PRIVACY_SUMMARY_URL}
            title="隐私政策摘要"
            leftIcon={''}
            onPress={onCreatePress(PRIVACY_SUMMARY_URL, '隐私政策摘要')}
          ></SettingItem>
          <SettingItem
            key={PRIVACY_URL}
            title="隐私政策"
            leftIcon={''}
            onPress={onCreatePress(PRIVACY_URL, '隐私政策')}
          ></SettingItem>
          <SettingItem
            key={CHILDREN_URL}
            title="儿童个人信息处理规则"
            leftIcon={''}
            onPress={onCreatePress(CHILDREN_URL, '儿童个人信息处理规则')}
          ></SettingItem>
          <SettingItem
            key={USER_MANAGEMENT_URL}
            title="用户管理规则及公约"
            leftIcon={''}
            onPress={onCreatePress(USER_MANAGEMENT_URL, '用户管理规则及公约')}
          ></SettingItem>
          <SettingItem
            key={PERSONAL_INFORMATION_URL}
            title="个人信息收集清单"
            leftIcon={''}
            onPress={onCreatePress(
              PERSONAL_INFORMATION_URL,
              '个人信息收集清单'
            )}
          ></SettingItem>
          <SettingItem
            key={SDK_URL}
            title="第三方 SDK 清单"
            leftIcon={''}
            onPress={onCreatePress(SDK_URL, '第三方 SDK 清单')}
          ></SettingItem>
          <SettingItem
            key={REGISTERED_URL}
            title="备案公示"
            leftIcon={''}
            onPress={onCreatePress(REGISTERED_URL, '备案公示')}
          >
            <Text
              style={{
                color: StyleSheet.hex(StyleSheet.currentColors.black, 0.4),
                fontSize: 11,
                fontWeight: '500'
              }}
            >
              沪ICP备2024068689号-3A
              {/* {userName} */}
            </Text>
          </SettingItem>
          <SettingItem
            key={ALGORITHUM_URL}
            title="算法备案"
            leftIcon={''}
            onPress={onCreatePress(ALGORITHUM_URL, '算法备案')}
          >
            <Text
              style={{
                color: StyleSheet.hex(StyleSheet.currentColors.black, 0.4),
                fontSize: 11,
                fontWeight: '500'
              }}
            >
              网信算备310104597109301240013号
            </Text>
          </SettingItem>
          {/* </View> */}
        </SettingGroup>
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  $head: {
    width: '100%',
    height: 167,
    alignItems: 'center'
  },
  $headImage: {
    width: 76,
    height: 76,
    borderRadius: 20,
    marginTop: 20
  },
  $appName: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    marginTop: 6
  },
  $version: {
    color: 'rgba(0,0,0, 0.4)',
    fontWeight: '500',
    fontSize: 12,
    paddingTop: 6
  }
});
