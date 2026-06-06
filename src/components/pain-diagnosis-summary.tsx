import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  AccessibilityInfo,
} from 'react-native';
import type { MedicalTerminology } from '@/services/pain-expert-system';
import { Colors } from '@/constants/theme';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface PainDiagnosisSummaryProps {
  diagnosis: MedicalTerminology;
  onDismiss: () => void;
  isDarkMode?: boolean;
}

const URGENCY_COLORS: Record<string, string> = {
  baixa: '#90EE90',
  media: '#FFD700',
  alta: '#FFA500',
  critica: '#FF6347',
};

const URGENCY_LABELS: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
};

export function PainDiagnosisSummary({
  diagnosis,
  onDismiss,
  isDarkMode = false,
}: PainDiagnosisSummaryProps) {
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const urgencyColor = URGENCY_COLORS[diagnosis.urgencyLevel];
  const { successPattern, errorPattern } = useHapticFeedback();

  React.useEffect(() => {
    // Feedback háptico baseado no nível de urgência
    if (diagnosis.urgencyLevel === 'critica' || diagnosis.urgencyLevel === 'alta') {
      errorPattern();
    } else {
      successPattern();
    }

    AccessibilityInfo.announceForAccessibility(
      `Diagnóstico registrado. ${diagnosis.primaryDiagnosis}. Nível de urgência: ${URGENCY_LABELS[diagnosis.urgencyLevel]}`
    );
  }, [diagnosis, successPattern, errorPattern]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        accessible
        accessibilityLabel="Resumo de diagnóstico de dor"
      >
        {/* Success Message */}
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✓</Text>
          <Text style={[styles.successText, { color: colors.text }]}>
            Informações Registradas
          </Text>
        </View>

        {/* Primary Diagnosis */}
        <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            Diagnóstico Primário
          </Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {diagnosis.primaryDiagnosis}
          </Text>
        </View>

        {/* Urgency Level */}
        <View
          style={[
            styles.urgencyCard,
            { backgroundColor: urgencyColor, opacity: 0.9 },
          ]}
        >
          <Text style={styles.urgencyLabel}>Nível de Urgência</Text>
          <Text style={styles.urgencyValue}>
            {URGENCY_LABELS[diagnosis.urgencyLevel].toUpperCase()}
          </Text>
        </View>

        {/* Medical Terminology */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Terminologia Médica
          </Text>
          <View style={[styles.termsList, { backgroundColor: colors.backgroundElement }]}>
            {diagnosis.medicalTerms.map((term, index) => (
              <View
                key={index}
                style={[
                  styles.termItem,
                  {
                    borderBottomColor: colors.background,
                    borderBottomWidth: index < diagnosis.medicalTerms.length - 1 ? 1 : 0,
                  },
                ]}
              >
                <Text style={[styles.termBullet, { color: colors.text }]}>
                  •
                </Text>
                <Text style={[styles.termText, { color: colors.text }]}>
                  {term}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommended Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Ações Recomendadas
          </Text>
          <View style={[styles.actionsList, { backgroundColor: colors.backgroundElement }]}>
            {diagnosis.recommendedActions.map((action, index) => (
              <View
                key={index}
                style={[
                  styles.actionItem,
                  {
                    borderLeftColor: urgencyColor,
                  },
                ]}
              >
                <Text style={[styles.actionNumber, { color: colors.textSecondary }]}>
                  {index + 1}.
                </Text>
                <Text style={[styles.actionText, { color: colors.text }]}>
                  {action}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info Message */}
        <View style={[styles.infoBox, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            A equipe de saúde foi notificada sobre seu relato de dor.
          </Text>
          <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
            Em caso de emergência, procure atendimento imediato.
          </Text>
        </View>
      </ScrollView>

      {/* Dismiss Button */}
      <View style={[styles.footer, { borderTopColor: colors.backgroundElement }]}>
        <TouchableOpacity
          style={[styles.dismissButton, { backgroundColor: colors.backgroundSelected }]}
          onPress={onDismiss}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Fechar diagnóstico"
        >
          <Text style={styles.dismissButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  urgencyCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  urgencyLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  urgencyValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  termsList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  termItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  termBullet: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  termText: {
    fontSize: 16,
    flex: 1,
  },
  actionsList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    padding: 12,
    borderLeftWidth: 4,
  },
  actionNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
    minWidth: 24,
  },
  actionText: {
    fontSize: 14,
    flex: 1,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  infoSubtext: {
    fontSize: 14,
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
  dismissButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
