import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { onboarding } from '../data/catalog';
import { Button, Icon } from '../components/UI';
import { Reveal, useReducedMotion } from '../components/Motion';
import { useResponsive } from '../hooks/useResponsive';
import { colors, styles as s } from '../theme';
import { useResort } from '../store/ResortStore';
const spinner = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:transparent;overflow:hidden}body{display:flex;height:90px;align-items:center;justify-content:center}.s{width:48px;height:48px;border:6px dotted ${colors.accent};border-bottom-color:${colors.border};border-left-color:${colors.raised};border-radius:50%;animation:r 1s linear infinite}@keyframes r{to{transform:rotate(360deg)}}</style></head><body><div class="s"></div><script>setTimeout(function(){window.ReactNativeWebView.postMessage('finished')},4000)</script></body></html>`;
export function Splash({ onDone }: { onDone: () => void }) {
  const { height, width } = useWindowDimensions();
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = setTimeout(onDone, 4800);
    return () => clearTimeout(timer);
  }, [onDone]);
  return (
    <View style={s.page}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 24,
        }}
      >
        <Reveal delay={100}>
          <View
            style={{
              width: Math.min(220, width * 0.55),
              height: Math.min(220, width * 0.55),
              borderRadius: 110,
              backgroundColor: colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: height * 0.07,
            }}
          >
            <Icon name="sun" size={100} color={colors.accent} />
          </View>
        </Reveal>
        <Text
          style={[
            s.title,
            {
              fontSize: Math.min(40, width * 0.1),
              lineHeight: 48,
              letterSpacing: 0.5,
              textAlign: 'center',
              paddingHorizontal: 24,
            },
          ]}
        >
          Shore Day Planner
        </Text>
        <View
          style={{
            height: 1,
            width: 40,
            backgroundColor: colors.gold,
            marginVertical: height < 700 ? 16 : 26,
          }}
        />
        <Text style={[s.text, { fontSize: 11, letterSpacing: 2 }]}>
          YOUR DAY BY THE SHORE
        </Text>
        <View style={{ width: 100, height: 90, marginTop: 22 }}>
          <WebView
            source={{
              html: reduced
                ? spinner.replace(
                    'animation:r 1s linear infinite',
                    'animation:none',
                  )
                : spinner,
            }}
            originWhitelist={['about:blank']}
            scrollEnabled={false}
            style={{ backgroundColor: 'transparent' }}
            onMessage={e => {
              if (e.nativeEvent.data === 'finished') {
                onDone();
              }
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
export function Onboarding() {
  const [step, setStep] = useState(0);
  const { update } = useResort();
  const layout = useResponsive();
  const item = onboarding[step];
  const done = () => update(st => ({ ...st, onboarded: true }));
  return (
    <SafeAreaView style={s.page}>
      <ScrollView
        contentContainerStyle={[
          s.content,
          { flexGrow: 1, padding: layout.padding, gap: layout.gap },
        ]}
      >
        <View style={s.between}>
          <Text style={s.eyebrow}>{step + 1} / 4</Text>
          <Button title="Skip" onPress={done} secondary />
        </View>
        <Reveal key={step} style={{ gap: layout.gap }}>
          <Image
            source={item.image}
            style={{ width: '100%', height: layout.imageHeight }}
          />
          <View style={s.row}>
            {onboarding.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 32,
                  height: 3,
                  backgroundColor: i === step ? colors.accent : colors.border,
                }}
              />
            ))}
          </View>
          <Text
            style={[
              s.title,
              { fontSize: layout.titleSize, lineHeight: layout.titleSize + 8 },
            ]}
          >
            {item.title}
          </Text>
          <Text style={s.muted}>{item.description}</Text>
        </Reveal>
        <View style={{ flex: 1, minHeight: 16 }} />
        <View style={s.row}>
          {step > 0 && (
            <Button
              title="Back"
              secondary
              onPress={() => setStep(step - 1)}
              style={{ flex: 1 }}
            />
          )}
          <Button
            title={step === 3 ? 'Explore the Resort' : 'Next'}
            onPress={step === 3 ? done : () => setStep(step + 1)}
            style={{ flex: 2 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
