/**
 * @file match_algorithm.ts
 * @description Core Logic for Phase 3: Authority Correction.
 * Defines Authority Operating States (AOS) and calculates the "Authority Gap".
 * 
 * STRICT DIRECTIVE:
 * - NO "Archetypes" (Identity).
 * - YES "Operating States" (Diagnosis).
 * - Output must be surgical: "Erosión", "Desalineación".
 */

import { ClinicalTruthModel } from '../types/ClinicalTruthModel';

// --- DEFINITIONS ---

export type AOS_Type =
    | 'AUTHORITY_CLINICAL_ACADEMIC'    // Ideal for some
    | 'AUTHORITY_TECHNICAL_SURGICAL'   // Ideal for others
    | 'AUTHORITY_COMMERCIALIZED'       // DEGRADED STATE
    | 'AUTHORITY_INVISIBLE'            // CRITICAL STATE
    | 'AUTHORITY_HYBRID_CHAOTIC';      // CONFUSED STATE

export interface AuthorityVector {
    scoreGlobal: number;
    infrastructureState: 'present' | 'absent' | 'obsolete';
    narrativeTone: 'técnico' | 'promocional' | 'infantilizado' | 'ambiguo' | 'clínico_autoritario';
    regulatoryExposure: {
        ageRestriction: boolean;
        languageRisk: boolean;
    };
    visualCongruence: 'alto' | 'medio' | 'crítico';
}

export interface AuthorityGapResult {
    gapScore: number; // 0-100 (Distance from ideal)
    currentAOS: AOS_Type;
    primaryErosion: string; // The main bleeding point
    secondaryRisks: string[];
    authorityMisalignment: string; // The surgical diagnosis sentence
    correctionPhases: {
        phase1: { risk: string; bias: string; correction: string }; // Days 1-30
        phase2: { risk: string; bias: string; correction: string }; // Days 31-60
        phase3: { risk: string; bias: string; correction: string }; // Days 61-90
    };
}

// --- LOGIC ---

/**
 * Diagnoses the current Authority Operating State (AOS)
 */
function diagnoseAOS(vector: AuthorityVector): AOS_Type {
    if (vector.scoreGlobal < 3 || vector.infrastructureState === 'absent') {
        return 'AUTHORITY_INVISIBLE';
    }

    if (vector.narrativeTone === 'promocional' || vector.narrativeTone === 'infantilizado') {
        return 'AUTHORITY_COMMERCIALIZED';
    }

    if (vector.narrativeTone === 'ambiguo' && vector.visualCongruence === 'crítico') {
        return 'AUTHORITY_HYBRID_CHAOTIC';
    }

    // High scores with correct tone
    if (vector.scoreGlobal >= 7) {
        if (vector.narrativeTone === 'técnico') return 'AUTHORITY_TECHNICAL_SURGICAL';
        if (vector.narrativeTone === 'clínico_autoritario') return 'AUTHORITY_CLINICAL_ACADEMIC';
    }

    return 'AUTHORITY_HYBRID_CHAOTIC'; // Fallback
}

/**
 * Calculates the Gap and prescribes the Correction Protocol
 */
export function calculateAuthorityGap(model: ClinicalTruthModel): AuthorityGapResult {

    // 1. Construct Vector from Truth Model
    const vector: AuthorityVector = {
        scoreGlobal: model.authorityScoreGlobal,
        infrastructureState: model.infrastructure.website,
        narrativeTone: model.oratory.dominantTone,
        regulatoryExposure: {
            ageRestriction: model.regulatoryRisk.ageRestriction,
            languageRisk: model.regulatoryRisk.promotionLanguageRisk
        },
        visualCongruence: model.visual.congruenceLevel
    };

    // 2. Diagnose Current State
    const currentAOS = diagnoseAOS(vector);

    // 3. Define "Misalignment" per State
    let misalignment = "";
    let primaryErosion = "";
    let gapScore = 0;

    switch (currentAOS) {
        case 'AUTHORITY_COMMERCIALIZED':
            misalignment = "Su ecosistema opera como autoridad comercial de volumen cuando su especialidad exige autoridad de validación técnica.";
            primaryErosion = "Erosión por Mercanitilización del Discurso";
            gapScore = 65;
            break;
        case 'AUTHORITY_INVISIBLE':
            misalignment = "Inexistencia de activos digitales de custodia. El paciente percibe riesgo de obsolescencia.";
            primaryErosion = "Vacío de Validación (Digital Homelessness)";
            gapScore = 90;
            break;
        case 'AUTHORITY_HYBRID_CHAOTIC':
            misalignment = "Disonancia cognitiva entre la promesa clínica y la evidencia digital presentada.";
            primaryErosion = "Fricción de Confianza";
            gapScore = 45;
            break;
        default:
            misalignment = "Desviaciones menores en la custodia de autoridad.";
            primaryErosion = "Fatiga de Mantenimiento";
            gapScore = 15;
    }

    // 4. Construct the 90-Day Protocol (Dynamic based on AOS)
    const phases = getCorrectionPhases(currentAOS);

    return {
        gapScore,
        currentAOS,
        primaryErosion,
        secondaryRisks: model.oratory.redFlagsDetected || [],
        authorityMisalignment: misalignment,
        correctionPhases: phases
    };
}

function getCorrectionPhases(aos: AOS_Type) {
    switch (aos) {
        case 'AUTHORITY_COMMERCIALIZED':
            return {
                phase1: {
                    risk: "Percepción de oferta desesperada",
                    bias: "Esto parece un commodity barato",
                    correction: "Estabilización de Preciosidad (Eliminación de Promoción)"
                },
                phase2: {
                    risk: "Atracción de pacientes sensibles al precio",
                    bias: "¿Cuánto cuesta? (Shopper)",
                    correction: "Filtrado Automático por Autoridad Académica"
                },
                phase3: {
                    risk: "Retención baja por falta de lealtad",
                    bias: "Voy a buscar otra opción",
                    correction: "Custodia de Largo Plazo (Membresía Clínica)"
                }
            };
        case 'AUTHORITY_INVISIBLE':
            return {
                phase1: {
                    risk: "Inexistencia digital (Riesgo de Estafa)",
                    bias: "¿Este médico existe realmente?",
                    correction: "Infraestructura de Validación (Sede Digital)"
                },
                phase2: {
                    risk: "Comparación desventajosa con competencia",
                    bias: "El otro tiene mejor web",
                    correction: "Dominancia Visual Quirúrgica"
                },
                phase3: {
                    risk: "Dependencia del boca a boca (No escalable)",
                    bias: "Nadie lo conoce",
                    correction: "Ecosistema de Referencia Automática"
                }
            };
        default: // Chaotic/Hybrid
            return {
                phase1: {
                    risk: "Confusión de identidad",
                    bias: "No entiendo qué hace exactamente",
                    correction: "Unificación de Narrativa Clínica"
                },
                phase2: {
                    risk: "Fuga de prospectos calificados",
                    bias: "No me inspira seguridad total",
                    correction: "Blindaje de Objeciones (Evidencia)"
                },
                phase3: {
                    risk: "Estancamiento del ticket promedio",
                    bias: "Es igual al resto",
                    correction: "Posicionamiento de Alta Especialidad"
                }
            };
    }
}
