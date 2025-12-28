/**
 * @file email_templates.js
 * @description Master repository for Authority Custody Emails & WhatsApp Support.
 * 
 * STRUCTURE:
 * - EPISODE 1: Variable based on Visibility State (A, B, C, D)
 * - EPISODE 2-5: Common Core Sequence (Authority Re-engineering Protocol)
 * - WHATSAPP: Supporting short messages (1 per milestone)
 */

const EMAIL_SEQUENCE = {
    // --- 1. EPISODE 1: THE BIOPSY (Variable by Visibility State) ---
    INITIAL: {
        FULL_VISIBLE: { // State A: Web + Instagram
            subject: "Su autoridad ya fue evaluada (sin que usted interviniera)",
            body: `Doctor/a {{Nombre}},

Durante el análisis de su ecosistema digital —web, presencia pública y puntos de contacto visibles— detectamos **fugas estructurales** que no afectan su capacidad médica ni su criterio clínico.

Evalúan algo distinto —y hoy determinante—: **cómo un paciente de alto valor percibe su autoridad antes de decidir si confía o no en usted**.

Estas fugas no son evidentes. No aparecen en Meta Ads. No las muestra Google Analytics.

Adjunto encontrará su **Expediente de Erosión de Autoridad**.

La mayoría de los médicos cree que el problema está en la publicidad o en el volumen de leads.

En el próximo correo le mostraré el **punto exacto** donde un paciente de alto valor decide cerrar su pestaña y contactar a otro profesional —sin dejar rastro.

— Equipo Coollabora`
        },

        SOCIAL_ONLY: { // State B: Instagram Only
            subject: "Su autoridad es visible, pero no está estructurada",
            body: `Doctor/a {{Nombre}},

Cuando la autoridad clínica depende de un único canal visible, pequeñas inconsistencias generan una **erosión silenciosa de confianza** antes del primer contacto.

Este análisis **no evalúa su capacidad médica ni sus resultados clínicos**. Evalúa cómo un paciente de alto valor interpreta su autoridad **antes de escribirle**.

Adjunto encontrará su **Expediente de Erosión de Autoridad**.

La mayoría de los médicos cree que el problema está en publicar más o anunciar mejor.

En el próximo correo le mostraré el **momento exacto** en que un paciente de alto valor decide no avanzar —sin decir nada.

— Equipo Coollabora`
        },

        WEB_ONLY: { // State C: Web Only
            subject: "Su autoridad existe, pero no aparece donde el paciente decide",
            body: `Doctor/a {{Nombre}},

En entornos donde la autoridad se construye principalmente desde una web estática, el paciente moderno completa su decisión en otros espacios que no siempre están controlados.

Este análisis **no evalúa su nivel clínico**. Evalúa la **percepción de autoridad previa a la consulta**, donde hoy se pierden decisiones sin dejar huella.

Adjunto encontrará su **Expediente de Erosión de Autoridad**.

La mayoría de los médicos asume que una buena web es suficiente.

Mañana le mostraré dónde ocurre realmente la decisión del paciente de alto valor.

— Equipo Coollabora`
        },

        RESTRICTED: { // State D: Restricted / Ghost
            subject: "Actualmente usted no es evaluable",
            body: `Doctor/a {{Nombre}},

Cuando la información pública es limitada o fragmentada, el paciente de alto valor **no interpreta exclusividad**. Interpreta **incertidumbre**.

Este análisis **no evalúa medicina ni resultados**. Evalúa lo que ocurre cuando un paciente intenta entender su autoridad **y no logra completarla**.

Adjunto encontrará su **Expediente de Erosión de Autoridad**.

La mayoría de los médicos asume que el silencio protege el prestigio.

Mañana le mostraré por qué, en digital, ese silencio suele jugar en contra.

— Equipo Coollabora`
        }
    },

    // --- 2. CORE SEQUENCE (Episodes 2-5) ---
    CORE: [
        {
            day: 2,
            id: "EPISODE_2",
            subject: "El asesino silencioso",
            body: `Doctor/a {{Nombre}},

Tras analizar **más de 5.000 interacciones reales 1:1** en el sector salud/estético y **millones en decisiones cerradas**, identificamos un patrón que se repite incluso en clínicas con excelente reputación médica.

El paciente de alto valor **no busca información**.
Busca **certeza de estatus y coherencia**.

Cuando existe una brecha entre:

* el precio del procedimiento
* y la percepción digital del entorno

el cerebro del paciente interpreta **riesgo**, no oportunidad.

A esto lo llamamos **Disonancia de Autoridad**.

No es un problema de marketing.
Es un problema de **arquitectura de confianza**.

En el próximo mensaje le mostraré el **Protocolo de Reingeniería de Autoridad** y sus **tres pilares estructurales**.

— Equipo Coollabora`
        },
        {
            day: 3,
            id: "EPISODE_3",
            subject: "El Protocolo",
            body: `Doctor/a {{Nombre}},

Ahora ya tiene claridad sobre el problema.

No es publicidad.
No es tráfico.
No es su criterio clínico.

Es **arquitectura de autoridad previa a la consulta**.

El **Protocolo de Reingeniería de Autoridad** se sostiene sobre tres pilares no negociables:

**1. Coherencia de Estatus**
Cada punto de contacto debe comunicar el mismo nivel de jerarquía que el precio del procedimiento.

**2. Control del Relato Previo**
El paciente decide antes de hablar con usted. Ese relato debe estar diseñado, no improvisado.

**3. Diagnóstico Continuo**
La autoridad no se lanza. Se monitorea.

Este protocolo **no se ejecuta manualmente**.
Por eso fue codificado en un sistema.

Un entorno donde:

* la autoridad se evalúa de forma continua
* las fugas se detectan antes de impactar agenda
* las decisiones dejan de ser reactivas

Si considera que su práctica opera en ese nivel, aquí es donde se habilita el acceso al sistema.

— Equipo Coollabora`
        },
        {
            day: 4,
            id: "EPISODE_4",
            subject: "Cuándo este sistema no es para usted",
            body: `Doctor/a {{Nombre}},

Este protocolo **no es para todos los médicos**.

No es recomendable si:

* busca volumen y no jerarquía
* espera creatividad libre o protagonismo personal
* cree que una agencia puede sostener la autoridad
* piensa que el problema se resuelve solo con anuncios

Este sistema **sí tiene sentido** si entiende que:

* el paciente decide antes de contactar
* la percepción de estatus influye en la decisión
* la autoridad se diseña y se mide

En el próximo mensaje verá un **caso arquetípico** que ilustra este patrón.

— Equipo Coollabora`
        },
        {
            day: 5,
            id: "EPISODE_5", // Final Episode
            subject: "Caso Arquetípico",
            body: `Doctor/a {{Nombre}},

Este no es un caso clínico.
No es un testimonio.
No es una promesa.

Es un **patrón operativo**.

Un profesional con alta competencia médica, precios premium y agenda irregular.

El problema no estaba en su medicina.
Estaba en la **disonancia entre precio y percepción**.

Al corregir la arquitectura de autoridad:

* el volumen bajó
* la fricción disminuyó
* la decisión se volvió más rápida

No se cambió al médico.
Se corrigió el entorno.

Ese es el efecto del sistema.

— Equipo Coollabora`
        }
    ],

    // --- 3. RE-ACTIVATION (After 30-60 days of inactivity) ---
    REACTIVATION: [
        {
            day: 30,
            id: "REACTIVATION_1",
            subject: "El caso siguió su curso",
            body: `Doctor/a {{Nombre}},

Este mensaje no es un recordatorio.

Es una actualización.

Desde su auditoría inicial, el sistema siguió procesando patrones similares al suyo.
Algunos médicos decidieron corregir su arquitectura de autoridad.
Otros no intervinieron.

El resultado fue consistente:

* La disonancia no se corrige sola.
* Tampoco se agrava de forma visible.
* Simplemente **sigue drenando decisión**.

La mayoría de pérdidas no se perciben como errores.
Se perciben como *“agenda normal”*.

Este sistema existe precisamente para detectar lo que **no genera alertas**, pero sí consecuencias.

— Equipo Coollabora`
        },
        {
            day: 45,
            id: "REACTIVATION_2",
            subject: "El costo de la no-decisión",
            body: `Doctor/a {{Nombre}},

En medicina, no intervenir también es una decisión.

En autoridad clínica digital ocurre lo mismo.

Cuando una arquitectura queda en estado intermedio:

* no es caótica,
* no es deficiente,
* pero **no está alineada al ticket ni al estatus**,

el paciente de alto valor **no confronta**.
Simplemente elige otra opción.

No deja quejas.
No deja objeciones.
No deja aprendizaje.

Solo deja una agenda que *podría ser más limpia*.

Este es el tipo de problema que solo se corrige cuando se decide **entrar al sistema**, no cuando se espera claridad externa.

— Equipo Coollabora`
        },
        {
            day: 60,
            id: "REACTIVATION_3", // Silent Institutional Close
            subject: "Cierre Institucional",
            body: `Doctor/a {{Nombre}},

Este será el último mensaje relacionado con su auditoría.

No porque el problema desaparezca,
sino porque insistir **rompe la lógica del sistema**.

Coollabora no fue diseñado para convencer.
Fue diseñado para operar con médicos que:

* reconocen patrones,
* toman decisiones estructurales,
* y entienden que la autoridad también se custodia.

El acceso permanece controlado.
No se empuja.
No se reactiva manualmente.

Si en algún punto considera que su práctica requiere **criterio continuo y no correcciones puntuales**, sabrá dónde encontrar el sistema.

— Equipo Coollabora`
        }
    ],

    // --- 4. WHATSAPP SUPPORT (Short, Non-intrusive) ---
    WHATSAPP: [
        {
            trigger: "POST_EP1",
            id: "WA_1",
            body: `Doctor/a {{Nombre}},

Le escribo solo para confirmar que su **Expediente de Erosión de Autoridad** fue entregado correctamente.

No requiere respuesta.

— Coollabora`
        },
        {
            trigger: "POST_EP3",
            id: "WA_2",
            body: `Doctor/a {{Nombre}},

El protocolo que mencionamos en el último correo **no se ejecuta manualmente**.

Por eso algunos médicos lo entienden…
y otros deciden entrar al sistema.

— Coollabora`
        },
        {
            trigger: "POST_EP4",
            id: "WA_3",
            body: `Doctor/a {{Nombre}},

Aclaración importante:
este sistema **no es recomendable** para todos los médicos.

Dejarlo pasar también es una decisión válida.

— Coollabora`
        },
        {
            trigger: "DAY_30", // Gentle Reactivation
            id: "WA_4",
            body: `Doctor/a {{Nombre}},

Su auditoría sigue registrada en el sistema.

Algunos patrones no cambian con el tiempo,
solo se vuelven invisibles.

— Coollabora`
        },
        {
            trigger: "DAY_60", // Silent Close
            id: "WA_5",
            body: `Doctor/a {{Nombre}},

Este será el último mensaje por este canal.

Coollabora no insiste.
Opera cuando el médico está listo.

— Coollabora`
        }
    ]
};

// --- CTA SYSTEM BY FILE STATUS (Logic Definitiva) ---
const CTA_DEFINITIONS = {
    OBSERVATION_MODE: {
        mainBtn: "Ver Expediente Clínico",
        microcopy: "Lectura automatizada · Sin intervención aplicada",
        secondary: "¿Cómo se activa la custodia clínica?" // Optional link
    },
    ELIGIBLE_FOR_CUSTODY: {
        mainBtn: "Habilitar Protocolo de Custodia",
        microcopy: "Acceso controlado · Requiere activación consciente",
        secondary: "Mantener expediente en observación" // Low friction link
    },
    CUSTODY_ACTIVE: {
        mainBtn: "Acceder al Panel de Custodia",
        microcopy: "Monitoreo activo · Historial preservado",
        contextualBtn: "Consultar al Oráculo Clínico" // Inside dashboard
    },
    CUSTODY_PAUSED: {
        mainBtn: "Reactivar Custodia Clínica",
        microcopy: "Su historial y decisiones previas permanecen intactas",
        secondary: "Revisar último dictamen registrado"
    }
};

module.exports = { EMAIL_SEQUENCE, CTA_DEFINITIONS };
