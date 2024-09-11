import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Avatar } from '@/src/components/avatar';
import { useScreenSize } from '@/src/hooks';
import { Icon } from '@Components/icons';

interface SkeletonLoaderProps {
  size?: number;
  type?: string;
  withTimin?: number; //线条扫过的宽度
  duration?: number; //线条扫过的时间
  width?: number; //线条宽度
}

const style = StyleSheet.create({
  $wrap: {
    position: 'relative',
    height: 'auto',
    width: 'auto'
    //   backgroundColor: 'red'
  },
  $animate: {
    position: 'absolute',
    zIndex: 999,
    height: '100%',
    width: '100%'
  }
});

const headerImage = require('@/assets/image/Ellipse.png');
const pagination = require('@Assets/image/pagination.png');

export const SkeletonLoader = (props: SkeletonLoaderProps) => {
  const { width = 50, type, withTimin = 150, duration = 1000 } = props;
  const position = useSharedValue(-width);
  const positionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }]
  }));

  const animate = useCallback(() => {
    position.value = withRepeat(
      withTiming(withTimin, { duration: duration, easing: Easing.linear }),
      -1
    );
  }, []);

  useEffect(() => {
    animate();
    return () => {
      position.value = withSpring(-width);
    };
  }, [animate]);

  return (
    <View style={style.$wrap}>
      <Animated.View style={[positionStyle, style.$animate]}>
        <LinearGradient
          style={[{ width: width, height: '100%' }]}
          colors={[
            'rgba(255, 255, 255,0) 40%',
            'rgba(255, 255, 255, 1) 50%',
            'rgba(255, 255, 255, 0) 60%',
            '#ffffff'
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        ></LinearGradient>
      </Animated.View>
      {type === 'imageContent' && <ImageContent />}
      {type === 'homepage' && <Homepage />}
      {type === 'ip' && <IPLoad />}
      {type === 'follow' && <Focus />}
      {type === 'product' && <Products />}
      {type === 'commitInput' && <CommitInput />}
      {type === 'commitList' && <CommitList />}
    </View>
  );
};

/*粉丝，关注*/
const Focus = () => {
  const st = StyleSheet.create({
    $total: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    },
    $wrap: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    $nickname: {
      backgroundColor: 'rgba(235,235,235,1)',
      width: 110,
      height: 21,
      borderRadius: 4,
      marginLeft: 12
    },
    $follow: {
      marginRight: 16,
      backgroundColor: 'rgba(235,235,235,1)',
      width: 68,
      height: 26,
      borderRadius: 100
    }
  });
  return (
    <View style={st.$total}>
      <View style={st.$wrap}>
        <Avatar size={54} source={headerImage} />
        <Text style={st.$nickname}></Text>
      </View>
      <Text style={st.$follow}></Text>
    </View>
  );
};
//瀑布流作品
const Products = () => {
  const st = StyleSheet.create({
    $total: {
      width: 178,
      height: 300,
      borderRadius: 10
    },
    $content1: {
      width: 131,
      height: 18,
      backgroundColor: 'rgba(235,235,235,1)',
      margin: 10,
      borderRadius: 3
    },
    $content2: {
      width: 102,
      height: 14,
      backgroundColor: 'rgba(235,235,235,1)',
      marginLeft: 10,
      borderRadius: 3
    },
    $image: {
      width: 178,
      height: 238,
      backgroundColor: 'rgba(235,235,235,1)',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    }
  });
  return (
    <View style={st.$total}>
      <View style={st.$image}></View>
      <Text style={st.$content1}></Text>
      <Text style={st.$content2}></Text>
    </View>
  );
};
//IP页头部
const IPLoad = () => {
  const st = StyleSheet.create({
    $public: {
      backgroundColor: 'rgba(235,235,235,1)',
      height: 16,
      borderRadius: 4,
      marginBottom: 14
    },
    $warp: {
      width: 122,
      height: 122,
      marginLeft: 26,
      backgroundColor: 'rgba(235,235,235,1)',
      borderRadius: 10
    },
    $header: {
      backgroundColor: 'rgba(235,235,235,1)',
      width: 60,
      height: 24,
      borderRadius: 6,
      marginBottom: 18
    }
  });
  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View style={st.$warp}></View>
      <View
        style={{
          marginLeft: 16
        }}
      >
        <Text style={st.$header}></Text>
        <Text style={[{ width: 180, ...st.$public }]}></Text>
        <Text style={[{ width: 180, ...st.$public }]}></Text>
        <Text style={[{ width: 107, ...st.$public }]}></Text>
      </View>
    </View>
  );
};
//个人主页头部
const Homepage = () => {
  const st = StyleSheet.create({
    $public: {
      width: 50,
      height: 22,
      borderRadius: 4,
      backgroundColor: 'rgba(235,235,235,1)'
    },
    $warp: {
      display: 'flex',
      alignItems: 'center'
    },
    $nickname: {
      width: 202,
      height: 22,
      backgroundColor: 'rgba(235,235,235,1)',
      marginBottom: 30,
      marginTop: 15,
      borderRadius: 4
    },
    $sort: {
      height: 22,
      display: 'flex',
      flexDirection: 'row',
      gap: 30
    }
  });
  return (
    <View style={st.$warp}>
      <Avatar size={90} source={headerImage} />
      <Text style={st.$nickname}></Text>
      <View style={st.$sort}>
        <Text style={st.$public}></Text>
        <Text style={st.$public}></Text>
        <Text style={st.$public}></Text>
        <Text style={st.$public}></Text>
      </View>
    </View>
  );
};
//评论输入框
const CommitInput = () => {
  const st = StyleSheet.create({
    $warp: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 23
    },
    $input: {
      width: 311,
      height: 36,
      marginLeft: 12,
      backgroundColor: 'rgba(235,235,235,1)',
      borderRadius: 8
    }
  });
  return (
    <View style={st.$warp}>
      <Avatar size={36} source={headerImage} />
      <View style={st.$input}></View>
    </View>
  );
};
//评论列表
const CommitList = () => {
  const st = StyleSheet.create({
    $public: {
      height: 16,
      borderRadius: 3,
      backgroundColor: 'rgba(235,235,235,1)',
      marginBottom: 6
    },
    $wrap: {
      position: 'relative',
      marginTop: 24
    },
    $icon: {
      position: 'absolute',
      right: 0,
      top: 0
    }
  });
  return (
    <View style={st.$wrap}>
      <Icon icon="love" style={st.$icon} size={20}></Icon>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Avatar size={36} source={headerImage} />
        <View style={{ marginLeft: 13 }}>
          <Text style={[{ width: 116 }, st.$public]}></Text>
          <Text style={[{ width: 171 }, st.$public]}></Text>
          <Text style={[{ width: 71 }, st.$public]}></Text>
        </View>
      </View>
    </View>
  );
};
//作品内容
const ImageContent = () => {
  const { width } = useScreenSize();
  const height = useMemo(() => {
    return ((width || 1) * 936) / 704;
  }, [width]);

  const st = StyleSheet.create({
    $header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: 66,
      width: width
    },
    $headName: {
      width: 126,
      height: 22,
      borderRadius: 4,
      marginLeft: 12,
      backgroundColor: 'rgba(235,235,235,1)'
    },
    $photoContent: {
      display: 'flex',
      alignItems: 'center'
    },
    $takePhoto: {
      width: width,
      backgroundColor: 'rgba(235,235,235,1)',
      height: height
    },
    $pagination: {
      marginTop: 10
    },
    $title: {
      width: 343,
      height: 24,
      backgroundColor: 'rgba(235,235,235,1)',
      borderRadius: 4,
      marginTop: 6
    },
    $public: {
      height: 16,
      backgroundColor: 'rgba(235,235,235,1)',
      borderRadius: 3,
      marginTop: 16
    }
  });

  return (
    <View>
      <View style={st.$header}>
        <Icon
          icon="back"
          style={{ marginLeft: 12, marginRight: 10 }}
          size={24}
        ></Icon>
        <Avatar source={headerImage} size={36}></Avatar>
        <Text style={st.$headName}></Text>
      </View>
      <View style={st.$photoContent}>
        <View style={st.$takePhoto}></View>
        <Image style={st.$pagination} source={pagination}></Image>
      </View>
      <View style={{ padding: 16 }}>
        <Text style={st.$title}></Text>
        <Text
          style={{
            width: 300,
            ...st.$public
          }}
        ></Text>
        <Text
          style={{
            width: 220,
            marginBottom: 22,
            ...st.$public
          }}
        ></Text>
      </View>
    </View>
  );
};
