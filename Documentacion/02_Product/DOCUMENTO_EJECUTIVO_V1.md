# 📁 DOCUMENTO EJECUTIVO DE IMPLEMENTACIÓN

## COOLLABORA-CLINIC

**Versión: V1.0 – Directiva de Producto**
**Autoridad emisora: Dirección Estratégica Coollabora**

---

## 0. PRINCIPIO NO NEGOCIABLE (LEER PRIMERO)

Coollabora-Clinic **NO es**:

* Un SaaS de marketing
* Un dashboard de métricas
* Un chatbot médico
* Un sistema de generación de reportes

Coollabora-Clinic **ES**:

> Un **Sistema de Custodia de Autoridad Clínica**, donde la percepción del médico es tratada como un activo financiero supervisado.

Toda decisión técnica debe responder a esta premisa.
Si una funcionalidad no refuerza **dependencia, custodia o asimetría de criterio**, **NO se implementa**.

---

## 1. MODELO DE VERDAD (SINGLE SOURCE OF AUTHORITY)

### 1.1 Objeto obligatorio: `ClinicalTruthModel`

Debe existir un único modelo canónico por médico.

**NO se permiten scores sueltos, chats aislados ni reportes independientes.**

```ts
ClinicalTruthModel {
  doctorId
  status: observation | custody_active | custody_paused | audit_in_progress
  authorityScoreGlobal (INTEGER)
  authorityTrend: up | stable | down

  infrastructure {
    website: present | absent | obsolete
    socialChannels: [IG, TikTok, YT, Web, Others]
  }

  oratory {
    dominantTone: técnico | promocional | infantilizado | ambiguo
    redFlagsDetected: string[]
  }

  visual {
    congruenceLevel: alto | medio | crítico
    shockRisk: boolean
  }

  regulatoryRisk {
    ageRestriction: boolean
    promotionLanguageRisk: boolean
  }

  decisionsRegistry {
    allowed: string[]
    prohibited: string[]
  }

  humanFindings {
    auditorNotes: string
    hiddenChannelsDetected: string[]
    clientMysteryResult?: string
  }

  history {
    reports[]
    oracleInteractions[]
  }
}
```

👉 **TODOS los módulos (reporte, oráculo, admin, emails)** leen y escriben aquí.
👉 Nada vive fuera de este modelo.

---

## 2. AUDITORÍA HUMANA (NO ES OPCIONAL)

### 2.1 Regla de Oro

**Todo médico que paga recibe Auditoría Humana.**
No es upsell.
No es add-on.
Es parte del protocolo base.

---

### 2.2 Flujo obligatorio post-pago

1. Pago confirmado
2. Estado del expediente:

```ts
status = "audit_in_progress"
```

3. Se habilita **Auditor Humano**

---

### 2.3 Interfaz del Auditor (Admin)

Formulario estructurado. **NO texto libre sin estructura.**

Campos obligatorios:

* Canal observado (IG / TikTok / Web / WhatsApp / Secretaria)
* Hecho observado (qué ocurrió)
* Riesgo detectado (autoridad / regulatorio / financiero)
* Nota estratégica (lenguaje humano)

Opcional:

* Cliente oculto (sí/no)
* Transcripción resumida

---

### 2.4 Ingesta IA

El input humano:

* **NO se muestra crudo al médico**
* Se transforma en:

> “Hallazgos no detectables por sistemas automatizados”

---

## 3. REPORTE FINAL (RITUAL DE PODER)

### 3.1 El reporte NO se entrega completo de golpe

Debe tener:

1. Capa automatizada (ya existe)
2. Capa humana destacada como:

   > “Intervención de Custodia Clínica Supervisada”
3. Secciones explícitas:

   * “Este punto no puede ser evaluado por visión artificial”
   * “Este riesgo no es visible para métricas públicas”

---

### 3.2 Lenguaje obligatorio

* Clínico
* Descarnado
* No educativo
* No marketinero

Ejemplo válido:

> “Este patrón atrae pacientes sensibles al precio y erosiona el tiempo clínico del profesional.”

Ejemplo prohibido:

> “Podrías mejorar tu comunicación para atraer mejores pacientes.”

---

## 4. ORÁCULO DE JERARQUÍA CLÍNICA

### 4.1 NO es chat de ayuda

* UI: Terminal / Consola
* Sin emojis
* Sin tono amistoso

---

### 4.2 Prompt del Oráculo

Debe:

* Citar el `ClinicalTruthModel`
* Referenciar decisiones pasadas:

> “En el dictamen del 14/03 este tipo de mensaje fue clasificado como disonante.”

---

### 4.3 Persistencia (DEPENDENCIA)

Cada interacción:

* Se guarda
* Se etiqueta:

  * duda
  * objeción
  * miedo
  * validación previa a publicación
  * riesgo legal

Esto alimenta:

* Alertas
* Emails
* Upsells
* Intervención humana

---

## 5. ECONOMÍA DE LA INTENCIÓN (OBLIGATORIA)

El sistema debe:

* Analizar patrones de preguntas
* Detectar anticipación de necesidad

Ejemplo:

> Médico pregunta 3 veces sobre lenguaje → riesgo de publicación → alerta preventiva

Esto **NO es analytics**, es **predicción de comportamiento clínico-digital**.

---

## 6. MEMBRESÍA (CUSTODIA, NO ACCESO)

### 6.1 La membresía implica:

* Supervisión continua
* Historial protegido
* Capacidad de consulta

---

### 6.2 Cancelación = deterioro visible

Si cancela:

* Se congela el score
* Se desactiva el Oráculo
* El dashboard muestra:

> “Custodia Inactiva – Riesgo no supervisado”

**Nunca eliminar historial.**
La pérdida debe sentirse.

---

## 7. DASHBOARD MÉDICO (REGLAS)

Mostrar:

* Estado
* Tendencia
* Alertas clínicas

NO mostrar:

* Likes
* Followers
* Alcance
* Métricas de vanidad

---

## 8. DASHBOARD ADMIN (CONTROL REAL)

Debe mostrar:

* Médicos por nivel de riesgo
* Uso del Oráculo
* Señales de upsell
* Expedientes sin auditoría humana pendiente (ALERTA ROJA)

---

## 9. EMAILS (NO OPCIONAL)

Eventos que disparan emails:

* Reporte preliminar
* Hallazgo humano crítico
* Tendencia negativa silenciosa
* Inactividad del Oráculo
* Comparativa competitiva

Tono:

* Clínico
* Preventivo
* Nunca promocional

---

## 10. REGLA FINAL

Si una funcionalidad:

* No aumenta dependencia
* No aumenta percepción de riesgo controlado
* No refuerza autoridad asimétrica

👉 **NO SE IMPLEMENTA.**
