import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/src/components';
import { CommonColor } from '@/src/theme/colors/common';
import { EmptyPlaceHolder } from '@Components/Empty';
import { Screen } from '@Components/screen';

export default function ExptyPage() {
  const { type, text } = useLocalSearchParams();
  return (
    <Screen
      title=""
      screenStyle={{
        backgroundColor: CommonColor.white
      }}
      headerStyle={{
        borderBottomColor: 'rgba(210,210,210,1)',
        borderBottomWidth: 0.2
      }}
    >
      <View style={{ width: '100%', height: '100%' }}>
        <View style={{ zIndex: 99 }}>
          <EmptyPlaceHolder>
            {type === 'user' ? (
              <Text color="rgba(0,0,0,0.4)">来晚了，用户注销了</Text>
            ) : (
              <Text color="rgba(0,0,0,0.4)">
                {text || '来晚了，作品消失啦'}
              </Text>
            )}
          </EmptyPlaceHolder>
        </View>
      </View>
    </Screen>
  );
}
