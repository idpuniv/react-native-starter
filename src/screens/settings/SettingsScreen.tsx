import React from 'react';
import { View, Text, StyleSheet, Switch} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Card } from '@/components/Card';

export function SettingsScreen() {
  const { theme, isDark, mode, setMode } = useTheme();
  const { user } = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  };
  const handleThemeToggle = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text.primary }]}>
          Réglages
        </Text>

        {/* Profil */}
        <Card elevated style={styles.card}>
          <Text style={[styles.sectionLabel, { color: theme.text.secondary }]}>
            COMPTE
          </Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text.primary }]}>Nom</Text>
            <Text style={[styles.rowValue, { color: theme.text.secondary }]}>
              {user?.name}
            </Text>
          </View>
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text.primary }]}>Email</Text>
            <Text style={[styles.rowValue, { color: theme.text.secondary }]}>
              {user?.email}
            </Text>
          </View>
        </Card>

        {/* Apparence */}
        <Card elevated style={styles.card}>
          <Text style={[styles.sectionLabel, { color: theme.text.secondary }]}>
            APPARENCE
          </Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text.primary }]}>
              Thème sombre
            </Text>
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.border, true: theme.primaryLight }}
              thumbColor={isDark ? theme.primary : theme.text.disabled}
            />
          </View>
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.text.primary }]}>
              Suivre le système
            </Text>
            <Switch
              value={mode === 'system'}
              onValueChange={v => setMode(v ? 'system' : (isDark ? 'dark' : 'light'))}
              trackColor={{ false: theme.border, true: theme.primaryLight }}
              thumbColor={mode === 'system' ? theme.primary : theme.text.disabled}
            />
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1 },
  container:     { flex: 1, padding: 20 },
  title:         { fontSize: 26, fontWeight: '700', marginBottom: 24 },
  card:          { marginBottom: 16 },
  sectionLabel:  { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginBottom: 12 },
  row:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel:      { fontSize: 15 },
  rowValue:      { fontSize: 14 },
  separator:     { height: 1, marginVertical: 10 },
});
