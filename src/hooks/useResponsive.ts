import { useWindowDimensions } from 'react-native';
export function useResponsive() {
  const { width, height, fontScale } = useWindowDimensions();
  const compact = width < 375;
  const stacked = width < 350 || fontScale > 1.25;
  return {
    width,
    height,
    fontScale,
    compact,
    stacked,
    padding: compact ? 16 : 24,
    gap: compact ? 14 : 18,
    titleSize: compact ? 28 : 32,
    imageHeight: Math.min(380, height * (height < 700 ? 0.35 : 0.45)),
  };
}
