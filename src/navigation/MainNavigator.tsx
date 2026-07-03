import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Layers, Settings } from 'lucide-react-native';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { FeaturesNavigator } from './FeaturesNavigator';
import { useTheme } from '@/hooks/useTheme';

export type MainTabParamList = {
  Dashboard: undefined;
  Features:  undefined;
  Settings:  undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown:            false,
        tabBarActiveTintColor:   theme.primary,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor:  theme.border,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Dashboard':
              return <LayoutDashboard color={color} size={size} />;
            case 'Features':
              return <Layers color={color} size={size} />;
            case 'Settings':
              return <Settings color={color} size={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen
        name="Features"
        component={FeaturesNavigator}
        options={{ tabBarLabel: 'Features' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Réglages' }}
      />
    </Tab.Navigator>
  );
}
