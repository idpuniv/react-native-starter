import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import api from '@/services/api';

interface User {
  id:     string | number;
  nom:    string;
  prenom: string;
  email:  string;
}

interface Props { navigation: any; }

export function QRCodeGeneratorScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/users/1');
      setUser(response.data);
    } catch {
      setError('Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  return (
    <View style={[s.root, { backgroundColor: theme.primary }]}>
      {/* Header */}
      <SafeAreaView>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.iconBtn}>
            <ArrowLeft size={22} color="white" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Mon QR Code</Text>
          <TouchableOpacity onPress={fetchUser} style={s.iconBtn}>
            <RefreshCw size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Nom utilisateur */}
        {user && (
          <View style={s.userInfo}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {user.prenom[0]}{user.nom[0]}
              </Text>
            </View>
            <Text style={s.userName}>{user.prenom} {user.nom}</Text>
            <Text style={s.userEmail}>{user.email}</Text>
          </View>
        )}
      </SafeAreaView>

      {/* Carte QR Code */}
      <View style={s.card}>
        {loading ? (
          <View style={s.loaderBox}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[s.loadingText, { color: theme.text.secondary }]}>
              Chargement...
            </Text>
          </View>
        ) : error ? (
          <View style={s.loaderBox}>
            <Text style={[s.errorText, { color: theme.error }]}>{error}</Text>
            <TouchableOpacity
              style={[s.retryBtn, { backgroundColor: theme.primary }]}
              onPress={fetchUser}
            >
              <Text style={s.retryBtnText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : user ? (
          <>
            <Text style={[s.cardLabel, { color: theme.text.secondary }]}>
              Scanner pour me trouver
            </Text>

            <View style={[s.qrWrapper, { borderColor: theme.border }]}>
              <QRCode
                value={String(user.id)}
                size={200}
                color="#000000"
                backgroundColor="white"
              />
            </View>

            <Text style={[s.cardHint, { color: theme.text.secondary }]}>
              Montrez ce QR code à un autre utilisateur
            </Text>

            <View style={[s.idBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[s.idBadgeText, { color: theme.primary }]}>
                ID : {user.id}
              </Text>
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1 },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop:        12,
    paddingBottom:     8,
  },
  iconBtn:      { width: 36, height: 36, justifyContent: 'center' },
  headerTitle:  { fontSize: 18, fontWeight: '700', color: 'white' },
  userInfo:     { alignItems: 'center', paddingBottom: 28, gap: 6 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText:   { fontSize: 24, fontWeight: '700', color: 'white' },
  userName:     { fontSize: 20, fontWeight: '700', color: 'white' },
  userEmail:    { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  card: {
    flex:               1,
    backgroundColor:    'white',
    borderTopLeftRadius:  32,
    borderTopRightRadius: 32,
    alignItems:           'center',
    justifyContent:       'center',
    padding:              32,
    gap:                  20,
  },
  loaderBox:    { alignItems: 'center', gap: 16 },
  loadingText:  { fontSize: 14 },
  errorText:    { fontSize: 15, textAlign: 'center' },
  retryBtn:     { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  retryBtnText: { color: 'white', fontWeight: '600' },
  cardLabel:    { fontSize: 14, fontWeight: '500' },
  qrWrapper: {
    padding:      16,
    borderRadius: 16,
    borderWidth:  1,
    backgroundColor: 'white',
    shadowColor:  '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius:  12,
    elevation:     4,
  },
  cardHint:     { fontSize: 13, textAlign: 'center' },
  idBadge: {
    paddingVertical:   6,
    paddingHorizontal: 16,
    borderRadius:      20,
  },
  idBadgeText:  { fontSize: 13, fontWeight: '600' },
});