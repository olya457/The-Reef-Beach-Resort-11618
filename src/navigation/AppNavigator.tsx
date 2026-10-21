import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  BeachStackParams,
  DiningStackParams,
  EventsStackParams,
  TabsParams,
} from './types';
import {
  BookingScreen,
  ReservationConfirmedScreen,
  ReservationsScreen,
} from '../screens/Reservations';
import {
  CartScreen,
  MenuDetailScreen,
  MenuScreen,
  OrderConfirmedScreen,
  OrderHistoryScreen,
} from '../screens/Dining';
import { EventDetailScreen, EventsScreen } from '../screens/Events';
import { ChecklistScreen } from '../screens/Checklist';
import { ReceptionScreen } from '../screens/Reception';
import { WeatherScreen } from '../screens/Weather';
import { TabMotion, useReducedMotion } from '../components/Motion';
import { Icon } from '../components/UI';
import { colors } from '../theme';
const Beach = createNativeStackNavigator<BeachStackParams>();
const Dining = createNativeStackNavigator<DiningStackParams>();
const Events = createNativeStackNavigator<EventsStackParams>();
const Tabs = createBottomTabNavigator<TabsParams>();
const options = {
  headerShown: false,
  animation: 'fade_from_bottom' as const,
  contentStyle: { backgroundColor: colors.bg },
};
function BeachNavigator() {
  const reduced = useReducedMotion();
  return (
    <Beach.Navigator
      screenOptions={{
        ...options,
        animation: reduced ? 'none' : options.animation,
      }}
    >
      <Beach.Screen name="Reservations" component={ReservationsScreen} />
      <Beach.Screen name="Booking" component={BookingScreen} />
      <Beach.Screen
        name="ReservationConfirmed"
        component={ReservationConfirmedScreen}
      />
    </Beach.Navigator>
  );
}
function DiningNavigator() {
  const reduced = useReducedMotion();
  return (
    <Dining.Navigator
      screenOptions={{
        ...options,
        animation: reduced ? 'none' : options.animation,
      }}
    >
      <Dining.Screen name="Menu" component={MenuScreen} />
      <Dining.Screen name="MenuDetail" component={MenuDetailScreen} />
      <Dining.Screen name="Cart" component={CartScreen} />
      <Dining.Screen name="OrderConfirmed" component={OrderConfirmedScreen} />
      <Dining.Screen name="OrderHistory" component={OrderHistoryScreen} />
    </Dining.Navigator>
  );
}
function EventsNavigator() {
  const reduced = useReducedMotion();
  return (
    <Events.Navigator
      screenOptions={{
        ...options,
        animation: reduced ? 'none' : options.animation,
      }}
    >
      <Events.Screen name="Events" component={EventsScreen} />
      <Events.Screen name="EventDetail" component={EventDetailScreen} />
    </Events.Navigator>
  );
}
const icons: Record<keyof TabsParams, string> = {
  Beach: 'beach',
  Dining: 'food',
  EventsTab: 'events',
  Weather: 'weather',
  Reception: 'reception',
  Checklist: 'checklist',
};
export function AppNavigator() {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.bg,
          card: colors.bg,
          text: colors.text,
          border: colors.border,
          primary: colors.accent,
        },
      }}
    >
      <Tabs.Navigator
        safeAreaInsets={{ bottom: 0 }}
        screenOptions={({ route }) => ({
          headerShown: false,
          animation: reduced ? 'none' : 'fade',
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: 'absolute',
            bottom: insets.bottom + 20,
            start: 16,
            end: 16,
            height: 64,
            paddingTop: 8,
            paddingBottom: 8,
            paddingHorizontal: 4,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderTopWidth: 1,
            borderColor: colors.border,
            borderTopColor: colors.border,
            borderRadius: 22,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 6,
          },
          tabBarItemStyle: { borderRadius: 14 },
          tabBarIcon: ({ color, focused }) => (
            <TabMotion focused={focused}>
              <Icon
                name={icons[route.name]}
                color={focused ? colors.accent : color}
                size={24}
              />
            </TabMotion>
          ),
          tabBarAccessibilityLabel:
            route.name === 'EventsTab' ? 'Beach Events' : route.name,
        })}
      >
        <Tabs.Screen name="Beach" component={BeachNavigator} />
        <Tabs.Screen name="Dining" component={DiningNavigator} />
        <Tabs.Screen name="EventsTab" component={EventsNavigator} />
        <Tabs.Screen name="Weather" component={WeatherScreen} />
        <Tabs.Screen name="Reception" component={ReceptionScreen} />
        <Tabs.Screen name="Checklist" component={ChecklistScreen} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
