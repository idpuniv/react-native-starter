import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert, TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import registerService from '@/services/register.service';
import { useCreateUser } from '@/hooks/useUsers';


// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    nom: z.string().min(2, 'Minimum 2 caractères'),
    prenom: z.string().min(2, 'Minimum 2 caractères'),
    telephone: z.string().min(8, 'Numéro invalide').regex(/^\+?[0-9\s\-]+$/, 'Numéro invalide'),
    email: z.string().email('Email invalide'),
    dateNaissance: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Format JJ/MM/AAAA'),
    motDePasse: z.string().min(8, 'Minimum 8 caractères').regex(/[A-Z]/, 'Au moins une majuscule').regex(/[0-9]/, 'Au moins un chiffre'),
    confirmerMotDePasse: z.string().min(1, 'Requis'),
  })
  .refine(d => d.motDePasse === d.confirmerMotDePasse, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmerMotDePasse'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Screen ───────────────────────────────────────────────────────────────────

interface RegisterScreenProps {
  navigation: any;
}

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });


  const createUser = useCreateUser();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmerMotDePasse, ...payload } = data;
      await createUser.mutateAsync(payload);
      Alert.alert(
        'Inscription réussie ✓',
        `Bienvenue ${data.prenom} ${data.nom} !`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (e: any) {
      const message = e?.response?.data?.message ?? e?.message ?? 'Erreur inconnue';
      Alert.alert('Erreur', message);
    }
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[s.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <ArrowLeft size={22} color={theme.text.primary} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: theme.text.primary }]}>
            Inscription
          </Text>
          <View style={s.backBtn} />
        </View>

        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Identité */}
          <Text style={[s.section, { color: theme.text.secondary }]}>IDENTITÉ</Text>

          <Controller
            control={control} name="nom"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input ref={ref} label="Nom" placeholder="Dupont"
                autoCapitalize="words" returnKeyType="next"
                onChangeText={onChange} onBlur={onBlur} value={value}
                error={errors.nom?.message} />
            )}
          />

          <Controller
            control={control} name="prenom"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input ref={ref} label="Prénom" placeholder="Jean"
                autoCapitalize="words" returnKeyType="next"
                onChangeText={onChange} onBlur={onBlur} value={value}
                error={errors.prenom?.message} />
            )}
          />

          <Controller
            control={control} name="dateNaissance"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Date de naissance"
                placeholder="JJ/MM/AAAA"
                keyboardType="number-pad"
                returnKeyType="next"
                maxLength={10}
                onChangeText={(text) => {
                  // Suppression — laisser passer
                  if (text.length < (value?.length ?? 0)) {
                    onChange(text);
                    return;
                  }
                  // Auto-insertion des /
                  let formatted = text.replace(/\D/g, '');
                  if (formatted.length >= 2) formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
                  if (formatted.length >= 5) formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
                  onChange(formatted);
                }}
                onBlur={onBlur}
                value={value}
                error={errors.dateNaissance?.message}
              />
            )}
          />

          {/* Contact */}
          <Text style={[s.section, { color: theme.text.secondary }]}>CONTACT</Text>

          <Controller
            control={control} name="telephone"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input ref={ref} label="Téléphone" placeholder="+33 6 00 00 00 00"
                keyboardType="phone-pad" returnKeyType="next"
                onChangeText={onChange} onBlur={onBlur} value={value}
                error={errors.telephone?.message} />
            )}
          />

          <Controller
            control={control} name="email"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input ref={ref} label="Email" placeholder="jean@exemple.com"
                keyboardType="email-address" autoCapitalize="none"
                returnKeyType="next"
                onChangeText={onChange} onBlur={onBlur} value={value}
                error={errors.email?.message} />
            )}
          />

          {/* Sécurité */}
          <Text style={[s.section, { color: theme.text.secondary }]}>SÉCURITÉ</Text>

          <Controller
            control={control} name="motDePasse"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input ref={ref} label="Mot de passe" placeholder="Min. 8 caractères"
                secureTextEntry returnKeyType="next"
                onChangeText={onChange} onBlur={onBlur} value={value}
                error={errors.motDePasse?.message} />
            )}
          />

          <Controller
            control={control} name="confirmerMotDePasse"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input ref={ref} label="Confirmer le mot de passe" placeholder="••••••••"
                secureTextEntry returnKeyType="done"
                onChangeText={onChange} onBlur={onBlur} value={value}
                error={errors.confirmerMotDePasse?.message}
                onSubmitEditing={handleSubmit(onSubmit)} />
            )}
          />

          <Button
            label="S'inscrire"
            onPress={handleSubmit(onSubmit)}
            isLoading={createUser.isPending}
            style={s.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  scroll: { padding: 20, paddingBottom: 40 },
  section: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 8,
  },
  submitBtn: { marginTop: 16 },
});
