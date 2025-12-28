import { Share2, Download, ChevronDown, Lock, Shield, CheckCircle, AlertTriangle, FileText, Activity, TrendingDown, ClipboardList, Eye, Stethoscope, ShieldAlert } from 'lucide-react';
import { calculateAuthorityGap } from '../../services/match_algorithm';
import ProjectionTimeline from './ProjectionTimeline';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import SampleReportModal from './SampleReportModal';
import ManualReviewPlaceholder from './ManualReviewPlaceholder';

const ClinicalReportView = ({ report, onAction }) => {
    const [showSample, setShowSample] = useState(false);
    const [authorityGap, setAuthorityGap] = useState(null);

    useEffect(() => {
        if (report) {
            try {
                // Adapt report to ClinicalTruthModel for the Algo
                // If report structure differs slighty from Model, we map it here.
                // Assuming report IS ClinicalTruthModel-like or contains the fields.
                // If report comes from Firestore (generateOracleRuling), it might be inside report.clinicalTruthModel or root.
                // We map safely.
                const vectorModel = {
                    authorityScoreGlobal: report.authorityScore || 0,
                    infrastructure: report.infrastructure || { website: 'absent' },
                    oratory: report.oratory || { dominantTone: 'ambiguo' },
                    regulatoryRisk: report.regulatoryRisk || { ageRestriction: false, promotionLanguageRisk: false },
                    visual: report.visual || { congruenceLevel: 'medio' }
                };

                const gapResult = calculateAuthorityGap(vectorModel);
                setAuthorityGap(gapResult);
            } catch (e) {
                console.error("Error calculating Authority Gap", e);
            }
        }
    }, [report]);
    const [imgError, setImgError] = useState(false);
    const [isDevUnlocked, setIsDevUnlocked] = useState(false);

    // Debug para verificar estado
    console.log("ClinicalReportView Render. Mode:", isDevUnlocked ? "PREMIUM" : "LOCKED");

    if (!report) return null;

    const { identity, visionAnalysis, authorityScore } = report;
    const isRestricted = report.restrictionType === 'AGE_RESTRICTED' || report.restrictionType === 'PRIVATE';

    // Helper para determinar color/texto según score
    const getScoreStatus = (score) => {
        if (score === null || score === undefined) return { label: "NO DISPONIBLE", color: "text-slate-400", bg: "bg-slate-100" };
        if (score <= 4) return { label: "CRÍTICO", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
        if (score <= 7) return { label: "EN RIESGO", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
        return { label: "OPTIMIZADO", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
    };

    const globalStatus = getScoreStatus(authorityScore);
    const brandStatus = getScoreStatus(visionAnalysis?.brandIntegrity?.score);
    const infraStatus = getScoreStatus(visionAnalysis?.visualInfrastructure?.score);

    // Determinar si hay sitio web para adaptar los mensajes de error en Fase 2
    const hasWebsite = !!report?.visualEvidence?.websiteScreenshot;

    return (
        <div className="max-w-4xl mx-auto w-full bg-slate-50 min-h-screen font-sans">

            {/* HEADER CLÍNICO */}
            <div className="bg-white border-b border-slate-200 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Expediente de Autoridad Clínica</span>
                    </div>
                    <h1 className="font-serif text-xl md:text-2xl font-bold text-surgical-gray">
                        Informe Preliminar
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estado</p>
                    {isRestricted ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                            <Activity size={12} className="text-slate-500" />
                            <span className="text-xs font-medium text-slate-600">Lectura Automatizada Preliminar</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                            <Eye size={12} className="text-slate-500" />
                            <span className="text-xs font-medium text-slate-600">Lectura Automatizada / Observación Pasiva</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 md:p-10 space-y-12">

                {/* 1. IDENTIFICACIÓN */}
                <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Activity size={14} /> Identificación del Profesional
                    </h3>

                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {!imgError && identity?.profilePic ? (
                                <img
                                    src={`https://wsrv.nl/?url=${encodeURIComponent(identity.profilePic)}&w=150&h=150&output=jpg`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <span className="text-2xl">🩺</span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-surgical-gray mb-1">
                                {identity?.handle || "@usuario"}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium mb-1">
                                {identity?.fullName || "Especialista Validado"}
                            </p>
                            <p className="text-xs text-slate-400 font-mono">
                                ID de Lectura: {report.auditId || "SYS-AUTO-001"}
                            </p>
                        </div>
                    </div>
                </section>



                {/* CONTENIDO PRINCIPAL: CONDICIONAL SEGÚN RESTRICCIÓN */}
                {isRestricted ? (
                    /* VISTA RESTRINGIDA (AUDITORÍA HUMANA) */
                    <div className="py-8 space-y-12">

                        {/* 1. BANNER DE ESTADO TÉCNICO (EXCLUSIÓN ESTRATÉGICA) */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="flex-1">
                                <h4 className="flex items-center gap-2 font-bold text-slate-700 uppercase tracking-wide text-sm mb-2">
                                    <AlertTriangle size={16} className="text-amber-500" /> Estado del Expediente
                                </h4>
                                <div className="flex gap-4 text-xs font-mono text-slate-500 mb-2">
                                    <span>Estado: <strong className="text-slate-700">Lectura automatizada preliminar</strong></span>
                                    <span className="text-slate-300">|</span>
                                    <span>Nivel: <strong className="text-slate-700">Parcial</strong></span>
                                </div>
                                <p className="text-xs text-slate-500 italic">
                                    "Algunos módulos permanecen inactivos hasta completar la validación del expediente."
                                </p>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-slate-200"></div>
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded text-xs font-bold text-amber-700 border border-amber-200">
                                    <Activity size={12} /> Proceso de Validación Activo
                                </span>
                            </div>
                        </div>
                        <section className="text-center">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Índice de Autoridad Global</h3>
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-amber-500 animate-spin flex items-center justify-center">
                                    <Lock size={32} className="text-amber-500" />
                                </div>
                                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                                    Puntaje Bloqueado
                                </div>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                    Verificación de Evidencia Protegida Pendiente
                                </p>
                            </div>
                        </section>

                        {/* 3. MATRIZ DE VULNERABILIDAD (DISEÑO TARJETAS) */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldAlert className="text-red-600" size={20} />
                                <h3 className="text-sm font-bold text-surgical-gray uppercase tracking-widest">Matriz de Vulnerabilidad Estructural</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* CARD 1: WEB VULNERABILITY */}
                                <div className={`bg-white p-6 rounded-xl border-l-4 shadow-sm ${hasWebsite ? 'border-l-amber-500' : 'border-l-red-500'} border border-slate-100`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-700">1️⃣ Infraestructura Central</h4>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${hasWebsite ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                                            {hasWebsite ? 'AUDITORÍA PENDIENTE' : 'CRÍTICO'}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Hallazgo Principal</p>
                                            <p className="text-sm text-slate-700 leading-relaxed font-bold">
                                                {hasWebsite ? 'Nodo Web Detectado (Estado: No Verificado)' : 'Ausencia de Nodo Central de Autoridad (Web).'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Diagnóstico Sistémico</p>
                                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                                {hasWebsite
                                                    ? '"Aunque existe infraestructura, la restricción en redes impide certificar la transferencia efectiva de autoridad. Se requiere validación manual de conversión."'
                                                    : '"El sistema detecta una dependencia absoluta de terceros (Meta), lo que genera una zona de silencio estratégico y riesgo de censura."'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CARD 2: BLINDAJE +18 */}
                                <div className={`bg-white p-6 rounded-xl border-l-4 shadow-sm border-l-amber-500 border border-slate-100`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-700">2️⃣ Protocolo de Acceso</h4>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase bg-amber-50 text-amber-700`}>
                                            EN RIESGO
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Hallazgo Principal</p>
                                            <p className="text-sm text-slate-700 leading-relaxed font-bold">
                                                Blindaje de Contenido Sensible (+18) Activo.
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Diagnóstico Sistémico</p>
                                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                                {hasWebsite
                                                    ? '"La restricción legal actúa como escudo, pero sin validación de tráfico web, el flujo de pacientes podría estar interrumpiéndose en la fase de descubrimiento."'
                                                    : '"La restricción legal actúa como escudo, pero sin web se convierte en agujero negro de autoridad. El flujo de pacientes se interrumpe en la fase de descubrimiento."'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. IMPACTO ECONOMICO (VISIBLE Y EXPLÍCITO) */}
                        <section className={`bg-red-50 border border-red-100 p-6 rounded-xl relative overflow-hidden`}>
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingDown className="text-red-700" size={20} />
                                <h3 className="text-sm font-bold text-red-800 uppercase tracking-widest">Impacto Económico Proyectado</h3>
                            </div>
                            <div className="md:flex items-center justify-between gap-8 relative z-10">
                                <div className="mb-4 md:mb-0">
                                    <p className="text-xs font-bold text-red-800/70 uppercase tracking-widest mb-1">
                                        {hasWebsite ? 'Riesgo de Fuga de Tráfico' : 'Pérdida por Indigencia Digital'}
                                    </p>
                                    <p className="text-3xl md:text-3xl font-serif font-bold text-red-700 mb-2">1 – 2 procedimientos</p>
                                    <p className="text-sm text-red-800 font-medium">mensuales (Estimación base)</p>
                                </div>
                                <div className="max-w-md">
                                    <p className="text-sm text-red-900/80 leading-relaxed italic border-l-2 border-red-300 pl-4">
                                        {hasWebsite
                                            ? '"La opacidad en Instagram impide medir la calidad del tráfico que llega a su web. Sin auditoría, asumimos una ineficiencia en la conversión de pacientes High-Ticket."'
                                            : '"Al no poseer infraestructura web y tener el acceso restringido, la validación del paciente premium falla sistemáticamente, independientemente de su capacidad quirúrgica."'
                                        }
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* [NUEVO] IMPACTO CLÍNICO EN CONSULTA (DOLOR PERSONAL) */}
                        <section className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Stethoscope className="text-slate-600" size={20} />
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Impacto Clínico en Consulta</h3>
                            </div>
                            <div className="flex gap-4">
                                <div className="hidden md:block w-1 bg-slate-300 rounded-full h-auto"></div>
                                <div>
                                    <p className="text-sm text-slate-600 leading-relaxed italic mb-2">
                                        {hasWebsite
                                            ? <span>"Aunque existe web, la <strong className='text-slate-800'>desconexión visual</strong> con Instagram suele generar dudas en la fase de investigación. El paciente navega pero no convierte al no encontrar coherencia narrativa."</span>
                                            : <span>"En perfiles con esta configuración, el sistema detecta un patrón recurrente: consultas dominadas por pacientes que <strong className='text-slate-800'>preguntan precio sin contexto</strong>, comparan procedimientos como <strong className='text-slate-800'>commodities</strong> o abandonan el proceso al solicitar mayor explicación."</span>
                                        }
                                    </p>
                                    <p className="text-xs text-slate-400 font-bold uppercase mt-2">
                                        Diagnóstico de Calidad de Paciente: Baja
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 5. EVIDENCIA BLOQUEADA (BLUR) */}
                        <div className="relative pointer-events-none select-none">
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                                <Lock size={48} className="text-slate-400 mb-4" />
                                <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl">
                                    Evidencia Visual Bajo Custodia
                                </div>
                            </div>

                            <div className="filter blur-sm opacity-50 space-y-8 grayscale">
                                <section className="grid md:grid-cols-2 gap-8">
                                    <div className="h-48 bg-slate-200 rounded-lg border border-slate-300"></div>
                                    <div className="h-48 bg-slate-200 rounded-lg border border-slate-300"></div>
                                </section>
                            </div>
                        </div>

                        {/* [NUEVO] NOTA DE AUDITORÍA HUMANA (ANTICIPACIÓN) */}
                        <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg flex flex-col md:flex-row gap-4 items-start">
                            <div className="bg-blue-100 p-2 rounded-full shrink-0">
                                <ClipboardList size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-2">
                                    Nota de Auditoría Humana (Vista Parcial)
                                </h4>
                                <p className="text-sm text-blue-800 leading-relaxed mb-3">
                                    En casos con blindaje +18 y ausencia de web, la auditoría supervisada suele detectar hallazgos estructurales profundos:
                                </p>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-blue-800/80">
                                    <li>Incongruencias entre lenguaje clínico y narrativa visual.</li>
                                    <li>Secuencias de contenido que activan <strong>curiosidad</strong> en lugar de <strong>confianza clínica</strong>.</li>
                                    <li>Señales no verbales que atraen pacientes transaccionales en lugar de decisores quirúrgicos.</li>
                                </ul>
                            </div>
                        </div>


                        {/* 6. ESTADO DE PROFUNDIDAD DEL DIAGNÓSTICO */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden max-w-2xl mx-auto">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Profundidad del Diagnóstico</h3>
                                <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded font-mono">SYS-CHK-404</span>
                            </div>
                            <div className="p-2">
                                <div className="space-y-1">
                                    {/* Item Active */}
                                    <div className="flex items-center justify-between p-3 rounded bg-white border border-slate-100">
                                        <span className="text-sm font-medium text-slate-700">Lectura automatizada</span>
                                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                            <CheckCircle size={10} /> Activa
                                        </span>
                                    </div>
                                    {/* Item In Process */}
                                    <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-100">
                                        <span className="text-sm font-medium text-slate-600">Evidencia visual comparativa</span>
                                        <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            <div className="w-2 h-2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div> En proceso
                                        </span>
                                    </div>
                                    <div className="px-3 pb-2">
                                        <p className="text-[10px] text-blue-500 italic flex items-center gap-1">
                                            <ArrowRight size={8} /> "El Anexo de Evidencia Clínica está siendo procesado bajo supervisión avanzada"
                                        </p>
                                    </div>

                                    {/* Items Inactive */}
                                    {['Proyección de deterioro', 'Benchmark competitivo', 'Alertas clínicas'].map((item) => (
                                        <div key={item} className="flex items-center justify-between p-3 rounded opacity-60">
                                            <span className="text-sm text-slate-500">{item}</span>
                                            <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                <Lock size={10} /> Inactiva
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200">
                                <p className="text-[10px] text-slate-400 text-center italic">
                                    "Este informe muestra únicamente la capa superficial del expediente. Los módulos predictivos no se activan sin custodia clínica."
                                </p>
                            </div>
                        </div>

                        {/* 7. CTA O VISTA PREMIUM (DEPENDIENDO DE ESTADO DE PAGO) */}
                        {!isDevUnlocked ? (
                            <div className="mt-8 text-center pt-8 border-t border-slate-200">
                                <button
                                    onClick={onAction}
                                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-cobalt-blue text-white font-bold uppercase tracking-widest rounded-xl shadow-2xl hover:bg-blue-900 transition-all w-full md:w-auto transform hover:scale-[1.02]"
                                >
                                    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-colors rounded-xl"></div>
                                    <span className="text-blue-200 group-hover:text-white transition-colors">🔓</span>
                                    <span>Solicitar Liberación del Expediente</span>
                                </button>
                                <p className="text-xs text-slate-400 mt-4">
                                    Requerido para activar módulos supervisados y completar el diagnóstico.
                                </p>
                            </div>
                        ) : (
                            /* VISTA PREMIUM (DESBLOQUEADA) */
                            <>
                                {/* SECCIÓN: DICTAMEN DEL ORÁCULO (JURISPRUDENCIA CLÍNICA) */}
                                {report.oracleRuling && (
                                    <div className="bg-slate-900 text-white p-8 rounded-xl relative overflow-hidden shadow-2xl mb-8 border border-slate-700">
                                        {/* TEXTURE OVERLAY */}
                                        <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] [background-size:20px_20px] [background-position:0_0,10px_10px]"></div>

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white p-2 rounded-sm">
                                                        <ShieldAlert className="text-slate-900" size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-serif text-xl font-bold tracking-wider text-slate-100 uppercase">
                                                            Dictamen Vinculante
                                                        </h3>
                                                        <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                                                            Jurisprudencia Clínica Digital • ID: {report.auditId?.slice(0, 8)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right hidden md:block">
                                                    <div className="inline-block px-3 py-1 border border-slate-600 rounded bg-slate-800 text-xs font-mono text-slate-300">
                                                        SENTENCIA FINAL
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-12 gap-8">
                                                {/* COL 1: TITULAR Y DICTAMEN */}
                                                <div className="md:col-span-12 lg:col-span-8 space-y-6">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Fallo del Tribunal de Autoridad</p>
                                                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 leading-tight">
                                                            "{report.oracleRuling.titular}"
                                                        </h2>
                                                        <p className="text-slate-300 text-lg leading-relaxed font-light border-l-2 border-slate-600 pl-4">
                                                            {report.oracleRuling.dictamen}
                                                        </p>
                                                    </div>

                                                    {/* FUNDAMENTO */}
                                                    <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                            <FileText size={12} /> Fundamento de Evidencia
                                                        </p>
                                                        <p className="text-sm text-slate-400 font-mono">
                                                            {report.oracleRuling.fundamento_tecnico}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* COL 2: RIESGO VITAL */}
                                                <div className="md:col-span-12 lg:col-span-4 flex flex-col justify-between bg-white text-slate-900 rounded-lg p-6">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                                                            Consecuencia Directa
                                                        </p>
                                                        <div className="flex items-start gap-3 mb-4">
                                                            <TrendingDown className="text-red-600 shrink-0 mt-1" size={24} />
                                                            <p className="text-lg font-bold text-red-700 leading-snug">
                                                                {report.oracleRuling.riesgo_financiero}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Precedente Citado</p>
                                                        <p className="text-xs text-slate-600 italic">
                                                            {report.oracleRuling.precedente_citado}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SECCIÓN DE INTERVENCIÓN HUMANA (NUEVO MODELO DE VERDAD) */}
                                {report.manualEvidence?.structuredFindings ? (
                                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl relative overflow-hidden shadow-sm">
                                        <div className="flex items-center gap-3 mb-6 border-b border-amber-200 pb-4">
                                            <div className="bg-amber-100 p-2 rounded-full">
                                                <ClipboardList className="text-amber-700" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-amber-900 uppercase tracking-widest">
                                                    Intervención de Custodia Clínica
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                                    <p className="text-xs text-amber-700 font-mono">
                                                        AUDITORÍA HUMANA: {report.manualEvidence.structuredFindings.riskType?.toUpperCase() || "RIESGO DE AUTORIDAD"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* HECHO FACTUAL */}
                                            <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                                                <h4 className="text-xs font-bold text-amber-800/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                    <Eye size={12} /> Hecho Observado (Canal: {report.manualEvidence.structuredFindings.channel})
                                                </h4>
                                                <p className="text-amber-900 font-medium leading-relaxed">
                                                    "{report.manualEvidence.structuredFindings.fact}"
                                                </p>
                                            </div>

                                            {/* NOTA ESTRATÉGICA */}
                                            <div className="bg-white p-5 rounded-lg border-l-4 border-amber-500 shadow-sm">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                    <Stethoscope size={12} /> Interpretación de Impacto
                                                </h4>
                                                <p className="text-slate-700 leading-relaxed italic">
                                                    "{report.manualEvidence.structuredFindings.strategicNote}"
                                                </p>
                                            </div>

                                            {/* FOOTER DE VALIDACIÓN */}
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-[10px] text-amber-700/50 uppercase font-bold tracking-widest">
                                                    Validado por: Auditor Senior (Human-ID: 001)
                                                </span>
                                                {report.manualEvidence.structuredFindings.isHiddenClient && (
                                                    <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                                        Mystery Shopper
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* FALLBACK SI AÚN ESTÁ EN PROCESO */
                                    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Activity size={100} className="text-emerald-900" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-emerald-100 p-2 rounded-full">
                                                    <CheckCircle className="text-emerald-600" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-emerald-900">Membresía Activa: Custodia Habilitada</h3>
                                                    <p className="text-xs text-emerald-700 font-mono">ID: PREM-8829-X (Fase 1)</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-emerald-100">
                                                <p className="text-sm text-emerald-900 leading-relaxed">
                                                    <strong>Acceso Total Concedido.</strong> El equipo de ingeniería clínica está procesando la "Proyección de 90 días". Recibirá la alerta en su Dashboard en 48 horas.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SECCIÓN DE PROTOCOLO DESBLOQUEADO (SIMULACIÓN DE CONTENIDO) */}
                                <div className="border-t border-slate-200 pt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Lock className="text-slate-300" size={20} />
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest line-through">Contenido Bloqueado</h3>
                                        <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase ml-2">Acceso Concedido</span>
                                    </div>

                                    <div className="prose prose-sm prose-slate max-w-none grayscale opacity-70">
                                        <p className="italic text-slate-500">
                                            [Vista Previa del Protocolo de Reingeniería]
                                        </p>
                                        <h4>1. Corrección de Fuga de Autoridad Visual</h4>
                                        <p>Se ha detectado una disonancia crítica en la paleta cromática de su perfil...</p>
                                        <h4>2. Nuevo Hero Message</h4>
                                        <p>Propuesta de valor sugerida basada en su autoridad clínica real...</p>
                                        <div className="bg-slate-100 p-4 rounded text-center my-4">
                                            <p className="font-bold text-slate-600">El reporte completo detallado estará disponible aquí en breve.</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* BOTÓN DE EJEMPLO DE EXPEDIENTE */}
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={() => setShowSample(true)}
                                className="group flex flex-col items-center gap-1 px-6 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-cobalt-blue/50 hover:shadow-md transition-all"
                            >
                                <span className="flex items-center gap-2 text-sm font-bold text-surgical-gray group-hover:text-cobalt-blue transition-colors">
                                    <FileText size={16} /> 🔎 Ver Expediente Clínico Bajo Custodia (Ejemplo)
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono tracking-wide">Ejemplo ilustrativo del informe completo tras la liberación del expediente</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* VISTA COMPLETA (AUTOMATIZADA) */
                    <>
                        {/* 2. SCORE GLOBAL */}
                        <section className="text-center">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Índice de Autoridad Global</h3>
                            <div className="inline-block relative">
                                <div className={`text-7xl md:text-8xl font-serif font-bold ${globalStatus.color} tabular-nums tracking-tighter`}>
                                    {authorityScore !== null ? Math.ceil(authorityScore) : "-"}
                                    <span className="text-2xl md:text-3xl text-slate-300 font-light">/10</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 max-w-lg mx-auto mt-4 leading-relaxed">
                                Este valor <strong>no representa su capacidad clínica</strong>.<br />
                                Representa cómo es percibida su autoridad antes del contacto humano.
                            </p>
                        </section>

                        {/* 3. MATRIZ DE RIESGO */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="text-amber-500" size={20} />
                                <h3 className="text-sm font-bold text-surgical-gray uppercase tracking-widest">Matriz de Riesgo Detectado</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* BRAND INTEGRITY */}
                                <div className={`bg-white p-6 rounded-xl border-l-4 shadow-sm ${brandStatus.border} ${brandStatus.bg === 'bg-slate-100' ? 'border-l-slate-300' : ''}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-700">1️⃣ Integridad de Marca Clínica</h4>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${brandStatus.bg} ${brandStatus.color}`}>
                                            {brandStatus.label}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <span className={`text-3xl font-serif font-bold ${brandStatus.color}`}>
                                            {visionAnalysis?.brandIntegrity?.score ?? "-"}
                                        </span>
                                        <span className="text-xs text-slate-400"> / 10</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Hallazgo Principal</p>
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {visionAnalysis?.brandIntegrity?.verdict || "La señal clínica no se transmite de forma continua. El sistema detecta interrupciones entre narrativa médica y personal."}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Implicación Clínica</p>
                                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                                "El paciente de alto valor experimenta disonancia de autoridad, aumentando la probabilidad de abandono silencioso."
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* VISUAL INFRASTRUCTURE */}
                                <div className={`bg-white p-6 rounded-xl border-l-4 shadow-sm ${infraStatus.border} ${infraStatus.bg === 'bg-slate-100' ? 'border-l-slate-300' : ''}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-700">2️⃣ Coherencia de Infraestructura</h4>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${infraStatus.bg} ${infraStatus.color}`}>
                                            {infraStatus.label}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <span className={`text-3xl font-serif font-bold ${infraStatus.color}`}>
                                            {visionAnalysis?.visualInfrastructure?.score ?? "-"}
                                        </span>
                                        <span className="text-xs text-slate-400"> / 10</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Hallazgo Principal</p>
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {visionAnalysis?.visualInfrastructure?.verdict || "La arquitectura visual no respalda el nivel técnico del procedimiento ofrecido."}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Implicación Clínica</p>
                                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                                "Cuando el entorno digital no coincide con el ticket del procedimiento, el cerebro del paciente interpreta riesgo operativo."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. EVIDENCIA OBSERVACIONAL (RESTAURADA) */}
                        <section className="bg-slate-100 p-6 rounded-xl border border-slate-200">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Eye size={14} /> Evidencia Observacional
                            </h3>
                            <p className="text-xs text-slate-400 mb-6 italic border-l-2 border-slate-300 pl-3">
                                El siguiente material corresponde a una <strong>lectura automatizada parcial</strong> de su infraestructura digital pública.
                            </p>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* INSTAGRAM EVIDENCE CARD */}
                                <div className="bg-white rounded-lg border border-slate-200 p-4 overflow-hidden shadow-sm">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Instagram — Datos Extraídos</p>
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl shadow-sm">📱</div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{identity?.handle || '@perfil'}</p>
                                                <p className="text-[10px] text-slate-500 uppercase">{identity?.fullName || 'Profesional'}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="bg-white/80 rounded p-2 shadow-sm">
                                                <p className="text-lg font-bold text-slate-700">✓</p>
                                                <p className="text-[9px] text-slate-500 uppercase font-bold">Escaneado</p>
                                            </div>
                                            <div className="bg-white/80 rounded p-2 shadow-sm">
                                                <p className="text-lg font-bold text-slate-700">✓</p>
                                                <p className="text-[9px] text-slate-500 uppercase font-bold">Posts</p>
                                            </div>
                                            <div className="bg-white/80 rounded p-2 shadow-sm">
                                                <p className="text-lg font-bold text-slate-700">✓</p>
                                                <p className="text-[9px] text-slate-500 uppercase font-bold">Patrones</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 bg-red-50 border border-red-100 p-3 rounded">
                                        <p className="text-xs text-red-800">
                                            <strong className="font-bold">Patrón sistémico detectado:</strong> señal clínica interrumpida por narrativa personal.
                                        </p>
                                    </div>
                                </div>

                                {/* WEBSITE SCREENSHOT */}
                                <div className="bg-white rounded-lg border border-slate-200 p-4 overflow-hidden shadow-sm">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Web — Infraestructura Pública</p>
                                    {report.visualEvidence?.websiteScreenshot ? (
                                        <div className="relative w-full h-40 bg-slate-50 rounded border border-slate-200 overflow-hidden group">
                                            {/* LOADING STATE - Visible behind image or when image is loading */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-0">
                                                <div className="w-6 h-6 border-2 border-slate-200 border-t-cobalt-blue rounded-full animate-spin mb-2"></div>
                                                <p className="text-[10px] text-slate-400 font-mono animate-pulse">Generando Captura...</p>
                                            </div>

                                            <img
                                                src={report.visualEvidence.websiteScreenshot}
                                                alt="Vista preliminar Website"
                                                className="relative z-10 w-full h-full object-cover object-top opacity-0 transition-opacity duration-700 data-[loaded=true]:opacity-100"
                                                draggable="false"
                                                onLoad={(e) => {
                                                    e.target.setAttribute('data-loaded', 'true');
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = '<div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-20"><span class="text-xl mb-1">🚫</span><span class="text-[10px] text-slate-400">Captura no disponible.<br>Requiere validación manual.</span></div>';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-40 bg-slate-50 rounded border border-slate-200 border-dashed flex items-center justify-center">
                                            <p className="text-xs text-slate-400 text-center px-4 italic">
                                                Lectura visual no disponible en este ciclo.<br />
                                                El indicador permanece sin observación confirmada.
                                            </p>
                                        </div>
                                    )}
                                    <div className="mt-3 bg-red-50 border border-red-100 p-3 rounded">
                                        <p className="text-xs text-red-800">
                                            <strong className="font-bold">Indicador visual recurrente:</strong> infraestructura sin actualización estética progresiva.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4.5. ANÁLISIS TEXTUAL (REPORTE GRATUITO) */}
                        <section className="bg-white p-8 md:p-12 shadow-sm rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <FileText size={20} className="text-slate-400" />
                                <h3 className="text-sm font-bold text-surgical-gray uppercase tracking-widest">
                                    Lectura Preliminar de Ecosistema
                                </h3>
                            </div>
                            <div className="prose prose-slate prose-sm md:prose-base max-w-none text-slate-600 leading-relaxed font-serif">
                                {report.rawMarkdown ? (
                                    <ReactMarkdown>{report.rawMarkdown.split('--- SECCIÓN BLOQUEADA')[0] || "Generando diagnóstico..."}</ReactMarkdown>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
                                        <p className="text-xs font-mono">Generando análisis detallado...</p>
                                    </div>
                                )}
                            </div>
                            <p className="mt-8 text-xs text-slate-400 italic border-t border-slate-100 pt-4">
                                * Este análisis es generado por visión artificial y no sustituye el diagnóstico de un auditor clínico humano.
                            </p>
                        </section>

                        {/* 5. IMPACTO ECONÓMICO */}
                        <section className="border-t border-slate-200 pt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingDown className="text-red-500" size={20} />
                                <h3 className="text-sm font-bold text-surgical-gray uppercase tracking-widest">Impacto Económico Estimado</h3>
                            </div>

                            <div className="bg-red-50 border border-red-100 p-6 rounded-xl relative overflow-hidden">
                                <div className="md:flex items-center justify-between gap-8 relative z-10">
                                    <div className="mb-4 md:mb-0">
                                        <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1">Pérdida Potencial Estimada</p>
                                        <p className="text-3xl md:text-4xl font-serif font-bold text-red-700 mb-2">1 – 3 procedimientos</p>
                                        <p className="text-sm text-red-800 font-medium">mensuales</p>
                                    </div>
                                    <div className="max-w-xs">
                                        <p className="text-sm text-red-700/80 leading-relaxed italic border-l-2 border-red-200 pl-4">
                                            "Este impacto ocurre sin señales visibles, sin caída de seguidores ni métricas evidentes."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 6. NOTA DEL SISTEMA */}
                        <section className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex gap-4 items-start">
                            <ShieldAlert className="text-blue-600 shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-2">Nota del Sistema</h4>
                                <p className="text-sm text-blue-800 leading-relaxed mb-2">
                                    Este expediente se encuentra en <strong>modo observación</strong>. Los indicadores actuales muestran tendencia negativa progresiva.
                                </p>
                                <p className="text-xs text-blue-600 font-bold uppercase">
                                    ⚠ Las desviaciones de autoridad no se manifiestan de forma inmediata.
                                </p>
                            </div>
                        </section>

                        {/* BOTÓN DE EJEMPLO DE EXPEDIENTE */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowSample(true)}
                                className="group flex flex-col items-center gap-1 px-6 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-cobalt-blue/50 hover:shadow-md transition-all"
                            >
                                <span className="flex items-center gap-2 text-sm font-bold text-surgical-gray group-hover:text-cobalt-blue transition-colors">
                                    <FileText size={16} /> Acceder a un expediente de referencia
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono tracking-wide">Ejemplo ilustrativo de custodia clínica</span>
                            </button>
                        </div>

                        {/* 7. MÓDULOS BLOQUEADOS & CTA (O VISTA PREMIUM EN MODO DEV) */}
                        {!isDevUnlocked ? (
                            <section className="border-t-2 border-slate-100 pt-10 text-center">
                                <div className="max-w-2xl mx-auto space-y-8">

                                    {/* CAPA 1: INEVITABILIDAD CLÍNICA */}
                                    <div className="text-slate-600 leading-relaxed italic max-w-lg mx-auto border-l-2 border-slate-300 pl-4 text-left">
                                        <p className="mb-2">"Este expediente no puede evolucionar mediante automatización.</p>
                                        <p>La corrección de disonancias clínicas requiere <strong>supervisión humana</strong>, contexto regulatorio y custodia estratégica continua."</p>
                                    </div>

                                    {/* CAPA 2: QUÉ SE ACTIVA (VALOR) */}
                                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-left">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                            Al activar Custodia Clínica:
                                        </h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-sm text-slate-700">
                                                <div className="bg-white p-1 rounded-full border border-slate-200 mt-0.5">
                                                    <CheckCircle size={14} className="text-cobalt-blue" />
                                                </div>
                                                <span>El expediente pasa a <strong className="font-semibold text-surgical-gray">supervisión humana especializada</strong>.</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-sm text-slate-700">
                                                <div className="bg-white p-1 rounded-full border border-slate-200 mt-0.5">
                                                    <Activity size={14} className="text-cobalt-blue" />
                                                </div>
                                                <span>Se habilitan módulos <strong className="font-semibold text-surgical-gray">predictivos y comparativos</strong> (Benchmark).</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-sm text-slate-700">
                                                <div className="bg-white p-1 rounded-full border border-slate-200 mt-0.5">
                                                    <FileText size={14} className="text-cobalt-blue" />
                                                </div>
                                                <span>Se emite un <strong className="font-semibold text-surgical-gray">dictamen holístico</strong> con responsabilidad clínica.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* CAPA 3: INVERSIÓN (DISCRETA) */}
                                    <div>
                                        <div className="flex flex-col items-center gap-2 mb-6">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                Activación inicial del expediente clínico digital
                                            </span>
                                        </div>

                                        <button
                                            onClick={onAction}
                                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-surgical-gray text-white font-serif font-bold tracking-wider rounded-lg shadow-lg hover:bg-slate-800 transition-all duration-300 w-full md:w-auto"
                                        >
                                            <span>Iniciar Supervisión Clínica</span>
                                            <span className="w-px h-4 bg-white/20"></span>
                                            <span className="text-slate-300 font-sans text-sm font-normal">$197 USD</span>
                                        </button>

                                        <p className="text-[10px] text-slate-400 mt-4 italic">
                                            Proceso único de habilitación. Sin recurrencia automática oculta.
                                        </p>
                                    </div>

                                </div>
                            </section>
                        ) : (
                            /* VISTA PREMIUM SIMULADA (FASE 1) */
                            <div className="mt-12 space-y-8 animate-in fade-in duration-700">
                                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Activity size={100} className="text-emerald-900" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-emerald-100 p-2 rounded-full">
                                                <CheckCircle className="text-emerald-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-emerald-900">Membresía Activa: Custodia Habilitada</h3>
                                                <p className="text-xs text-emerald-700 font-mono">ID: PREM-8829-X (Fase 1)</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-emerald-100">
                                            <p className="text-sm text-emerald-900 leading-relaxed">
                                                <strong>Acceso Total Concedido.</strong> El equipo de ingeniería clínica está procesando la "Proyección de 90 días". Recibirá la alerta en su Dashboard en 48 horas.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECCIÓN 3: PROTOCOLO DE CORRECCIÓN (90 DÍAS) - FASE 3 IMPL */}
                        {authorityGap && (
                            <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                                <ProjectionTimeline correctionPhases={authorityGap.correctionPhases} />
                            </div>
                        )}
                    </>
                )}

                <SampleReportModal isOpen={showSample} onClose={() => setShowSample(false)} />

                {/* --- DEV TOOLS --- */}
                <div className="fixed bottom-4 right-4 z-50 opacity-90 hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsDevUnlocked(!isDevUnlocked)}
                        className="bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg border-2 border-white flex items-center gap-2 hover:bg-red-700 hover:scale-105 transition-all"
                    >
                        {isDevUnlocked ? '🔒 DEV: VOLVER A PAGO' : '🔓 DEV: SIMULAR MEMBRESÍA ACTIVA'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClinicalReportView;
