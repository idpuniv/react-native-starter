import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { CodeScanner } from 'react-native-vision-camera-barcode-scanner';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Loader } from '@/components/Loader';

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.65;
const CORNER_SIZE = 28;
const CORNER_W = 3;

interface Props {
  navigation: any;
}

export function QRCodeScannerScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState(false);

  // Animation couleur des coins
  const colorAnim = useRef(new Animated.Value(0)).current;
  // Animation ligne laser
  const laserAnim = useRef(new Animated.Value(0)).current;

  // Laser qui monte et descend en boucle
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(laserAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Flash vert quand détecté
  useEffect(() => {
    if (detected) {
      Animated.sequence([
        Animated.timing(colorAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
        Animated.timing(colorAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start();
    }
  }, [detected]);

  const cornerColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#22C55E'],
  });

  const laserY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 2],
  });

  const reset = () => {
    setScanned(false);
    setDetected(false);
  };

  const handleScan = (barcodes: any[]) => {
    const barcode = barcodes[0];
    console.log('Barcode complet:', JSON.stringify(barcode));
    const value = barcodes[0]?.rawValue;
    if (!value || scanned || loading) return;

    setScanned(true);
    setDetected(true);

    setTimeout(() => {
      Alert.alert(
        'QR Code détecté ✓',
        value,
        [{ text: 'Scanner à nouveau', onPress: reset }],
      );
    }, 300); // laisser le flash vert s'afficher
  };

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

      {/* Overlay sombre autour du cadre */}
      <View style={s.overlay}>
        {/* Haut */}
        <View style={[s.mask, { height: (Dimensions.get('window').height - FRAME_SIZE) / 2.8 }]} />

        {/* Milieu */}
        <View style={s.middle}>
          <View style={s.mask} />

          {/* Cadre de scan */}
          <View style={[s.frame]}>
            {/* Coins */}
            {[
              [s.cornerTL, s.borderTL],
              [s.cornerTR, s.borderTR],
              [s.cornerBL, s.borderBL],
              [s.cornerBR, s.borderBR],
            ].map(([pos, border], i) => (
              <Animated.View
                key={i}
                style={[
                  s.corner,
                  pos,
                  border,
                  { borderColor: cornerColor },
                ]}
              />
            ))}

            {/* Laser */}
            {!scanned && (
              <Animated.View
                style={[
                  s.laser,
                  { transform: [{ translateY: laserY }] },
                ]}
              />
            )}

            {/* Flash vert au scan */}
            {detected && (
              <Animated.View
                style={[
                  s.successOverlay,
                  { opacity: colorAnim },
                ]}
              />
            )}
          </View>

          <View style={s.mask} />
        </View>

        {/* Bas */}
        <View style={[s.mask, { flex: 1 }]} />
      </View>

      {/* Header */}
      <SafeAreaView style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <ArrowLeft size={22} color="white" />
        </TouchableOpacity>
        <Text style={s.title}>Scanner un QR code</Text>
        <Text style={s.hint}>Placez le QR code dans le cadre</Text>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { fontSize: 16 },
  link: { fontSize: 16, fontWeight: '600' },
  scannerContainer: { flex: 1, backgroundColor: 'black' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  mask: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },

  // Coins
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderWidth: CORNER_W,
  },
  cornerTL: { top: 0, left: 0 },
  cornerTR: { top: 0, right: 0 },
  cornerBL: { bottom: 0, left: 0 },
  cornerBR: { bottom: 0, right: 0 },

  borderTL: { borderRightWidth: 0, borderBottomWidth: 0 },
  borderTR: { borderLeftWidth: 0, borderBottomWidth: 0 },
  borderBL: { borderRightWidth: 0, borderTopWidth: 0 },
  borderBR: { borderLeftWidth: 0, borderTopWidth: 0 },

  // Laser
  laser: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: '#EF4444',
    opacity: 0.8,
    borderRadius: 1,
  },

  // Flash vert
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: { marginBottom: 12 },
  title: { color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 6 },
  hint: { color: 'white', fontSize: 14, opacity: 0.8 },
});