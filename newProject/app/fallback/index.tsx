import { useLocalSearchParams } from 'expo-router';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Image, ImageStyle, Text } from '@/src/components';
import { CommonColor } from '@/src/theme/colors/common';
import { EmptyPlaceHolder } from '@Components/Empty';
import { Screen } from '@Components/screen';
import { centerStyle } from '@/src/theme';
import { useAppUpdateInfo } from '@/src/hooks/useCheckUpdate';
import { useAppStore } from '@/src/store/app';

const TipImage = require('@Assets/image/update-app.png');

const $img: ImageStyle = {
    width: 308,
    height: 144,
    resizeMode: 'cover'
}

const $text: TextStyle = {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18
}

const $btn: ViewStyle = {
    marginTop: 18,
    width: 110,
    height: 36,
    borderRadius: 36,
    backgroundColor: '#FF6A3B',
    ...centerStyle
}

export default function UpdatePage() {

    const checkUpdate = useAppStore(state => state.checkUpdate);
    const { goToUpdate } = useAppUpdateInfo();
    const handleClick = () => {
        checkUpdate().then(res => {
            console.log('=====res========', res);
            goToUpdate();
        });
    }

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
        <View style={{ width: '100%', height: '100%', ...centerStyle }}>
            <View style={centerStyle}>
                <Image style={$img} source={TipImage} />
                <TouchableOpacity style={$btn} onPress={handleClick}>
                    <Text style={$text}>立即更新</Text>
                </TouchableOpacity>
            </View>
        </View>
        </Screen>
    );
}
