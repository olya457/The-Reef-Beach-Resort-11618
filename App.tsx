import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ResortProvider, useResort } from './src/store/ResortStore';
import { Onboarding, Splash } from './src/screens/Welcome';
import { MotionProvider } from './src/components/Motion';
import { Button } from './src/components/UI';
import { colors, styles } from './src/theme';
function Content() {
  const [splash, setSplash] = useState(true);
  const finish = useCallback(() => setSplash(false), []);
  const { state, ready, error, retry } = useResort();
  return (
    <View style={styles.page}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      {splash ? (
        <Splash onDone={finish} />
      ) : !ready ? (
        <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
          {error ? (
            <Text style={styles.muted}>{error}</Text>
          ) : (
            <ActivityIndicator color={colors.blue} />
          )}
        </View>
      ) : state.onboarded ? (
        <AppNavigator />
      ) : (
        <Onboarding />
      )}
      {ready && !!error && (
        <View style={styles.card}>
          <Text style={styles.muted}>{error}</Text>
          <Button title="Retry Save" onPress={retry} />
        </View>
      )}
    </View>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <MotionProvider>
        <ResortProvider>
          <Content />
        </ResortProvider>
      </MotionProvider>
    </SafeAreaProvider>
  );
}
