import { useState, useEffect } from 'react';
import {
    ShieldCheck, Activity, ArrowRight, Search, Lock, Loader2,
    TrendingDown, Eye, Globe, Database, AlertTriangle, ScanLine, FileWarning, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

// Components
import ProgressModal from '../components/lead-magnet/ProgressModal';
import ScraperFailureModal from '../components/lead-magnet/ScraperFailureModal';
import LeadCaptureModal from '../components/lead-magnet/LeadCaptureModal';
import ClinicalReportView from '../components/lead-magnet/ClinicalReportView';

export default function LeadMagnet() {
    const [instagramUrl, setInstagramUrl] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressStatus, setProgressStatus] = useState('');
    const [report, setReport] = useState(null);

    // VIEW STATE: 'input', 'teaser', 'report'
    const [viewState, setViewState] = useState('input');
    const [showCaptureModal, setShowCaptureModal] = useState(false);
    const [showScraperFailure, setShowScraperFailure] = useState(false);

    // UNLOCKING SEQUENCE STATE
    const [unlocking, setUnlocking] = useState(false);
    const [unlockProgress, setUnlockProgress] = useState(0);
    const [unlockStatus, setUnlockStatus] = useState('');

    const startUnlockSequence = () => {
        setUnlocking(true);
        setUnlockProgress(0);
        setUnlockStatus('Verificando credenciales de especialista...');

        // Step 1: 0-33% (1s)
        setTimeout(() => {
            setUnlockProgress(35);
            setUnlockStatus('Compilando datos de brecha competitiva...');
        }, 1000);

        // Step 2: 35-66% (1s)
        setTimeout(() => {
            setUnlockProgress(70);
            setUnlockStatus('Generando protocolo de reingeniería personalizado...');
        }, 2000);

        // Step 3: Finish (1s)
        setTimeout(() => {
            setUnlockProgress(100);
            setUnlocking(false);
            setShowCaptureModal(true);
        }, 3000);
    };

    // CLINICAL PROGRESS SIMULATION
    useEffect(() => {
        if (!analyzing) return;

        setProgress(0);
        setProgressStatus('🔐 Iniciando protocolos de acceso seguro...');

        const messages = [
            '🔐 Iniciando protocolos de acceso seguro...',
            '📡 Conectando con servidores de Meta...',
            '👤 Identificando perfil profesional...',
            '📊 Extrayendo métricas de engagement...',
            '🖼️ Analizando coherencia visual del feed...',
            '📝 Clasificando tipo de contenido publicado...',
            '🔍 Detectando patrones de autoridad clínica...',
            '🌐 Escaneando infraestructura web pública...',
            '🎨 Evaluando identidad de marca digital...',
            '📈 Calculando índice de obsolescencia estética...',
            '🧠 Aplicando modelo de IA Gemini Pro...',
            '📋 Compilando hallazgos preliminares...',
            '✍️ Redactando veredicto del expediente...',
            '🔒 Verificando integridad del análisis...',
            '📁 Generando expediente de autoridad...',
        ];

        let messageIndex = 0;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    setProgressStatus('⏳ Finalizando expediente... casi listo');
                    return 92;
                }
                const speed = prev < 50 ? 2.5 : prev < 75 ? 1.5 : 0.8;
                const increment = Math.random() * speed;
                const next = Math.min(prev + increment, 92);

                const expectedIndex = Math.floor(next / 6);
                if (expectedIndex > messageIndex && expectedIndex < messages.length) {
                    messageIndex = expectedIndex;
                    setProgressStatus(messages[messageIndex]);
                }
                return next;
            });
        }, 400);

        return () => clearInterval(interval);
    }, [analyzing]);

    const runAudit = async (e) => {
        e.preventDefault();
        if (!instagramUrl) return;
        setAnalyzing(true);
        setReport(null);

        try {
            const functions = getFunctions();
            // Emulator connection (DEV ONLY)
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
                try { connectFunctionsEmulator(functions, "127.0.0.1", 5001); } catch (e) { }
            }

            const performAudit = httpsCallable(functions, 'performAuthorityAudit', { timeout: 540000 });
            const minTime = new Promise(resolve => setTimeout(resolve, 3000));

            const [result] = await Promise.all([
                performAudit({ instagramUrl, websiteUrl }),
                minTime
            ]);

            const data = result?.data || {};

            if (data.error) {
                console.error("Soft Error Received:", data.error, data.message);
                setAnalyzing(false);
                setShowScraperFailure(true);
                return;
            }

            const report = data.report || { rawMarkdown: "Error: No report content" };
            const identity = data.identity || { handle: "Usuario", fullName: "Profesional" };
            const visionAnalysis = data.visionAnalysis || null;

            setProgress(100);

            // PREPARE REPORT DATA
            const finalReport = {
                rawMarkdown: report,
                identity: identity,
                visionAnalysis: visionAnalysis,
                visualEvidence: data.visualEvidence || null,
                auditId: data.auditId || "CKL-" + Math.floor(Math.random() * 90000 + 10000),
                auditStatus: data.auditStatus || 'complete',
                restrictionType: data.restrictionType || null,
                dataUsed: data.dataUsed || null,
                authorityScore: (() => {
                    if (!visionAnalysis) return null;
                    const brand = visionAnalysis.brandIntegrity?.score;
                    const aesthetic = visionAnalysis.visualInfrastructure?.score;
                    if (typeof brand !== 'number' || typeof aesthetic !== 'number') return null;
                    const calculated = Math.round((brand + aesthetic) / 2 * 10) / 10;
                    return isNaN(calculated) ? null : calculated;
                })(),
            };

            setTimeout(() => {
                setReport(finalReport);
                setAnalyzing(false);
                setViewState('teaser');
            }, 800);

        } catch (error) {
            console.error("Audit Error:", error);
            setAnalyzing(false);
            if (error.code === 'data-loss' || error.message.includes('DATA_INTEGRITY_FAIL')) {
                setShowScraperFailure(true);
                return;
            }
            alert("Error del Sistema: " + error.message);
            setViewState('input');
        }
    };

    const handleUnlockReport = (leadData) => {
        console.log("Lead Captured:", leadData);
        setShowCaptureModal(false);
        setViewState('report');
    };

    // --- TEASER VIEW RENDERER ---
    if (viewState === 'teaser' && report) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
                {/* MODAL */}
                <LeadCaptureModal isOpen={showCaptureModal} onClose={() => setShowCaptureModal(false)} onUnlock={handleUnlockReport} />

                <div className="max-w-4xl w-full text-center relative z-10">
                    <div className="mb-8 inline-block animate-pulse">
                        <div className="bg-red-50 text-red-700 px-4 py-1 rounded-sm text-xs font-bold uppercase tracking-widest border border-red-100 font-mono">
                            ⚠ Anomalías Críticas Detectadas
                        </div>
                    </div>

                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                        Lectura Preliminar Lista
                    </h1>

                    <div className="bg-white p-10 rounded-xl shadow-2xl border border-slate-200 max-w-2xl mx-auto mb-12">
                        {/* System Note */}
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 text-left">
                            <p className="text-xs text-amber-800 font-mono uppercase tracking-wide mb-1">
                                Estado del Análisis
                            </p>
                            <p className="text-sm text-amber-900 font-medium">
                                Lectura automatizada completada. La interpretación profunda requiere activación de custodia.
                            </p>
                        </div>

                        <div className="text-center mb-10">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Score de Autoridad (Preliminar)</p>
                            {report.authorityScore !== null ? (
                                <p className={`text-7xl font-serif font-bold ${report.authorityScore <= 4 ? 'text-red-700' : 'text-slate-800'}`}>
                                    {Math.ceil(report.authorityScore)}<span className="text-3xl text-slate-300 font-sans">/10</span>
                                </p>
                            ) : (
                                <p className="text-2xl font-serif font-bold text-amber-600">EN EVALUACIÓN</p>
                            )}
                        </div>

                        <p className="text-slate-600 text-lg leading-relaxed mb-10 text-justify px-4">
                            Hemos completado la auditoría dual de su presencia digital ({report.identity?.handle || '@perfil'}).
                            Detectamos <strong className="text-red-700 font-semibold">indicadores de erosión de autoridad</strong> y disonancias estructurales que comprometen su posicionamiento ante pacientes de alto valor.
                        </p>

                        <button
                            onClick={startUnlockSequence}
                            className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-lg transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 font-mono"
                        >
                            <Eye size={16} /> Ver Expediente Clínico Completo
                        </button>

                        {(location.hostname === 'localhost' || location.hostname === '127.0.0.1') && (
                            <button
                                onClick={() => setViewState('report')}
                                className="mt-6 w-full py-2 text-slate-400 hover:text-red-500 text-xs font-mono transition-colors">
                                [DEV BYPASS]
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- REPORT VIEW ---
    if (viewState === 'report' && report) {
        return (
            <ClinicalReportView
                report={report}
                onAction={() => { }} // TODO: Action handled inside component or via context
            />
        );
    }

    // --- LANDING VIEW (AUTHORITY INTERFACE) ---
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans text-slate-800">

            {/* Header Status */}
            <div className="bg-white border-b border-slate-200 py-3 px-6 sticky top-0 z-50 flex justify-between items-center">
                <div className="font-serif font-bold text-lg text-slate-900 tracking-tight">
                    COOLLABORA <span className="text-slate-400 font-light">CLINICAL</span>
                </div>
                <div className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider hidden md:block">
                    Sistema de Custodia de Autoridad v2.4
                </div>
            </div>

            {/* Progress & Modals */}
            <AnimatePresence>
                {(analyzing || unlocking) && <ProgressModal progress={unlocking ? unlockProgress : progress} status={unlocking ? unlockStatus : progressStatus} />}
            </AnimatePresence>
            <ScraperFailureModal isOpen={showScraperFailure} onClose={() => setShowScraperFailure(false)} onRetry={() => runAudit({ preventDefault: () => { } })} />

            <main className="flex-1 flex flex-col items-center pt-20 pb-20 px-6 relative z-10 w-full max-w-6xl mx-auto">

                {/* 1. HERO SECTION (Arquitectura de Poder) */}
                <section className="text-center max-w-4xl mx-auto mb-24">
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                        Pacientes de alto ticket deciden por su <br className="hidden md:block" />
                        <span className="text-slate-500 italic">autoridad digital</span>, no por su <br className="hidden md:block" />
                        visibilidad online.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
                        Antes de la consulta, su autoridad digital ya determina quién solicita cita y quién no.
                        Nuestros sistemas, construidos tras más de 15 años de exposición directa y +5,000 interacciones 1:1,
                        detectan la erosión silenciosa de autoridad y disonancias que comprometen decisiones críticas.
                    </p>
                </section>

                {/* 2. PAIN POINTS MODULE (Vulnerabilities) */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-24">
                    {[
                        { icon: Activity, title: "Fuga de Pacientes", desc: "Pacientes de alto ticket eligen a la competencia antes de su contacto." },
                        { icon: AlertTriangle, title: "Incoherencia de Estatus", desc: "Incoherencias digitales que contradicen su jerarquía profesional real." },
                        { icon: FileWarning, title: "Desconfianza Silenciosa", desc: "Perfil online y web que generan dudas no verbalizadas." },
                        { icon: TrendingDown, title: "Erosión Activa", desc: "Publicaciones o mensajes que degradan su autoridad sin señales visibles." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <item.icon size={24} className="text-slate-400 mb-6" />
                            <h3 className="font-serif font-bold text-slate-900 text-lg mb-3">{item.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-light">{item.desc}</p>
                        </div>
                    ))}
                </section>

                {/* 3. SCANNER INTERFACE (Block of Algorithm & Action) */}
                <section className="w-full max-w-3xl mx-auto mb-24 relative">
                    <div className="absolute -top-10 left-0 right-0 flex justify-center z-20">
                        <div className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-widest py-2 px-6 rounded-full shadow-xl">
                            Protocolo de Custodia de Autoridad
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative z-10">
                        {/* Header of Scanner */}
                        <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <ScanLine size={16} className="text-slate-400" />
                                <span className="text-xs font-mono font-bold text-slate-500 uppercase">Scanner de Arquitectura Digital</span>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>

                        <div className="p-8 md:p-12">
                            <form onSubmit={runAudit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Fachada Input */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                            <Eye size={12} /> Perfil Visible (La Fachada)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="URL Instagram"
                                            value={instagramUrl}
                                            onChange={e => setInstagramUrl(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-0 transition-colors font-mono text-sm"
                                        />
                                    </div>

                                    {/* Infraestructura Input */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                            <Globe size={12} /> Infraestructura (Web)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="URL Sitio Web"
                                            value={websiteUrl}
                                            onChange={e => setWebsiteUrl(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-0 transition-colors font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-lg transition-transform transform hover:scale-[1.01] active:scale-[0.99] uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                                >
                                    <Database size={16} /> EJECUTAR ANÁLISIS PREDICTIVO
                                </button>

                                <p className="text-center text-[10px] text-slate-400 font-mono">
                                    Resultado inicial en 90 segundos, sin intervención de terceros.
                                </p>
                            </form>
                        </div>
                    </div>
                </section>

                {/* 4. SOCIAL PROOF (DATA DRIVEN) */}
                <section className="w-full max-w-4xl mx-auto mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
                        <div className="py-4">
                            <p className="text-4xl font-serif font-bold text-slate-900 mb-2">+5,000</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interacciones Analizadas</p>
                        </div>
                        <div className="py-4">
                            <p className="text-4xl font-serif font-bold text-slate-900 mb-2">10</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Especialidades Cubiertas</p>
                        </div>
                        <div className="py-4">
                            <p className="text-4xl font-serif font-bold text-slate-900 mb-2">+1,200</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vulnerabilidades Detectadas</p>
                        </div>
                    </div>
                </section>

                {/* 5. FOOTER / EXCLUSION */}
                <footer className="text-center max-w-2xl mx-auto space-y-6 pt-12 border-t border-slate-200 w-full">
                    <p className="text-xs font-bold text-red-800 bg-red-50 inline-block px-3 py-1 rounded-sm uppercase tracking-wide">
                        Aviso de Acceso Limitado
                    </p>
                    <p className="text-sm text-slate-600">
                        Solo perfiles con actividad clínica mínima son evaluados. Su expediente será único y registrado de inmediato.
                    </p>
                    <div className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        <p>Coollabora no interviene en práctica clínica ni resultados médicos.</p>
                        <p>Solo custodia la percepción, coherencia y confianza percibida por pacientes antes de la consulta.</p>
                        <p className="mt-4 opacity-50">© {new Date().getFullYear()} Coollabora Clinical Systems. Todos los derechos reservados.</p>
                    </div>
                </footer>

                {/* Sticky Micro-CTA on Scroll (Optional/Mobile) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:hidden z-40 text-center">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="w-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg"
                    >
                        Ejecutar Análisis Predictivo
                    </button>
                </div>
            </main>
        </div>
    );
}
