import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { CodeScanner } from 'react-native-vision-camera-barcode-scanner';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Loader } from '@/components/Loader';
import { Card } from '@/components/Card';
import qrcodeService, { User } from '@/services/qrcode.service';

interface Props {
  navigation: any;
}

export function QRCodeScannerScreen({ navigation }: Props) {
  const { theme }                            = useTheme();
  const isFocused                            = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device                               = useCameraDevice('back');

  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser]       = useState<User | null>(null);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  const handleScan = async (barcodes: any[]) => {
  const value = barcodes[0]?.rawValue;
  if (!value || scanned || loading) return;

  setScanned(true);
  setLoading(false); // pas d'appel API — pas de spinner

  Alert.alert(
    'QR Code détecté',
    value,
    [{ text: 'Scanner à nouveau', onPress: reset }],
  );
};

  const reset = () => { setScanned(false); setUser(null); };

  // ── Profil ────────────────────────────────────────────────────────────────
  if (user) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
        <View style={s.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <ArrowLeft size={22} color={theme.text.primary} />
          </TouchableOpacity>
          <View style={[s.avatar, { backgroundColor: theme.primaryLight }]}>
            <Text style={[s.avatarText, { color: theme.primary }]}>
              {user.prenom[0]}{user.nom[0]}
            </Text>
          </View>
          <Text style={[s.name, { color: theme.text.primary }]}>
            {user.prenom} {user.nom}
          </Text>
          <Card elevated style={s.card}>
            <Row label="Email"     value={user.email}         theme={theme} />
            <View style={[s.sep, { backgroundColor: theme.border }]} />
            <Row label="Téléphone" value={user.telephone}     theme={theme} />
            <View style={[s.sep, { backgroundColor: theme.border }]} />
            <Row label="Naissance" value={user.dateNaissance} theme={theme} />
          </Card>
          <TouchableOpacity style={[s.btn, { backgroundColor: theme.primary }]} onPress={reset}>
            <Text style={[s.btnText, { color: theme.text.inverse }]}>
              Scanner à nouveau
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Permission refusée ────────────────────────────────────────────────────
  if (!hasPermission) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
        <View style={s.center}>
          <Text style={[s.errorText, { color: theme.text.primary }]}>
            Permission caméra requise
          </Text>
          <TouchableOpacity onPress={requestPermission}>
            <Text style={[s.link, { color: theme.primary }]}>Autoriser</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Caméra non disponible ─────────────────────────────────────────────────
  if (!device) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
        <View style={s.center}>
          <Loader size="large" />
          <Text style={[s.errorText, { color: theme.text.secondary }]}>
            Initialisation de la caméra...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Scanner ───────────────────────────────────────────────────────────────
  return (
    <View style={s.scannerContainer}>
      <CodeScanner
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && !scanned}
        barcodeFormats={['qr-code']}
        onBarcodeScanned={handleScan}
        onError={(e) => console.error('Scanner error:', e)}
      />

      <SafeAreaView style={s.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.overlayBack}>
          <ArrowLeft size={22} color="white" />
        </TouchableOpacity>
        <Text style={s.overlayTitle}>Scanner un QR code</Text>
        <Text style={s.overlayHint}>Placez le QR code dans le cadre</Text>
        {loading && (
          <View style={s.loaderWrap}>
            <Loader size="large" />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

function Row({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <View style={s.row}>
      <Text style={[s.rowLabel, { color: theme.text.secondary }]}>{label}</Text>
      <Text style={[s.rowValue, { color: theme.text.primary }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1 },
  container:        { flex: 1, alignItems: 'center', padding: 24 },
  center:           { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  backBtn:          { alignSelf: 'flex-start', marginBottom: 32 },
  avatar:           { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText:       { fontSize: 28, fontWeight: '700' },
  name:             { fontSize: 22, fontWeight: '700', marginBottom: 24 },
  card:             { width: '100%', marginBottom: 24 },
  row:              { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  rowLabel:         { fontSize: 14 },
  rowValue:         { fontSize: 14, fontWeight: '500' },
  sep:              { height: 1 },
  btn:              { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  btnText:          { fontSize: 16, fontWeight: '600' },
  errorText:        { fontSize: 16 },
  link:             { fontSize: 16, fontWeight: '600' },
  scannerContainer: { flex: 1, backgroundColor: 'black' },
  overlay:          { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 10 },
  overlayBack:      { marginBottom: 12 },
  overlayTitle:     { color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  overlayHint:      { color: 'white', fontSize: 14, opacity: 0.8 },
  loaderWrap:       { marginTop: 40, alignItems: 'center' },
});