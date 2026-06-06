/**
 * Hook para gerenciar o fluxo de navegação baseado em AFD
 * Cada tela é um "estado" e a resposta do paciente é a "transição"
 */

import { useState, useCallback } from 'react';
import type { PainLocation, PainCharacteristic, PainIntensity, PainReport } from '@/services/pain-expert-system';

type NavigationState = 
  | 'welcome'
  | 'location'
  | 'characteristics'
  | 'intensity'
  | 'confirmation'
  | 'summary';

export interface PainFlowState {
  currentState: NavigationState;
  location?: PainLocation;
  characteristics: PainCharacteristic[];
  intensity?: PainIntensity;
}

export function usePainNavigationFlow() {
  const [flowState, setFlowState] = useState<PainFlowState>({
    currentState: 'welcome',
    characteristics: [],
  });

  const selectLocation = useCallback((location: PainLocation) => {
    setFlowState(prev => ({
      ...prev,
      location,
      currentState: 'characteristics',
    }));
  }, []);

  const selectCharacteristics = useCallback((characteristics: PainCharacteristic[]) => {
    setFlowState(prev => ({
      ...prev,
      characteristics,
      currentState: 'intensity',
    }));
  }, []);

  const selectIntensity = useCallback((intensity: PainIntensity) => {
    setFlowState(prev => ({
      ...prev,
      intensity,
    }));
  }, []);

  const confirmReport = useCallback(() => {
    setFlowState(prev => ({
      ...prev,
      currentState: 'summary',
    }));
  }, []);

  const goBack = useCallback(() => {
    setFlowState(prev => {
      const stateTransitions: Record<NavigationState, NavigationState> = {
        'welcome': 'welcome',
        'location': 'welcome',
        'characteristics': 'location',
        'intensity': 'characteristics',
        'confirmation': 'intensity',
        'summary': 'confirmation',
      };

      return {
        ...prev,
        currentState: stateTransitions[prev.currentState],
      };
    });
  }, []);

  const reset = useCallback(() => {
    setFlowState({
      currentState: 'welcome',
      characteristics: [],
    });
  }, []);

  const getPainReport = useCallback((): PainReport | null => {
    if (!flowState.location || flowState.characteristics.length === 0 || flowState.intensity === undefined) {
      return null;
    }

    return {
      location: flowState.location,
      characteristics: flowState.characteristics,
      intensity: flowState.intensity,
    };
  }, [flowState]);

  const transitionToLocation = useCallback(() => {
    if (flowState.currentState === 'welcome') {
      setFlowState(prev => ({
        ...prev,
        currentState: 'location',
      }));
    }
  }, [flowState.currentState]);

  return {
    flowState,
    selectLocation,
    selectCharacteristics,
    selectIntensity,
    confirmReport,
    goBack,
    reset,
    getPainReport,
    transitionToLocation,
  };
}
