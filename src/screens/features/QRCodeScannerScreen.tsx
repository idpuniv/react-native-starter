import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import {
  Camera, useCameraDevice, useCameraPermission,
  useFrameOutput,
} from 'react-native-vision-camera';
import { useBarcodeScanner } from 'react-native-vision-camera-barcode-scanner';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Loader } from '@/components/Loader';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const FRAME_SIZE  = SCREEN_W * 0.65;
const CORNER_SIZE = 28;
const CORNER_W    = 3;
const MASK_V      = (SCREEN_H - FRAME_SIZE) / 2.5;

const INITIAL = {
  left:   (SCREEN_W - FRAME_SIZE) / 2,
  top:    MASK_V,
  right:  (SCREEN_W + FRAME_SIZE) / 2,
  bottom: MASK_V + FRAME_SIZE,
};
const ANIM_CONFIG = { duration: 120 };

interface Props { navigation: any; }

function AnimatedCorner({ x, y, type, color }: {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  type: 'TL' | 'TR' | 'BL' | 'BR';
  color: Animated.SharedValue<string>;
}) {
  const style = useAnimatedStyle(() => {
    const base: any = {
      position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE,
      borderColor: color.value, borderWidth: CORNER_W,
    };
    switch (type) {
      case 'TL': return { ...base, left: x.value,               top: y.value,               borderRightWidth: 0, borderBottomWidth: 0 };
      case 'TR': return { ...base, left: x.value - CORNER_SIZE, top: y.value,               borderLeftWidth: 0,  borderBottomWidth: 0 };
      case 'BL': return { ...base, left: x.value,               top: y.value - CORNER_SIZE, borderRightWidth: 0, borderTopWidth: 0    };
      case 'BR': return { ...base, left: x.value - CORNER_SIZE, top: y.value - CORNER_SIZE, borderLeftWidth: 0,  borderTopWidth: 0    };
    }
  });
  return <Animated.View style={style} />;
}

