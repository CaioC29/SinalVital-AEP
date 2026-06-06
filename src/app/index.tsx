import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';


export default function WelcomeScreen() {
  const colors = useTheme();
  const screenHeight = Dimensions.get('window').height;
  const { mediumTap } = useHapticFeedback();

  const handleStartAssessment = useCallback(async () => {
    await mediumTap();
    AccessibilityInfo.announceForAccessibility(
      'Iniciando avaliação de dor'
    );
    router.push('/pain-assessment');
  }, [mediumTap]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>SinalVital</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sistema de Comunicação de Dor
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Bem-vindo ao SinalVital
          </Text>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Este aplicativo foi desenvolvido para ajudar você a comunicar sua dor de forma clara e eficaz.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon={<FontAwesome5 name="bullseye" size={28} color="#4CAF50" />}
            title="Simples"
            description="Interface intuitiva com botões grandes"
            colors={colors}
          />
          <FeatureItem
            icon={<FontAwesome5 name="wheelchair" size={28} color="#4CAF50" />}
            title="Acessível"
            description="Otimizado para pessoas com dificuldades de comunicação"
            colors={colors}
          />
          <FeatureItem
            icon={<FontAwesome5 name="user-md" size={28} color="#4CAF50" />}
            title="Profissional"
            description="Traduz suas respostas em terminologia médica"
            colors={colors}
          />
        </View>

        {/* Main Button */}
        <TouchableOpacity
          style={[styles.startButton, { height: Math.max(60, screenHeight * 0.08) }]}
          onPress={handleStartAssessment}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Começar avaliação de dor"
          accessibilityHint="Toque para iniciar o questionário sobre sua dor"
        >
          <Text style={styles.startButtonText}>Começar Avaliação</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </TouchableOpacity>

        {/* Info Footer */}
        <View style={[styles.footer, { backgroundColor: colors.backgroundElement }]}>
          <View style={styles.footerContent}>
            <Ionicons name="information-circle" size={16} color={colors.text} />
            <Text style={[styles.footerText, { color: colors.text }]}>
              Em caso de emergência, procure atendimento médico imediato.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colors: any;
}

function FeatureItem({ icon, title, description, colors }: FeatureItemProps) {
  return (
    <View style={[styles.featureItem, { backgroundColor: colors.backgroundElement }]}>
      <View style={styles.featureIcon}>{icon}</View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: '#4CAF50',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 16,
    width: 32,
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 12,
  },
  startButtonArrow: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  footer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 6,
    flex: 1,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
