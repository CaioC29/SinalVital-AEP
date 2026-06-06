import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { usePainNavigationFlow } from '@/hooks/use-pain-navigation-flow';
import { useTheme } from '@/hooks/use-theme';
import { generateMedicalTerminology, type MedicalTerminology } from '@/services/pain-expert-system';
import { BodyMap } from '@/components/body-map';
import { PainCharacteristics } from '@/components/pain-characteristics';
import { PainIntensityScale } from '@/components/pain-intensity-scale';
import { PainDiagnosisSummary } from '@/components/pain-diagnosis-summary';
import { Colors } from '@/constants/theme';

export default function PainAssessmentScreen() {
  const colors = useTheme();
  const {
    flowState,
    selectLocation,
    selectCharacteristics,
    selectIntensity,
    confirmReport,
    goBack,
    reset,
    getPainReport,
    transitionToLocation,
  } = usePainNavigationFlow();

  const [diagnosis, setDiagnosis] = useState<MedicalTerminology | null>(null);

  const handleConfirmReport = useCallback(() => {
    const report = getPainReport();
    if (report) {
      const medicalDiagnosis = generateMedicalTerminology(report);
      setDiagnosis(medicalDiagnosis);
      confirmReport();
    }
  }, [getPainReport, confirmReport]);

  const handleDismiss = useCallback(() => {
    reset();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [reset]);

  const handleBack = useCallback(() => {
    if (flowState.currentState === 'location' || flowState.currentState === 'welcome') {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } else {
      goBack();
    }
  }, [flowState.currentState, goBack]);

  useEffect(() => {
    if (flowState.currentState === 'welcome') {
      transitionToLocation();
    }
  }, [flowState.currentState, transitionToLocation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back Button Header */}
      {flowState.currentState !== 'summary' && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} accessible accessibilityRole="button">
            <Text style={[styles.backButton, { color: colors.text }]}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={[styles.stepIndicator, { color: colors.textSecondary }]}>
            {getStepLabel(flowState.currentState)}
          </Text>
        </View>
      )}

      {/* Content Screens */}
      {flowState.currentState === 'location' && (
        <BodyMap
          onLocationSelect={selectLocation}
          selectedLocation={flowState.location}
          isDarkMode={colors === Colors.dark}
        />
      )}

      {flowState.currentState === 'characteristics' && (
        <PainCharacteristics
          onConfirm={selectCharacteristics}
          selectedCharacteristics={flowState.characteristics}
          isDarkMode={colors === Colors.dark}
        />
      )}

      {flowState.currentState === 'intensity' && (
        <View style={styles.intensityContainer}>
          <PainIntensityScale
            onIntensitySelect={selectIntensity}
            selectedIntensity={flowState.intensity}
            isDarkMode={colors === Colors.dark}
          />
          <View style={[styles.footer, { borderTopColor: colors.backgroundElement }]}>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: '#4CAF50' }]}
              onPress={handleConfirmReport}
              disabled={flowState.intensity === undefined}
            >
              <Text style={styles.confirmButtonText}>Confirmar e Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {flowState.currentState === 'summary' && diagnosis && (
        <PainDiagnosisSummary
          diagnosis={diagnosis}
          onDismiss={handleDismiss}
          isDarkMode={colors === Colors.dark}
        />
      )}
    </SafeAreaView>
  );
}

function getStepLabel(state: string): string {
  const labels: Record<string, string> = {
    location: 'Passo 1 de 3: Localização',
    characteristics: 'Passo 2 de 3: Características',
    intensity: 'Passo 3 de 3: Intensidade',
    confirmation: 'Confirmação',
    summary: 'Resumo',
    welcome: 'Bem-vindo',
  };
  return labels[state] || '';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '500',
  },
  intensityContainer: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    backgroundColor: 'transparent',
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
