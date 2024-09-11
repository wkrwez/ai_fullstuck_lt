import Feed from './feed';

export default function App() {
  return (
    // <View style={styles.container}>
    //   <ToastGlobal></ToastGlobal>

    //   <Text>open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    //   <Button preset="small" >
    //     显示弹窗
    //   </Button>
    //   <Button preset="middle" onPress={onLogin}>
    //     登录
    //   </Button>
    //   <Button preset="large" iconText={'xx'} onPress={onMakePhoto}>
    //     捏图
    //   </Button>
    //   <Button preset="outline" onPress={gotoFeed}>
    //     信息流
    //   </Button>
    // </View>
    // 先静默，后续考虑要不要有 navigation
    <Feed></Feed>
  );
}
