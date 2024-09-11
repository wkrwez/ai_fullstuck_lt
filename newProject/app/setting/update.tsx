import { View } from 'react-native';
import { Screen } from '@Components/screen';
import { Text } from '@/src/components/text';
import { Image } from '@/src/components/image';
// import { UPDATE_IMAGE } from "@/src/constants";
import { Button } from '@/src/components/button';
import { colorsUI, spacing, typography } from '@/src/theme';
import { Icon } from '@/src/components/icons';
// import { useAppUpdateInfo } from '@/src/hooks/useCheckUpdate';
import { useLocalSearchParams } from 'expo-router';

export default function AboutScreen() {
  // const { goToUpdate, releaseNotes, versionNumText } = useAppUpdateInfo();
  const { force } = useLocalSearchParams();
  return (
    <Screen
      title="版本更新"
      safeAreaEdges={['top', 'bottom']}
      contentContainerStyle={{
        paddingHorizontal: 32,
      }}
      backButton={!force}
    >
      <View
        style={{
          flex: 1,
          marginTop: 10,
          justifyContent: 'space-between',
        }}
      >
        <View>
          {/* <Image
            source={UPDATE_IMAGE}
            style={{
              alignSelf: 'center',
              width: 240,
              height: 200,
            }}
          /> */}
          <View>
            <Text
              preset="bold"
              size="xl"
              style={{
                marginBottom: spacing.sm,
              }}
            >
              发现新版本!
            </Text>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  borderRadius: 2,
                  backgroundColor: colorsUI.Text.brand.brand,
                  padding: 4,
                  paddingHorizontal: 6,
                  paddingBottom: 2,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fonts.campton,
                    fontWeight: '500',
                    lineHeight: 16,
                    color: 'white',
                  }}
                >
                  {/* {versionNumText} */}
                </Text>
              </View>
            </View>
            {/* {releaseNotes.map((item, idx) => {
              return (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: 4,
                  }}
                >
                  <Icon
                    style={{ marginRight: spacing.xs, marginTop: 8 }}
                    size={10}
                    icon="dot"
                  />
                  <Text style={{ fontSize: 15, lineHeight: 26 }}>{item}</Text>
                </View>
              );
            })} */}
          </View>
        </View>
        <Button
          style={{
            width: '100%',
          }}
          preset="primary"
          // onPress={goToUpdate}
        >
          立即更新
        </Button>
      </View>
    </Screen>
  );
}
