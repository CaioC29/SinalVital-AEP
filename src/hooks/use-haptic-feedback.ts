/**
 * Hook para gerenciar feedback háptico (vibração)
 * Proporciona feedback sensorial ao usuário em ações importantes
 */

import { useCallback } from 'react';
import { Platform, Vibration } from 'react-native';

export function useHapticFeedback() {
  /**
   * Leve toque - para confirmação de seleção
   */
  const lightTap = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        // Vibração leve: 10ms
        Vibration.vibrate(10);
      } catch {
        // Falha silenciosa se háptica não suportada
      }
    }
  }, []);

  /**
   * Toque médio - para conclusão de etapa
   */
  const mediumTap = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        // Vibração média: 20ms
        Vibration.vibrate(20);
      } catch {
        // Falha silenciosa
      }
    }
  }, []);

  /**
   * Toque pesado - para confirmação importante ou alerta
   */
  const heavyTap = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        // Vibração pesada: 40ms
        Vibration.vibrate(40);
      } catch {
        // Falha silenciosa
      }
    }
  }, []);

  /**
   * Padrão de sucesso - múltiplos toques
   */
  const successPattern = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        // Padrão: rápido, pausa, rápido, pausa, rápido
        Vibration.vibrate([10, 50, 10, 50, 10]);
      } catch {
        // Falha silenciosa
      }
    }
  }, []);

  /**
   * Padrão de erro - vibração contínua
   */
  const errorPattern = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        // Padrão de erro: vibração mais forte
        Vibration.vibrate([30, 50, 30]);
      } catch {
        // Falha silenciosa
      }
    }
  }, []);

  /**
   * Feedback de seleção de opção
   */
  const selectionTap = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        // Vibração de seleção: 15ms
        Vibration.vibrate(15);
      } catch {
        // Falha silenciosa
      }
    }
  }, []);

  return {
    lightTap,
    mediumTap,
    heavyTap,
    successPattern,
    errorPattern,
    selectionTap,
  };
}
