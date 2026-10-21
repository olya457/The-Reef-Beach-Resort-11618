const { jest } = require('@jest/globals');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-webview', () => ({ WebView: 'WebView' }));
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('./src/navigation/AppNavigator', () => ({
  AppNavigator: () => null,
}));
