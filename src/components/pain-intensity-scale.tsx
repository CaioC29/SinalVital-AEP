import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import type { PainIntensity } from '@/services/pain-expert-system';
import { Colors } from '@/constants/theme';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface PainIntensityScaleProps {
  onIntensitySelect: (intensity: PainIntensity) => void;
  selectedIntensity?: PainIntensity;
  isDarkMode?: boolean;
}

const INTENSITY_LABELS: Record<PainIntensity, string> = {
  0: 'Nenhuma dor',
  1: 'Muito leve',
  2: 'Leve',
  3: 'Leve-moderada',
  4: 'Moderada',
  5: 'Moderada-intensa',
  6: 'Intensa',
  7: 'Muito intensa',
  8: 'Extremamente intensa',
  9: 'Quase insuportável',
  10: 'Insuportável',
};

import { MaterialCommunityIcons } from '@expo/vector-icons';

const INTENSITY_ICONS: Record<PainIntensity, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  0: 'emoticon-happy-outline',
  1: 'emoticon-outline',
  2: 'emoticon-neutral-outline',
  3: 'emoticon-confused-outline',
  4: 'emoticon-sad-outline',
  5: 'emoticon-cry-outline',
  6: 'emoticon-frown-outline',
  7: 'emoticon-angry-outline',
  8: 'emoticon-dead-outline',
  9: 'emoticon-dead',
  10: 'alert-decagram-outline',
};

export function PainIntensityScale({
  onIntensitySelect,
  selectedIntensity,
  isDarkMode = false,
}: PainIntensityScaleProps) {
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const screenWidth = Dimensions.get('window').width;
  // Account for 40px padding and 60px total gap (5 gaps of 12px)
  const buttonSize = Math.min((screenWidth - 100) / 6, 50);
  const { lightTap, mediumTap, heavyTap } = useHapticFeedback();

  const handleIntensityPress = async (intensity: PainIntensity) => {
    // Variar háptica baseado na intensidade selecionada
    if (intensity <= 3) {
      await lightTap();
    } else if (intensity <= 6) {
      await mediumTap();
    } else {
      await heavyTap();
    }

    onIntensitySelect(intensity);
    AccessibilityInfo.announceForAccessibility(
      `Intensidade de dor selecionada: ${intensity} - ${INTENSITY_LABELS[intensity]}`
    );
  };

  const getIntensityColor = (intensity: PainIntensity): string => {
    if (intensity === 0) return '#90EE90'; // Green
    if (intensity <= 2) return '#FFFF99'; // Light yellow
    if (intensity <= 4) return '#FFD700'; // Gold
    if (intensity <= 6) return '#FFA500'; // Orange
    if (intensity <= 8) return '#FF6347'; // Red
    return '#8B0000'; // Dark red
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Selected Intensity Display */}
      <View style={styles.displayContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          Qual é a intensidade da dor?
        </Text>
        
        {selectedIntensity !== undefined && (
          <View style={styles.selectedDisplay}>
            <MaterialCommunityIcons 
              name={INTENSITY_ICONS[selectedIntensity]} 
              size={64} 
              color={colors.text} 
              style={styles.selectedEmoji} 
            />
            <Text style={[styles.selectedIntensity, { color: colors.text }]}>
              {selectedIntensity}
            </Text>
            <Text style={[styles.selectedLabel, { color: colors.textSecondary }]}>
              {INTENSITY_LABELS[selectedIntensity]}
            </Text>
          </View>
        )}
      </View>

      {/* Intensity Scale */}
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Sem dor
          </Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Pior dor possível
          </Text>
        </View>

        <View style={styles.buttonsGrid}>
          {(Array.from({ length: 11 }, (_, i) => i) as PainIntensity[]).map(intensity => (
            <TouchableOpacity
              key={intensity}
              style={[
                styles.intensityButton,
                {
                  width: buttonSize,
                  height: buttonSize,
                  backgroundColor: selectedIntensity === intensity
                    ? getIntensityColor(intensity)
                    : colors.backgroundElement,
                  borderColor: selectedIntensity === intensity
                    ? getIntensityColor(intensity)
                    : colors.textSecondary,
                },
              ]}
              onPress={() => handleIntensityPress(intensity)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Intensidade ${intensity}`}
              accessibilityHint={INTENSITY_LABELS[intensity]}
              accessibilityState={{ selected: selectedIntensity === intensity }}
            >
              <Text style={styles.intensityButtonText}>
                {intensity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Descriptive Scale */}
      <View style={styles.descriptiveScale}>
        <Text style={[styles.descriptiveTitle, { color: colors.text }]}>
          Descrições
        </Text>
        <View style={styles.descriptiveItems}>
          {[
            { range: '0-2', label: 'Leve', color: '#90EE90' },
            { range: '3-4', label: 'Moderada', color: '#FFD700' },
            { range: '5-6', label: 'Intensa', color: '#FFA500' },
            { range: '7-10', label: 'Severa', color: '#FF6347' },
          ].map(({ range, label, color }) => (
            <View key={range} style={styles.descriptiveItem}>
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: color },
                ]}
              />
              <View style={styles.descriptiveText}>
                <Text style={[styles.descriptiveRange, { color: colors.text }]}>
                  {range}
                </Text>
                <Text style={[styles.descriptiveLabel, { color: colors.textSecondary }]}>
                  {label}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  displayContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  selectedDisplay: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  selectedEmoji: {
    marginBottom: 10,
  },
  selectedIntensity: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  selectedLabel: {
    fontSize: 18,
  },
  scaleContainer: {
    marginBottom: 30,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  intensityButton: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 8,
  },
  intensityButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  descriptiveScale: {
    paddingTop: 20,
  },
  descriptiveTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  descriptiveItems: {
    gap: 10,
  },
  descriptiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 12,
  },
  descriptiveText: {
    flex: 1,
  },
  descriptiveRange: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  descriptiveLabel: {
    fontSize: 12,
  },
});
