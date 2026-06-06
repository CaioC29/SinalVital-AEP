import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  AccessibilityInfo,
} from 'react-native';
import type { PainCharacteristic } from '@/services/pain-expert-system';
import { Colors } from '@/constants/theme';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface PainCharacteristicsProps {
  onConfirm: (characteristics: PainCharacteristic[]) => void;
  selectedCharacteristics?: PainCharacteristic[];
  isDarkMode?: boolean;
}

import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const CHARACTERISTICS: {
  id: PainCharacteristic;
  label: string;
  description: string;
  renderIcon: (color: string) => React.ReactNode;
}[] = [
  {
    id: 'aguda',
    label: 'Aguda',
    description: 'Começou de repente',
    renderIcon: (c) => <Ionicons name="flash" size={28} color={c} />,
  },
  {
    id: 'cronica',
    label: 'Crônica',
    description: 'Dura há muito tempo',
    renderIcon: (c) => <Ionicons name="time" size={28} color={c} />,
  },
  {
    id: 'queimacao',
    label: 'Queimação',
    description: 'Sensação de queimar',
    renderIcon: (c) => <FontAwesome5 name="fire" size={28} color={c} />,
  },
  {
    id: 'formigamento',
    label: 'Formigamento',
    description: 'Sensação de agulhas',
    renderIcon: (c) => <MaterialCommunityIcons name="pin" size={28} color={c} />,
  },
  {
    id: 'latejante',
    label: 'Latejante',
    description: 'Pulsa ou bate',
    renderIcon: (c) => <MaterialCommunityIcons name="heart-pulse" size={28} color={c} />,
  },
  {
    id: 'irradiante',
    label: 'Irradiante',
    description: 'Espalha para outras áreas',
    renderIcon: (c) => <Ionicons name="radio" size={28} color={c} />,
  },
  {
    id: 'constante',
    label: 'Constante',
    description: 'Não para',
    renderIcon: (c) => <MaterialCommunityIcons name="infinity" size={28} color={c} />,
  },
  {
    id: 'intermitente',
    label: 'Intermitente',
    description: 'Vai e vem',
    renderIcon: (c) => <Ionicons name="sync" size={28} color={c} />,
  },
];

export function PainCharacteristics({
  onConfirm,
  selectedCharacteristics = [],
  isDarkMode = false,
}: PainCharacteristicsProps) {
  const [selected, setSelected] = useState<PainCharacteristic[]>(selectedCharacteristics);
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const { selectionTap, lightTap } = useHapticFeedback();

  const toggleCharacteristic = async (characteristic: PainCharacteristic) => {
    await selectionTap();
    setSelected(prev => {
      if (prev.includes(characteristic)) {
        return prev.filter(c => c !== characteristic);
      } else {
        return [...prev, characteristic];
      }
    });
  };

  const handleConfirm = async () => {
    if (selected.length > 0) {
      await lightTap();
      onConfirm(selected);
      AccessibilityInfo.announceForAccessibility(
        `${selected.length} características de dor selecionadas`
      );
    }
  };

  const isConfirmDisabled = selected.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        accessible
        accessibilityLabel="Seleção de características de dor"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Como é a dor?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Selecione uma ou mais opções
          </Text>
          <Text style={[styles.counter, { color: colors.textSecondary }]}>
            Selecionadas: {selected.length}
          </Text>
        </View>

        <View style={styles.characteristicsContainer}>
          {CHARACTERISTICS.map(char => (
            <TouchableOpacity
              key={char.id}
              style={[
                styles.characteristicButton,
                {
                  backgroundColor: selected.includes(char.id)
                    ? colors.backgroundSelected
                    : colors.backgroundElement,
                  borderColor: selected.includes(char.id)
                    ? '#4CAF50'
                    : colors.textSecondary,
                },
              ]}
              onPress={() => toggleCharacteristic(char.id)}
              accessible
              accessibilityRole="checkbox"
              accessibilityLabel={char.label}
              accessibilityHint={char.description}
              accessibilityState={{ checked: selected.includes(char.id) }}
            >
              <View style={styles.iconWrapper}>
                {char.renderIcon(selected.includes(char.id) ? '#4CAF50' : colors.text)}
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.label, { color: colors.text }]}>
                  {char.label}
                </Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {char.description}
                </Text>
              </View>
              {selected.includes(char.id) && (
                <View style={styles.checkmark}>
                  <Text style={{ fontSize: 20, color: '#4CAF50' }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.backgroundElement }]}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor: isConfirmDisabled ? colors.textSecondary : '#4CAF50',
              opacity: isConfirmDisabled ? 0.5 : 1,
            },
          ]}
          onPress={handleConfirm}
          disabled={isConfirmDisabled}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Confirmar seleção de características"
          accessibilityState={{ disabled: isConfirmDisabled }}
        >
          <Text style={styles.confirmButtonText}>
            Confirmar ({selected.length})
          </Text>
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
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  counter: {
    fontSize: 16,
    fontWeight: '500',
  },
  characteristicsContainer: {
    gap: 12,
  },
  characteristicButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  iconWrapper: {
    width: 40,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  checkmark: {
    marginLeft: 10,
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
