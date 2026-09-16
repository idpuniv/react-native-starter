import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Card } from '@/components/Card';
import { Loader } from '@/components/Loader';
import { useUsers } from '@/hooks/useUsers';

export function UsersScreen() {
  const { theme }                        = useTheme();
  const { data: users, isLoading,
          isRefetching, error, refetch } = useUsers();

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
      <View style={s.container}>
        <View style={s.header}>
          <Text style={[s.title, { color: theme.text.primary }]}>Utilisateurs</Text>
          {isRefetching && (
            <Text style={[s.refetching, { color: theme.text.secondary }]}>
              Mise à jour...
            </Text>
          )}
        </View>

        <Text style={[s.subtitle, { color: theme.text.secondary }]}>
          {users?.length ?? 0} utilisateur{(users?.length ?? 0) > 1 ? 's' : ''} enregistré{(users?.length ?? 0) > 1 ? 's' : ''}
        </Text>

        {isLoading ? (
          <View style={s.center}>
            <Loader size="large" />
          </View>
        ) : error ? (
          <View style={s.center}>
            <Text style={[s.error, { color: theme.error }]}>
              Impossible de charger les utilisateurs
            </Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text style={[s.retry, { color: theme.primary }]}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : users?.length === 0 ? (
          <View style={s.center}>
            <Text style={[s.empty, { color: theme.text.secondary }]}>
              Aucun utilisateur pour l'instant
            </Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={s.list}
            onRefresh={refetch}
            refreshing={isRefetching}
            renderItem={({ item }) => (
              <Card elevated style={s.card}>
                <View style={s.row}>
                  <View style={[s.avatar, { backgroundColor: theme.primaryLight }]}>
                    <Text style={[s.avatarText, { color: theme.primary }]}>
                      {item.prenom[0]}{item.nom[0]}
                    </Text>
                  </View>
                  <View style={s.info}>
                    <Text style={[s.name, { color: theme.text.primary }]}>
                      {item.prenom} {item.nom}
                    </Text>
                    <Text style={[s.email, { color: theme.text.secondary }]}>
                      {item.email}
                    </Text>
                    <Text style={[s.detail, { color: theme.text.secondary }]}>
                      {item.telephone} · {item.dateNaissance}
                    </Text>
                  </View>
                </View>
              </Card>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1 },
  container:  { flex: 1, padding: 20 },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title:      { fontSize: 26, fontWeight: '700' },
  refetching: { fontSize: 12 },
  subtitle:   { fontSize: 14, marginBottom: 20 },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  error:      { fontSize: 15, textAlign: 'center' },
  retry:      { fontSize: 15, fontWeight: '600' },
  empty:      { fontSize: 15 },
  list:       { paddingBottom: 20 },
  card:       { marginBottom: 12 },
  row:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar:     { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700' },
  info:       { flex: 1 },
  name:       { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  email:      { fontSize: 13, marginBottom: 2 },
  detail:     { fontSize: 12 },
});