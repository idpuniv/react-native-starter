import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Card } from '@/components/Card';

export function DashboardScreen() {
  const { theme } = useTheme();

  const { user } = {};
  const stats = [
    { label: 'Projets',      value: '12' },
    { label: 'Complétés',   value: '8'  },
    { label: 'En cours',    value: '4'  },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text.secondary }]}>
            Bonjour,
          </Text>
          <Text style={[styles.name, { color: theme.text.primary }]}>
            {user?.name ?? 'Utilisateur'} 👋
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map(stat => (
            <Card key={stat.label} elevated style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
                {stat.label}
              </Text>
            </Card>
          ))}
        </View>

        {/* Recent activity */}
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          Activité récente
        </Text>

        {[1, 2, 3].map(i => (
          <Card key={i} style={styles.activityCard}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={styles.activityText}>
              <Text style={[styles.activityTitle, { color: theme.text.primary }]}>
                Tâche #{i} complétée
              </Text>
              <Text style={[styles.activityDate, { color: theme.text.secondary }]}>
                Il y a {i}h
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1 },
  scroll:        { padding: 20, paddingBottom: 40 },
  header:        { marginBottom: 28 },
  greeting:      { fontSize: 16 },
  name:          { fontSize: 26, fontWeight: '700', marginTop: 2 },
  statsRow:      { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard:      { flex: 1, alignItems: 'center', paddingVertical: 20 },
  statValue:     { fontSize: 26, fontWeight: '700' },
  statLabel:     { fontSize: 12, marginTop: 4 },
  sectionTitle:  { fontSize: 17, fontWeight: '600', marginBottom: 12 },
  activityCard:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  dot:           { width: 8, height: 8, borderRadius: 4 },
  activityText:  { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '500' },
  activityDate:  { fontSize: 12, marginTop: 2 },
});
