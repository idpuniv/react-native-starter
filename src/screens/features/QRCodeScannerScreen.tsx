import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useBarcodeScannerOutput } from 'react-native-vision-camera-barcode-scanner';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSequence,
} from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Loader } from '@/components/Loader';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const FRAME_SIZE  = SCREEN_W * 0.65;
const CORNER_SIZE = 24;
const CORNER_W    = 3;
const MASK_V      = (SCREEN_H - FRAME_SIZE) / 2.5;

interface Props {
  navigation: any;
}

export function QRCodeScannerScreen({ navigation }: Props) {
  const { theme }                            = useTheme();
  const isFocused                            = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device                               = useCameraDevice('back');

  const [scanned, setScanned] = useState(false);

  const boxLeft    = useSharedValue(0);
  const boxTop     = useSharedValue(0);
  const boxRight   = useSharedValue(0);
  const boxBottom  = useSharedValue(0);
  const boxOpacity = useSharedValue(0);
  const boxColor   = useSharedValue('white');

  const animatedBox = useAnimatedStyle(() => ({
    position:    'absolute',
    left:         boxLeft.value,
    top:          boxTop.value,
    width:        boxRight.value - boxLeft.value,
    height:       boxBottom.value - boxTop.value,
    borderWidth:  2,
    borderColor:  boxColor.value,
    borderRadius: 4,
    opacity:      boxOpacity.value,
  }));

  const reset = useCallback(() => {
    setScanned(false);
    boxOpacity.value = withTiming(0, { duration: 200 });
  }, []);

  const scannerOutput = useBarcodeScannerOutput({
    barcodeFormats: ['qr-code'],
    onBarcodeScanned: useCallback((barcodes) => {
      if (scanned || barcodes.length === 0) return;

      const barcode = barcodes[0];
      const value   = barcode.rawValue;
      const bb      = barcode.boundingBox;

      if (!value || !bb) return;

      const left   = bb.left   * SCREEN_W;
      const top    = bb.top    * SCREEN_H;
      const right  = bb.right  * SCREEN_W;
      const bottom = bb.bottom * SCREEN_H;

      boxLeft.value    = withTiming(left,   { duration: 80 });
      boxTop.value     = withTiming(top,    { duration: 80 });
      boxRight.value   = withTiming(right,  { duration: 80 });
      boxBottom.value  = withTiming(bottom, { duration: 80 });
      boxOpacity.value = withTiming(1, { duration: 100 });
      boxColor.value   = withSequence(
        withTiming('#22C55E', { duration: 150 }),
        withTiming('#22C55E', { duration: 400 }),
      );

      setScanned(true);

      setTimeout(() => {
        Alert.alert(
          'QR Code détecté ✓',
          value,
          [{ text: 'Scanner à nouveau', onPress: reset }],
        );
      }, 400);
    }, [scanned, reset]),
    onError: (e) => console.error('Scanner error:', e),
  });

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
            Initialisation caméra...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Scanner ───────────────────────────────────────────────────────────────
  return (
    <View style={s.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && !scanned}
        outputs={[scannerOutput]}
      />

      {/* Masques sombres */}
      <View style={s.maskTop} />
      <View style={s.maskMiddle}>
        <View style={s.maskSide} />
        <View style={s.frame}>
          <View style={[s.corner, s.cornerTL, s.borderTL]} />
          <View style={[s.corner, s.cornerTR, s.borderTR]} />
          <View style={[s.corner, s.cornerBL, s.borderBL]} />
          <View style={[s.corner, s.cornerBR, s.borderBR]} />
        </View>
        <View style={s.maskSide} />
      </View>
      <View style={s.maskBottom} />

      {/* Bounding box animée */}
      <Animated.View style={animatedBox} />

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
  safe:      { flex: 1 },
  container: { flex: 1, backgroundColor: 'black' },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { fontSize: 16 },
  link:      { fontSize: 16, fontWeight: '600' },

  maskTop:    { height: MASK_V, backgroundColor: 'rgba(0,0,0,0.6)' },
  maskMiddle: { flexDirection: 'row', height: FRAME_SIZE },
  maskSide:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  maskBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },

  frame:    { width: FRAME_SIZE, height: FRAME_SIZE },
  corner:   { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE, borderColor: 'white', borderWidth: CORNER_W },
  cornerTL: { top: 0,    left: 0  },
  cornerTR: { top: 0,    right: 0 },
  cornerBL: { bottom: 0, left: 0  },
  cornerBR: { bottom: 0, right: 0 },
  borderTL: { borderRightWidth: 0, borderBottomWidth: 0 },
  borderTR: { borderLeftWidth: 0,  borderBottomWidth: 0 },
  borderBL: { borderRightWidth: 0, borderTopWidth: 0    },
  borderBR: { borderLeftWidth: 0,  borderTopWidth: 0    },

  header:  { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { marginBottom: 12 },
  title:   { color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 6 },
  hint:    { color: 'white', fontSize: 14, opacity: 0.8 },
});