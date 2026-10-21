import React, { Children, useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, styles as s } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import { Reveal, useReducedMotion } from './Motion';
export function Screen({ children }: React.PropsWithChildren) {
  const layout = useResponsive();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={s.page} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={s.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[
            s.content,
            {
              padding: layout.padding,
              gap: layout.gap,
              paddingBottom: insets.bottom + 20 + 64 + 24,
            },
          ]}
        >
          {Children.toArray(children).map((child, index) => (
            <Reveal
              key={React.isValidElement(child) ? child.key ?? index : index}
              delay={index * 35}
              style={{ gap: layout.gap }}
            >
              {child}
            </Reveal>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function ResortImage({
  source,
  aspectRatio = 1.65,
}: {
  source: ImageSourcePropType;
  aspectRatio?: number;
}) {
  return (
    <View
      style={{
        width: '100%',
        alignSelf: 'stretch',
        aspectRatio,
        overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      <Image
        source={source}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
      />
    </View>
  );
}
export function Heading({ title, kicker }: { title: string; kicker?: string }) {
  const layout = useResponsive();
  return (
    <View style={{ gap: 7, flexShrink: 1, minWidth: 0 }}>
      {kicker && <Text style={s.eyebrow}>{kicker}</Text>}
      <Text
        accessibilityRole="header"
        style={[
          s.title,
          { fontSize: layout.titleSize, lineHeight: layout.titleSize + 8 },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}
export function Button({
  title,
  onPress,
  disabled = false,
  secondary = false,
  style,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  style?: ViewStyle;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const animate = (toValue: number) => {
    if (!reduced) {
      Animated.spring(scale, {
        toValue,
        useNativeDriver: true,
        stiffness: 280,
        damping: 20,
        mass: 0.5,
      }).start();
    }
  };
  return (
    <Animated.View
      style={[
        { opacity: disabled ? 0.4 : 1, minWidth: 0, transform: [{ scale }] },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animate(0.97)}
        onPressOut={() => animate(1)}
        style={[
          buttonStyles.surface,
          { borderColor: secondary ? colors.border : colors.accent },
        ]}
      >
        <LinearGradient
          pointerEvents="none"
          accessible={false}
          colors={
            secondary
              ? [colors.card, colors.bg]
              : [colors.primary, colors.primaryEnd]
          }
          style={StyleSheet.absoluteFill}
        />
        <Text
          style={[
            s.text,
            buttonStyles.label,
            { color: secondary ? colors.text : colors.onPrimary },
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
const buttonStyles = StyleSheet.create({
  surface: {
    minHeight: 48,
    minWidth: 48,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  label: {
    textAlign: 'center',
    flexShrink: 0,
  },
});
export function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[s.input, props.style]}
    />
  );
}
export function Back({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={s.back}>
      <Text style={s.text}>‹ Back</Text>
    </Pressable>
  );
}
export function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={[s.between, s.line]}>
      <Text style={[s.muted, { flex: 1 }]}>{label}</Text>
      <Text style={[s.text, { flex: 1, textAlign: 'right' }]}>{value}</Text>
    </View>
  );
}
const paths: Record<string, string> = {
  beach: 'M3 4l5 12h13v4H6l-3-4m5 0v4m-5 0h18',
  food: 'M5 3v7m3-7v7m-6-7v7q3 4 6 0M5 13v9M17 3q-5 5 0 10v9m0-19v10',
  events: 'M4 6h16v15H4zM8 3v6m8-6v6M4 11h16',
  weather:
    'M8 4V1M3 6L1 4m12 2 2-2M7 16a5 5 0 1 1 7-7m-3 12h9a4 4 0 0 0 0-8 6 6 0 0 0-11 2 3 3 0 0 0 2 6',
  reception: 'M3 4h18v13H10l-6 5v-5H3z',
  checklist: 'M3 5l2 2 3-4m3 2h10M3 12l2 2 3-4m3 2h10M3 19l2 2 3-4m3 2h10',
  cart: 'M2 3h3l3 12h11l3-9H6M9 20h1m7 0h1',
  trash: 'M4 6h16M9 3h6M6 6l1 15h10l1-15M10 10v7m4-7v7',
  sun: 'M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2',
};
export function Icon({
  name,
  color = colors.text,
  size = 24,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d={paths[name] || paths.sun} />
      {name === 'sun' && <Circle cx={12} cy={12} r={5} />}
    </Svg>
  );
}
