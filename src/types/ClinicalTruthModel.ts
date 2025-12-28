/**
 * @file ClinicalTruthModel.ts
 * @description SINGLE SOURCE OF TRUTH.
 * Este archivo define la estructura de datos obligatoria para Coollabora-Clinic.
 * NADA puede existir fuera de este modelo.
 * 
 * Autoridad Emisora: Documentacion/02_Product/DOCUMENTO_EJECUTIVO_V1.md
 */

export type ClinicalStatus = 'observation' | 'custody_active' | 'custody_paused' | 'audit_in_progress';
export type TrendDirection = 'up' | 'stable' | 'down';
export type InfrastructureStatus = 'present' | 'absent' | 'obsolete';
export type SocialChannel = 'IG' | 'TikTok' | 'YT' | 'Web' | 'Others';
export type ToneType = 'técnico' | 'promocional' | 'infantilizado' | 'ambiguo' | 'clínico_autoritario';
export type CongruenceLevel = 'alto' | 'medio' | 'crítico';

export interface ClinicalTruthModel {
    /** ID único del médico (Firebase Auth ID) */
    doctorId: string;

    /** Estado actual del expediente en el ciclo de custodia */
    status: ClinicalStatus;

    /** 
     * Score Global de Autoridad (0-10)
     * REGLA: SIEMPRE ENTERO. Math.round() obligatorio.
     */
    authorityScoreGlobal: number;

    /** Dirección de la tendencia histórica */
    authorityTrend: TrendDirection;

    /** Infraestructura Digital */
    infrastructure: {
        /** La ausencia de web penaliza gravemente */
        website: InfrastructureStatus;
        socialChannels: SocialChannel[];
    };

    /** Oratoria y Comunicación */
    oratory: {
        dominantTone: ToneType;
        redFlagsDetected: string[];
    };

    /** Identidad Visual */
    visual: {
        congruenceLevel: CongruenceLevel;
        /** Si genera rechazo inmediato por calidad */
        shockRisk: boolean;
    };

    /** Riesgo Regulatorio (Legal) */
    regulatoryRisk: {
        ageRestriction: boolean;
        promotionLanguageRisk: boolean;
    };

    /** 
     * Registro de Decisiones (Permisos / Prohibiciones)
     * Historial inmutable de lo que el sistema permitió o prohibió.
     */
    decisionsRegistry: Array<{
        id: string;
        decision: 'allowed' | 'prohibited';
        context: string;
        timestamp: number;
    }>;

    /** 
     * Hallazgos Humanos (Auditoría Estructurada)
     * Protocolo Estricto: Canal -> Riesgo -> Hecho -> Estrategia
     */
    humanFindings?: {
        channel: string;
        riskType: string;
        fact: string;
        strategicNote: string;
        isHiddenClient: boolean;
        timestamp: number;
    };

    /**
     * Dictamen del Oráculo (Jurisprudencia)
     * Generado por IA en Fase 2
     */
    oracleRuling?: {
        titular: string;
        dictamen: string;
        riesgo_financiero: string;
        fundamento_tecnico: string;
        precedente_citado: string;
    };

    /** Historial de Interacciones */
    history: {
        reports: Array<{
            id: string;
            date: number;
            score: number;
        }>;
    };
}
