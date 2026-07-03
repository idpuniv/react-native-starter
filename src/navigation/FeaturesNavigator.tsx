import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeaturesScreen } from '@/screens/features/FeaturesScreen';
import { RegisterScreen } from '@/screens/features/RegisterScreen';

export type FeaturesStackParamList = {
  FeaturesList: undefined;
  Register:     undefined;
  QRCode:       undefined;
  // Ajouter les prochaines features ici
};

const Stack = createNativeStackNavigator<FeaturesStackParamList>();

export function FeaturesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeaturesList" component={FeaturesScreen} />
      <Stack.Screen name="Register"     component={RegisterScreen} />
      {/* Ajouter les prochains écrans ici */}
    </Stack.Navigator>
  );
}
