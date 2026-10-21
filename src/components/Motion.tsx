import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme';
const MotionContext = createContext(false);
export function MotionProvider({ children }: React.PropsWithChildren) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (active) {
          setReduced(value);
        }
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return (
    <MotionContext.Provider value={reduced}>{children}</MotionContext.Provider>
  );
}
export const useReducedMotion = () => useContext(MotionContext);
export function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  useEffect(() => {
    progress.setValue(reduced ? 1 : 0);
    if (reduced) {
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 480,
      delay: Math.min(delay, 180),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, reduced]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
export function TabMotion({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;
  useEffect(() => {
    const animation = Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      damping: 16,
      stiffness: 190,
      mass: 0.7,
      useNativeDriver: true,
    });
    if (reduced) {
      progress.setValue(focused ? 1 : 0);
    } else {
      animation.start();
    }
    return () => animation.stop();
  }, [focused, progress, reduced]);
  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -2],
            }),
          },
          {
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.08],
            }),
          },
        ],
      }}
    >
      {children}
      <Animated.View
        style={[
          motionStyles.tabLine,
          { opacity: progress, transform: [{ scaleX: progress }] },
        ]}
      />
    </Animated.View>
  );
}
export function ProgressBar({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(value)).current;
  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: Math.max(0, Math.min(1, value)),
      duration: reduced ? 0 : 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, value, reduced]);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={motionStyles.track}
    >
      <Animated.View
        style={[
          motionStyles.fill,
          {
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}
const motionStyles = StyleSheet.create({
  tabLine: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  track: {
    height: 6,
    backgroundColor: colors.border,
    marginTop: 5,
    overflow: 'hidden',
    borderRadius: 3,
  },
  fill: { height: 6, backgroundColor: colors.green, borderRadius: 3 },
});
