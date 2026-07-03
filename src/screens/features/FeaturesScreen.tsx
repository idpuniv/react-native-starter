import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { ChevronRight } from 'lucide-react-native';

interface Feature {
  id:          string;
  title:       string;
  description: string;
  screen:      string;
}

const FEATURES: Feature[] = [
  {
    id:          'register',
    title:       'Formulaire d\'inscription',
    description: 'Nom, prénom, téléphone, email, mot de passe, date de naissance',
    screen:      'Register',
  },
  {
    id:          'qrcode',
    title:       'QR Code',
    description: 'Génération et scan de QR codes',
    screen:      'QRCode',
  },
  // Ajouter les prochaines features ici
];

interface FeaturesScreenProps {
  navigation: any;
}

export function FeaturesScreen({ navigation }: FeaturesScreenProps) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={[s.title, { color: theme.text.primary }]}>Features</Text>
        <Text style={[s.subtitle, { color: theme.text.secondary }]}>
          Composants et fonctionnalités disponibles
        </Text>

        {FEATURES.map((feature, index) => (
          <TouchableOpacity
            key={feature.id}
            style={[
              s.card,
              {
                backgroundColor: theme.surface,
                borderColor:     theme.border,
              },
              index === 0 && s.cardFirst,
            ]}
            onPress={() => navigation.navigate(feature.screen)}
            activeOpacity={0.7}
          >
            <View style={s.cardContent}>
              <View style={s.cardLeft}>
                <Text style={[s.cardTitle, { color: theme.text.primary }]}>
                  {feature.title}
                </Text>
                <Text style={[s.cardDesc, { color: theme.text.secondary }]}>
                  {feature.description}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.text.disabled} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1 },
  scroll:      { padding: 20 },
  title:       { fontSize: 26, fontWeight: '700', marginBottom: 6 },
  subtitle:    { fontSize: 14, marginBottom: 24 },
  card: {
    borderRadius:  12,
    borderWidth:   1,
    marginBottom:  12,
    overflow:      'hidden',
  },
  cardFirst:   {},
  cardContent: {
    flexDirection:  'row',
    alignItems:     'center',
    padding:        16,
    gap:            12,
  },
  cardLeft:    { flex: 1 },
  cardTitle:   { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  cardDesc:    { fontSize: 13 },
});
