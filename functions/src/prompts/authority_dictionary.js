/**
 * DICCIONARIO DE AUTORIDAD CLÍNICA - Coollabora Clinical
 * Protocolos de detección de Erosión de Autoridad
 */

// ============================================
// PALABRAS ROJAS - Detección en Transcripciones
// ============================================
const PALABRAS_ROJAS = {
    erosion_critica: [
        "promoción", "promo", "oferta", "descuento",
        "barato", "económico", "precio bajo",
        "aprovecha", "no te lo pierdas", "última oportunidad",
        "escríbeme al DM", "mándame mensaje",
        "cupos limitados", "solo por hoy"
    ],
    banalización: [
        "cirugíita", "procedimientico", "cosita",
        "súper", "increíble", "genial", "wow",
        "chicos", "amigos", "gente"
    ],
    subordinacion: [
        "ayúdame compartiendo", "sígueme",
        "dale like", "comenta", "comparte",
        "gracias por ver", "los quiero"
    ]
};

// ============================================
// DICCIONARIO DE SUSTITUCIÓN DE ALTO ESTATUS
// ============================================
const REINGENIERIA_AUTORIDAD = {
    "oferta": "Apertura de Protocolo de Acceso",
    "promoción": "Apertura de Protocolo de Acceso",
    "promo": "Protocolo de Acceso Preferencial",
    "vender": "Adherencia al Tratamiento",
    "comprar": "Adherencia al Tratamiento",
    "ayudar": "Optimizar / Intervenir",
    "descuento": "Optimización de Estructura de Costos",
    "citas disponibles": "Habilitación de Espacios en Agenda Quirúrgica",
    "escríbeme al DM": "Canalizar a través de la Dirección Médica",
    "barato": "Eficiencia Presupuestaria",
    "económico": "Eficiencia Presupuestaria"
};

// ============================================
// MATRIZ DE HALLAZGOS VISUALES (Gemini Vision)
// ============================================
const HALLAZGOS_VISUALES = {
    incongruencia_semantica: {
        indicador: "Presencia de instrumental quirúrgico o tejido biológico en entornos no estériles",
        veredicto: "Riesgo de Percepción de Bioseguridad. La exposición de material clínico fuera de contexto degrada el rigor del protocolo."
    },
    trauma_visual_crudo: {
        indicador: "Sangre excesiva, incisiones abiertas o fluidos sin filtros de distanciamiento médico",
        veredicto: "Erosión por Respuesta Psicosomática. Activa el sistema de alerta de dolor en el paciente, bloqueando la decisión de compra."
    },
    banalizacion_estatus: {
        indicador: "Modelos en poses de influencer, sexualización excesiva o vestimenta no quirúrgica/formal",
        veredicto: "Deterioro de Jerarquía Académica. El especialista se homologa con un perfil comercial, perdiendo su posición de autoridad clínica."
    },
    indigencia_luminica: {
        indicador: "Sombras duras, iluminación amarillenta o fotos con ruido digital (baja resolución)",
        veredicto: "Vulnerabilidad de Infraestructura. La falta de calidad fotográfica se interpreta como falta de rigor en el quirófano."
    },
    desorden_arquitectonico: {
        indicador: "Fondos con cables, carpetas desordenadas, personal de salud distraído o entornos domésticos",
        veredicto: "Ruido de Autoridad. El cerebro del paciente premium asocia el desorden visual con una gestión clínica deficiente."
    }
};

// ============================================
// PROMPT MAESTRO - GEMINI VISION
// ============================================
const VISION_AUDITOR_PROMPT = `
Actúa como un **Auditor de Estatus para Cirugía de Élite**. 
Analiza la imagen adjunta buscando evidencias de **Incongruencia Clínica**.

1. Identifica si el contenido es 'Grotesco' (Trauma Visual sin contexto médico).
2. Evalúa si la estética del modelo o del entorno erosiona la **Jerarquía del Especialista**.
3. Clasifica el hallazgo como: 'Erosión Crítica', 'Vulnerabilidad Moderada' o 'Integridad de Autoridad'.

CATEGORÍAS DE HALLAZGO A DETECTAR:
- Incongruencia Semántica: instrumental quirúrgico en entornos no estériles
- Trauma Visual Crudo: sangre/incisiones sin filtros profesionales
- Banalización de Estatus: poses de influencer, sexualización
- Indigencia Lumínica: mala iluminación, ruido digital
- Desorden Arquitectónico: fondos desordenados, cables, entornos domésticos

**Restricción:** No uses adjetivos subjetivos como 'feo' o 'malo'. 
Usa terminología de **Arbitraje de Atención** y **Evidencia de Estatus**.

Responde en JSON:
{
    "hallazgo_tipo": "incongruencia_semantica | trauma_visual | banalizacion | indigencia_luminica | desorden | integridad",
    "nivel_erosion": 1-10,
    "clasificacion": "Erosión Crítica | Vulnerabilidad Moderada | Integridad de Autoridad",
    "veredicto": "Descripción técnica del hallazgo...",
    "elementos_detectados": ["lista", "de", "elementos", "problemáticos"]
}
`;

// ============================================
// PROMPT MAESTRO - ANÁLISIS DE TRANSCRIPCIÓN
// ============================================
const ORATORIA_AUDITOR_PROMPT = `
Actúa como un **Auditor de Oratoria Clínica de Élite**.
Analiza la siguiente transcripción de video buscando **Erosión de Autoridad**.

PALABRAS ROJAS A DETECTAR (señalan pérdida de estatus):
- Comerciales: promoción, oferta, descuento, barato, aprovecha
- Banalización: diminutivos (cirugíita, cosita), emojis verbales (súper, wow)
- Subordinación: ayúdame, sígueme, dale like, comenta

EVALÚA:
1. Densidad de Autoridad: ¿Habla como experto o como vendedor?
2. Muletillas: ¿Usa repeticiones que degradan el discurso?
3. Velocidad/Tono: ¿Suena dubitativo o afirmativo?

Responde en JSON:
{
    "densidad_autoridad": 1-10,
    "palabras_rojas_detectadas": ["palabra1", "palabra2"],
    "muletillas": ["muletilla1", "muletilla2"],
    "clasificacion": "Oratoria de Élite | Erosión Moderada | Subordinación Activa",
    "veredicto": "El especialista presenta...",
    "sugerencias_reingenieria": [
        {"original": "frase original", "sugerido": "frase de alto estatus"}
    ]
}
`;

module.exports = {
    PALABRAS_ROJAS,
    REINGENIERIA_AUTORIDAD,
    HALLAZGOS_VISUALES,
    VISION_AUDITOR_PROMPT,
    ORATORIA_AUDITOR_PROMPT
};
