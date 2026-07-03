import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Settings } from 'lucide-react-native';
import { MainTabParamList, MAIN_ROUTES } from './routes';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { useTheme } from '@/hooks/useTheme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName={MAIN_ROUTES.DASHBOARD}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   theme.primary,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor:  theme.border,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case MAIN_ROUTES.DASHBOARD:
              return <LayoutDashboard color={color} size={size} />;
            case MAIN_ROUTES.SETTINGS:
              return <Settings color={color} size={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name={MAIN_ROUTES.DASHBOARD}
        component={DashboardScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen
        name={MAIN_ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{ tabBarLabel: 'Réglages' }}
      />
    </Tab.Navigator>
  );
}