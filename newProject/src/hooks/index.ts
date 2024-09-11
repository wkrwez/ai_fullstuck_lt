import {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { Keyboard } from 'react-native';

export * from './useRotateUpdateMethod';
export * from './useSafeAreaInsetsStyle';
export * from './useScreenSize';
export * from './useTimeout';
export * from './useAuthState';

// 临时写后期抽离

export const useKeyboard = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sub1 = Keyboard.addListener('keyboardDidShow', () => {
      setShow(true);
    });
    const sub2 = Keyboard.addListener('keyboardDidHide', () => {
      setShow(false);
    });
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  return show;
};

/**
 * 使用此方法可不用写 deps
 * 减少函数包装对 deps 的心智,并且避免deps变化导致的reRender
 * @param fn 需要使用 useCallback 包装的函数
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function usePersist<T extends Function>(
  callback: T,
  deps: DependencyList = []
): T {
  const fnRef = useRef<T>(callback);
  fnRef.current = callback;
  return useCallback(
    (...args: any[]) => fnRef.current?.(...args),
    deps
  ) as unknown as T;
}

export const usePersistFn = usePersist;
