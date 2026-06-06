/**
 * SinalVital - Sistema Especialista para Comunicação de Dor
 * Baseado em Autômatos Finitos Determinísticos (AFD)
 * 
 * Este módulo implementa a lógica de diagnóstico de dor,
 * traduzindo as interações do paciente em terminologia médica.
 */

export type PainLocation = 
  | 'head' | 'neck' | 'shoulder' | 'arm' | 'chest' | 'abdomen' 
  | 'back' | 'hip' | 'leg' | 'foot' | 'joint' | 'other';

export type PainCharacteristic =
  | 'aguda' | 'cronica' | 'queimacao' | 'formigamento'
  | 'latejante' | 'irradiante' | 'constante' | 'intermitente';

export type PainIntensity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface PainReport {
  location: PainLocation;
  characteristics: PainCharacteristic[];
  intensity: PainIntensity;
  duration?: string;
  onset?: string;
}

export interface MedicalTerminology {
  primaryDiagnosis: string;
  medicalTerms: string[];
  recommendedActions: string[];
  urgencyLevel: 'baixa' | 'media' | 'alta' | 'critica';
}

// Mapa de localizações anatômicas para terminologia médica
const ANATOMICAL_MAPPING: Record<PainLocation, string> = {
  head: 'Cefaleia/Cefalalgia',
  neck: 'Cervicalgia',
  shoulder: 'Omalgia',
  arm: 'Braquialgia',
  chest: 'Dor Torácica/Toracalgia',
  abdomen: 'Dor Abdominal',
  back: 'Dorsalgia/Lombalgia',
  hip: 'Coxalgia',
  leg: 'Crural',
  foot: 'Podal',
  joint: 'Artralgia',
  other: 'Dor Localizada',
};

// Classificação de características de dor
const PAIN_CHARACTERISTICS_TERMS: Record<PainCharacteristic, string> = {
  aguda: 'Dor Aguda (início súbito)',
  cronica: 'Dor Crônica (persistente > 3 meses)',
  queimacao: 'Sensação de Queimação/Disestesia',
  formigamento: 'Parestesia/Formigamento',
  latejante: 'Dor Pulsátil/Latejante',
  irradiante: 'Dor Irradiante',
  constante: 'Dor Constante',
  intermitente: 'Dor Intermitente',
};

// Tabela de decisão baseada em intensidade e localização
const URGENCY_DECISION_TREE = {
  getUrgency: (intensity: PainIntensity, location: PainLocation): 'baixa' | 'media' | 'alta' | 'critica' => {
    // Localizações críticas
    const criticalLocations = ['chest', 'abdomen', 'head'];
    if (criticalLocations.includes(location) && intensity >= 7) {
      return 'critica';
    }
    if (criticalLocations.includes(location) && intensity >= 5) {
      return 'alta';
    }
    
    // Intensidade crítica
    if (intensity >= 9) {
      return 'critica';
    }
    if (intensity >= 7) {
      return 'alta';
    }
    if (intensity >= 5) {
      return 'media';
    }
    return 'baixa';
  },
};

/**
 * Gera terminologia médica baseada no relatório de dor
 * @param report - Relatório de dor do paciente
 * @returns Terminologia médica com diagnóstico e recomendações
 */
export function generateMedicalTerminology(report: PainReport): MedicalTerminology {
  const medicalTerms: string[] = [];
  
  // Termo primário (localização)
  const primaryDiagnosis = ANATOMICAL_MAPPING[report.location];
  medicalTerms.push(primaryDiagnosis);
  
  // Características adicionais
  report.characteristics.forEach(char => {
    medicalTerms.push(PAIN_CHARACTERISTICS_TERMS[char]);
  });
  
  // Determinar nível de urgência
  const urgencyLevel = URGENCY_DECISION_TREE.getUrgency(report.intensity, report.location);
  
  // Gerar recomendações baseadas em padrões
  const recommendedActions = generateRecommendedActions(report, urgencyLevel);
  
  return {
    primaryDiagnosis,
    medicalTerms,
    recommendedActions,
    urgencyLevel,
  };
}

/**
 * Gera ações recomendadas baseado no padrão de dor
 */
function generateRecommendedActions(
  report: PainReport,
  urgency: 'baixa' | 'media' | 'alta' | 'critica'
): string[] {
  const actions: string[] = [];
  
  // Ações por nível de urgência
  switch (urgency) {
    case 'critica':
      actions.push('Chamar médico imediatamente');
      actions.push('Monitorar sinais vitais');
      break;
    case 'alta':
      actions.push('Avisar enfermagem');
      actions.push('Considerar intervenção analgésica');
      break;
    case 'media':
      actions.push('Documentar dor');
      actions.push('Oferecer medidas de conforto');
      break;
    case 'baixa':
      actions.push('Monitorar evolução');
      break;
  }
  
  // Ações específicas por localização
  if (report.location === 'chest' && report.intensity >= 5) {
    actions.push('Verificar pressão arterial');
  }
  
  if (report.characteristics.includes('irradiante')) {
    actions.push('Avaliar possível neuropatia');
  }
  
  return actions;
}

/**
 * Valida se o estado de navegação é válido (AFD)
 */
export function validatePainReportState(state: Partial<PainReport>): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  
  if (!state.location) missingFields.push('location');
  if (!state.characteristics || state.characteristics.length === 0) {
    missingFields.push('characteristics');
  }
  if (state.intensity === undefined || state.intensity === null) {
    missingFields.push('intensity');
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Gera um sumário legível em português para o paciente
 */
export function generatePatientSummary(report: PainReport, terminology: MedicalTerminology): string {
  const intensityLabel = getIntensityLabel(report.intensity);
  
  let summary = `Você relatou dor ${intensityLabel}`;
  
  if (report.location) {
    summary += ` na região ${getLocationLabel(report.location)}`;
  }
  
  summary += '.\n\n';
  summary += 'Informações foram registradas e a equipe de saúde foi notificada.';
  
  return summary;
}

function getIntensityLabel(intensity: PainIntensity): string {
  const labels = [
    'ausente',
    'muito leve',
    'leve',
    'leve a moderada',
    'moderada',
    'moderada a intensa',
    'intensa',
    'muito intensa',
    'extremamente intensa',
    'quase insuportável',
    'insuportável',
  ];
  return labels[intensity] || 'desconhecida';
}

function getLocationLabel(location: PainLocation): string {
  const labels: Record<PainLocation, string> = {
    head: 'cabeça',
    neck: 'pescoço',
    shoulder: 'ombro',
    arm: 'braço',
    chest: 'peito',
    abdomen: 'barriga',
    back: 'costas',
    hip: 'quadril',
    leg: 'perna',
    foot: 'pé',
    joint: 'articulação',
    other: 'outra área',
  };
  return labels[location] || 'desconhecida';
}
