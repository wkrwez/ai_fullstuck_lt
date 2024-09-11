import { StackNavigationOptions } from '@react-navigation/stack';

export const RA_SearchIndexOption: StackNavigationOptions = {
  gestureEnabled: true,
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        speed: Math.pow(10, 10)
      }
    },
    close: {
      animation: 'timing',
      config: { duration: 0 }
    }
  },
  cardStyleInterpolator: ({ current, layouts, next }) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0],
      extrapolate: 'clamp'
    });
    const opacity = next?.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });
    return {
      cardStyle: {
        opacity: next ? opacity : 1,
        transform: [
          {
            translateX: !next ? translateX : 0
          }
        ]
      }
    };
  }
};

export const RA_SearchEaseOption: StackNavigationOptions = {
  gestureEnabled: true,
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        speed: Math.pow(10, 10)
      }
    },
    close: {
      // animation: 'timing',
      // config: { duration: 0 }
      animation: 'spring',
      config: {
        speed: Math.pow(10, 10)
      }
    }
  },
  cardStyleInterpolator: ({ current, layouts, next }) => {
    const opacity = next?.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0],
      extrapolate: 'clamp'
    });
    return {
      cardStyle: {
        opacity: next ? opacity : 1,
        transform: [
          {
            translateX: !next ? translateX : 0
          }
        ]
      }
    };
  }
};
