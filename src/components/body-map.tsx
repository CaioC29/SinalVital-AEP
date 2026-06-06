import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import type { PainLocation } from '@/services/pain-expert-system';
import { Colors } from '@/constants/theme';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface BodyMapProps {
  onLocationSelect: (location: PainLocation) => void;
  selectedLocation?: PainLocation;
  isDarkMode?: boolean;
}

import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const PAIN_LOCATIONS: {
  id: PainLocation;
  label: string;
  description: string;
  renderIcon: (color: string) => React.ReactNode;
}[] = [
  { id: 'head', label: 'Cabeça', description: 'Topo da cabeça ou rosto', renderIcon: (c) => <FontAwesome5 name="brain" size={42} color={c} /> },
  { id: 'neck', label: 'Pescoço', description: 'Pescoço ou garganta', renderIcon: (c) => <MaterialCommunityIcons name="human" size={42} color={c} /> },
  { id: 'shoulder', label: 'Ombro', description: 'Um ou ambos os ombros', renderIcon: (c) => <MaterialCommunityIcons name="human-handsup" size={42} color={c} /> },
  { id: 'arm', label: 'Braço', description: 'Braço ou antebraço', renderIcon: (c) => <MaterialCommunityIcons name="arm-flex" size={42} color={c} /> },
  { id: 'chest', label: 'Peito', description: 'Tórax ou peito', renderIcon: (c) => <FontAwesome5 name="lungs" size={42} color={c} /> },
  { id: 'abdomen', label: 'Barriga', description: 'Região abdominal', renderIcon: (c) => <MaterialCommunityIcons name="stomach" size={42} color={c} /> },
  { id: 'back', label: 'Costas', description: 'Parte superior ou inferior das costas', renderIcon: (c) => <Ionicons name="body-outline" size={42} color={c} /> },
  { id: 'hip', label: 'Quadril', description: 'Quadril ou pelve', renderIcon: (c) => <MaterialCommunityIcons name="human-handsdown" size={42} color={c} /> },
  { id: 'leg', label: 'Perna', description: 'Coxa ou canela', renderIcon: (c) => <Ionicons name="walk" size={42} color={c} /> },
  { id: 'foot', label: 'Pé', description: 'Pé ou tornozelo', renderIcon: (c) => <FontAwesome5 name="shoe-prints" size={42} color={c} /> },
  { id: 'joint', label: 'Articulação', description: 'Joelho, cotovelo ou outra articulação', renderIcon: (c) => <FontAwesome5 name="bone" size={42} color={c} /> },
  { id: 'other', label: 'Outra Área', description: 'Outra região do corpo', renderIcon: (c) => <Ionicons name="help-circle-outline" size={42} color={c} /> },
];

export function BodyMap({ onLocationSelect, selectedLocation, isDarkMode = false }: BodyMapProps) {
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const screenWidth = Dimensions.get('window').width;
  // Account for 40px padding (20px each side) and 10px gap between the 2 columns
  const buttonWidth = (screenWidth - 50) / 2;
  const { selectionTap } = useHapticFeedback();

  const handleLocationPress = async (location: PainLocation) => {
    await selectionTap();
    onLocationSelect(location);
    // Announce selection for accessibility
    AccessibilityInfo.announceForAccessibility(
      `Localização de dor selecionada: ${location}`
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      scrollEventThrottle={16}
      accessible
      accessibilityLabel="Mapa do corpo para seleção de localização de dor"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Onde está a dor?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Toque no local do seu corpo
        </Text>
      </View>

      <View style={styles.gridContainer}>
        {PAIN_LOCATIONS.map(location => {
          const isSelected = selectedLocation === location.id;
          return (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.locationButton,
              {
                width: buttonWidth,
                backgroundColor: isSelected 
                  ? colors.backgroundSelected 
                  : colors.backgroundElement,
                borderColor: isSelected 
                  ? '#4CAF50' 
                  : colors.textSecondary,
              },
            ]}
            onPress={() => handleLocationPress(location.id)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={location.label}
            accessibilityHint={location.description}
            accessibilityState={{ selected: isSelected }}
          >
            <View style={styles.iconWrapper}>
              {location.renderIcon(isSelected ? '#4CAF50' : colors.text)}
            </View>
            <Text style={[styles.buttonLabel, { color: colors.text }]}>
              {location.label}
            </Text>
            <Text style={[styles.buttonDescription, { color: colors.textSecondary }]}>
              {location.description}
            </Text>
          </TouchableOpacity>
        )})}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  locationButton: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  iconWrapper: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
