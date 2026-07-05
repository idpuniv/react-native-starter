import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeaturesScreen } from '@/screens/features/FeaturesScreen';
import { RegisterScreen } from '@/screens/features/RegisterScreen';
import { QRCodeScannerScreen } from '@/screens/features/QRCodeScannerScreen';
import { QRCodeGeneratorScreen } from '@/screens/features/QRCodeGeneratorScreen';

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
      <Stack.Screen name="QRCode" component={QRCodeScannerScreen} />
      <Stack.Screen name="QRCodeGenerator" component={QRCodeGeneratorScreen} />
      {/* Ajouter les prochains écrans ici */}
    </Stack.Navigator>
  );
}