export function QRCodeScannerScreen({ navigation }: Props) {
  const { theme }                            = useTheme();
  const isFocused                            = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device                               = useCameraDevice('back');
  const cameraRef                            = useRef<any>(null);

  const scannedShared = useSharedValue(false);
  const [scanned, setScanned] = useState(false);

  const tlX = useSharedValue(INITIAL.left);
  const tlY = useSharedValue(INITIAL.top);
  const trX = useSharedValue(INITIAL.right);
  const trY = useSharedValue(INITIAL.top);
  const blX = useSharedValue(INITIAL.left);
  const blY = useSharedValue(INITIAL.bottom);
  const brX = useSharedValue(INITIAL.right);
  const brY = useSharedValue(INITIAL.bottom);
  const cornerColor = useSharedValue('white');

  const reset = useCallback(() => {
    scannedShared.value = false;
    tlX.value = withTiming(INITIAL.left,   ANIM_CONFIG);
    tlY.value = withTiming(INITIAL.top,    ANIM_CONFIG);
    trX.value = withTiming(INITIAL.right,  ANIM_CONFIG);
    trY.value = withTiming(INITIAL.top,    ANIM_CONFIG);
    blX.value = withTiming(INITIAL.left,   ANIM_CONFIG);
    blY.value = withTiming(INITIAL.bottom, ANIM_CONFIG);
    brX.value = withTiming(INITIAL.right,  ANIM_CONFIG);
    brY.value = withTiming(INITIAL.bottom, ANIM_CONFIG);
    cornerColor.value = 'white';
    setScanned(false);
  }, []);

  const showAlert = useCallback((value: string) => {
    Alert.alert('QR Code détecté ✓', value, [
      { text: 'Scanner à nouveau', onPress: reset },
    ]);
  }, [reset]);

  const handleCameraPoints = useCallback((
    value: string,
    tlCx: number, tlCy: number,
    trCx: number, trCy: number,
    brCx: number, brCy: number,
    blCx: number, blCy: number,
  ) => {
    const cam = cameraRef.current;
    if (!cam) return;

    try {
      const tl = cam.convertCameraPointToViewPoint({ x: tlCx, y: tlCy });
      const tr = cam.convertCameraPointToViewPoint({ x: trCx, y: trCy });
      const br = cam.convertCameraPointToViewPoint({ x: brCx, y: brCy });
      const bl = cam.convertCameraPointToViewPoint({ x: blCx, y: blCy });

      console.log('🔴 TL:', Math.round(tl.x), Math.round(tl.y));
      console.log('🔴 TR:', Math.round(tr.x), Math.round(tr.y));
      console.log('🔴 BR:', Math.round(br.x), Math.round(br.y));
      console.log('🔴 BL:', Math.round(bl.x), Math.round(bl.y));

      const centerX = Math.round((tl.x + tr.x + br.x + bl.x) / 4);
      const centerY = Math.round((tl.y + tr.y + br.y + bl.y) / 4);
      console.log('🎯 CENTRE X Y:', centerX, centerY);

      console.log('📷 TL CAM:', Math.round(tlCx), Math.round(tlCy));
      console.log('📷 TR CAM:', Math.round(trCx), Math.round(trCy));
      console.log('📷 BR CAM:', Math.round(brCx), Math.round(brCy));
      console.log('📷 BL CAM:', Math.round(blCx), Math.round(blCy));

      cornerColor.value = '#22C55E';
      setScanned(true);
      setTimeout(() => showAlert(value), 600);

    } catch (e) {
      scannedShared.value = false;
    }
  }, [showAlert]);

  const barcodeScanner = useBarcodeScanner({ barcodeFormats: ['qr-code'] });

  const frameOutput = useFrameOutput({
    pixelFormat: 'yuv',
    onFrame(frame) {
      'worklet';
      if (scannedShared.value) { frame.dispose(); return; }

      const barcodes = barcodeScanner.scanCodes(frame);
      if (barcodes.length === 0) { frame.dispose(); return; }

      const barcode = barcodes[0];
      const value   = barcode.rawValue;
      const points  = barcode.cornerPoints;

      if (!value || !points || points.length < 4) { frame.dispose(); return; }

      const tl = frame.convertFramePointToCameraPoint(points[0]);
      const tr = frame.convertFramePointToCameraPoint(points[1]);
      const br = frame.convertFramePointToCameraPoint(points[2]);
      const bl = frame.convertFramePointToCameraPoint(points[3]);

      scannedShared.value = true;

      // ✅ scheduleOnRN(fonction, args...)
      scheduleOnRN(
        handleCameraPoints,
        value,
        tl.x, tl.y,
        tr.x, tr.y,
        br.x, br.y,
        bl.x, bl.y,
      );

      frame.dispose();
    },
  });

  if (!hasPermission) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
        <View style={s.center}>
          <Text style={[s.errorText, { color: theme.text.primary }]}>Permission caméra requise</Text>
          <TouchableOpacity onPress={requestPermission}>
            <Text style={[s.link, { color: theme.primary }]}>Autoriser</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
        <View style={s.center}>
          <Loader size="large" />
          <Text style={[s.errorText, { color: theme.text.secondary }]}>Initialisation caméra...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={s.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && !scanned}
        outputs={[frameOutput]}
      />

      <View style={s.maskTop} />
      <View style={s.maskMiddle}>
        <View style={s.maskSide} />
        <View style={{ width: FRAME_SIZE, height: FRAME_SIZE }} />
        <View style={s.maskSide} />
      </View>
      <View style={s.maskBottom} />

      <AnimatedCorner x={tlX} y={tlY} type="TL" color={cornerColor} />
      <AnimatedCorner x={trX} y={trY} type="TR" color={cornerColor} />
      <AnimatedCorner x={blX} y={blY} type="BL" color={cornerColor} />
      <AnimatedCorner x={brX} y={brY} type="BR" color={cornerColor} />

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
  safe:       { flex: 1 },
  container:  { flex: 1, backgroundColor: 'black' },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText:  { fontSize: 16 },
  link:       { fontSize: 16, fontWeight: '600' },
  maskTop:    { height: MASK_V, backgroundColor: 'rgba(0,0,0,0.6)' },
  maskMiddle: { flexDirection: 'row', height: FRAME_SIZE },
  maskSide:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  maskBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  header:     { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 10 },
  backBtn:    { marginBottom: 12 },
  title:      { color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 6 },
  hint:       { color: 'white', fontSize: 14, opacity: 0.8 },
});