import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Upload, X, Image, FileText, Video, MessageSquare,
    Loader2, CheckCircle, AlertTriangle, Sparkles, ChevronLeft
} from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFunctions, httpsCallable } from 'firebase/functions';

// ============================================
// SCREENSHOT UPLOAD MODULE
// ============================================
const ScreenshotModule = ({ auditId, screenshots, onUpdate }) => {
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(null); // ID of screenshot being analyzed

    const onDrop = useCallback(async (acceptedFiles) => {
        setUploading(true);
        const storage = getStorage();
        const newScreenshots = [...screenshots];

        for (const file of acceptedFiles) {
            try {
                // Upload to Firebase Storage
                const fileName = `audits/${auditId}/screenshots/${Date.now()}_${file.name}`;
                const storageRef = ref(storage, fileName);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);

                newScreenshots.push({
                    id: Date.now().toString(),
                    url,
                    fileName: file.name,
                    uploadedAt: new Date(),
                    aiAnalysis: null,
                    status: 'pending' // pending | analyzing | analyzed
                });
            } catch (err) {
                console.error('Upload error:', err);
            }
        }

        onUpdate(newScreenshots);
        setUploading(false);
    }, [auditId, screenshots, onUpdate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxFiles: 10
    });

    const analyzeScreenshot = async (screenshot) => {
        setAnalyzing(screenshot.id);

        try {
            const functions = getFunctions();
            const analyzeImage = httpsCallable(functions, 'analyzeScreenshotWithVision');
            const result = await analyzeImage({ imageUrl: screenshot.url, auditId });

            const updatedScreenshots = screenshots.map(s =>
                s.id === screenshot.id
                    ? { ...s, aiAnalysis: result.data, status: 'analyzed' }
                    : s
            );
            onUpdate(updatedScreenshots);
        } catch (err) {
            console.error('Analysis error:', err);
        } finally {
            setAnalyzing(null);
        }
    };

    const removeScreenshot = (id) => {
        onUpdate(screenshots.filter(s => s.id !== id));
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <Image size={20} className="text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Módulo de Screenshots</h3>
                    <p className="text-xs text-slate-500">Evidencia Visual del Feed</p>
                </div>
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                    }`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
                ) : (
                    <>
                        <Upload size={32} className="mx-auto text-slate-400 mb-3" />
                        <p className="text-sm text-slate-600 font-medium">
                            {isDragActive ? 'Soltar aquí...' : 'Arrastra screenshots o haz clic'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (máx 10 archivos)</p>
                    </>
                )}
            </div>

            {/* Screenshot Grid */}
            {screenshots.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                    {screenshots.map((screenshot) => (
                        <div key={screenshot.id} className="relative group border rounded-lg overflow-hidden">
                            <img
                                src={screenshot.url}
                                alt={screenshot.fileName}
                                className="w-full h-32 object-cover"
                            />

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => analyzeScreenshot(screenshot)}
                                    disabled={analyzing === screenshot.id}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                    title="Analizar con IA"
                                >
                                    {analyzing === screenshot.id ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <Sparkles size={16} />
                                    )}
                                </button>
                                <button
                                    onClick={() => removeScreenshot(screenshot.id)}
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                    title="Eliminar"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Status Badge */}
                            {screenshot.status === 'analyzed' && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                                    <CheckCircle size={12} />
                                </div>
                            )}

                            {/* AI Analysis Preview */}
                            {screenshot.aiAnalysis && (
                                <div className="p-2 bg-slate-50 border-t text-xs">
                                    <span className={`font-bold ${screenshot.aiAnalysis.clasificacion === 'Erosión Crítica'
                                            ? 'text-red-600'
                                            : screenshot.aiAnalysis.clasificacion === 'Vulnerabilidad Moderada'
                                                ? 'text-amber-600'
                                                : 'text-green-600'
                                        }`}>
                                        {screenshot.aiAnalysis.clasificacion}
                                    </span>
                                    <span className="text-slate-500 ml-2">
                                        {screenshot.aiAnalysis.nivel_erosion}/10
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ============================================
// CAPTIONS MODULE (Rich Text)
// ============================================
const CaptionsModule = ({ captions, onChange, aiAnalysis }) => {
    const [analyzing, setAnalyzing] = useState(false);

    const runAnalysis = async () => {
        if (!captions.trim()) return;
        setAnalyzing(true);

        try {
            const functions = getFunctions();
            const analyzeCaptions = httpsCallable(functions, 'analyzeCaptionsSemiotics');
            const result = await analyzeCaptions({ captions });
            // Handle result - parent should manage this
            console.log('Captions analysis:', result.data);
        } catch (err) {
            console.error('Captions analysis error:', err);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                        <MessageSquare size={20} className="text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Captions & Comentarios</h3>
                        <p className="text-xs text-slate-500">Análisis Semiótico del Discurso</p>
                    </div>
                </div>
                <button
                    onClick={runAnalysis}
                    disabled={analyzing || !captions.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white text-sm rounded-lg"
                >
                    {analyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    Analizar
                </button>
            </div>

            <textarea
                value={captions}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Pega aquí los copies de los posts, comentarios relevantes, textos de stories..."
                className="w-full h-48 p-4 border border-slate-200 rounded-lg resize-none focus:border-purple-500 outline-none text-sm"
            />

            {aiAnalysis && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-purple-800 text-sm mb-2">Análisis IA</h4>
                    <p className="text-sm text-purple-700">{aiAnalysis.veredicto}</p>
                    {aiAnalysis.palabras_rojas?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {aiAnalysis.palabras_rojas.map((palabra, i) => (
                                <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                    {palabra}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================
// VIDEOS MODULE (Placeholder for Sprint 3)
// ============================================
const VideosModule = ({ videos, onUpdate }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 opacity-60">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                    <Video size={20} className="text-amber-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Módulo de Videos</h3>
                    <p className="text-xs text-slate-500">Whisper Transcripción (Sprint 3)</p>
                </div>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                <Video size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-400">Próximamente: Transcripción automática con Whisper</p>
            </div>
        </div>
    );
};

// ============================================
// OBSERVATIONS MODULE (Markdown)
// ============================================
const ObservationsModule = ({ observations, onChange }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <FileText size={20} className="text-emerald-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Observaciones del Auditor</h3>
                    <p className="text-xs text-slate-500">Veredicto Maestro (Markdown)</p>
                </div>
            </div>

            <textarea
                value={observations}
                onChange={(e) => onChange(e.target.value)}
                placeholder="## Veredicto del Auditor Senior&#10;&#10;Escribe aquí tu análisis profesional...&#10;&#10;- Hallazgo 1&#10;- Hallazgo 2&#10;&#10;**Conclusión:** "
                className="w-full h-64 p-4 border border-slate-200 rounded-lg resize-none focus:border-emerald-500 outline-none text-sm font-mono"
            />
        </div>
    );
};

// ============================================
// MAIN EVIDENCE STATION COMPONENT
// ============================================
const EvidenceStation = ({ audit, onBack }) => {
    const [saving, setSaving] = useState(false);
    const [completing, setCompleting] = useState(false);

    // Evidence State
    const [screenshots, setScreenshots] = useState(audit.manualEvidence?.screenshots || []);
    const [captions, setCaptions] = useState(audit.manualEvidence?.rawCaptions || '');
    const [captionsAnalysis, setCaptionsAnalysis] = useState(audit.manualEvidence?.captionsAnalysis || null);
    const [videos, setVideos] = useState(audit.manualEvidence?.videos || []);
    const [observations, setObservations] = useState(audit.manualEvidence?.humanObservations || '');

    const saveProgress = async () => {
        setSaving(true);
        try {
            const auditRef = doc(db, 'audits', audit.id);
            await updateDoc(auditRef, {
                auditStatus: 'in_progress',
                manualEvidence: {
                    screenshots,
                    rawCaptions: captions,
                    captionsAnalysis,
                    videos,
                    humanObservations: observations
                },
                lastUpdated: Timestamp.now()
            });
            console.log('✅ Progress saved');
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    const markComplete = async () => {
        setCompleting(true);
        try {
            const auditRef = doc(db, 'audits', audit.id);
            await updateDoc(auditRef, {
                auditStatus: 'completed',
                manualEvidence: {
                    screenshots,
                    rawCaptions: captions,
                    captionsAnalysis,
                    videos,
                    humanObservations: observations
                },
                completedAt: Timestamp.now(),
                reviewedBy: 'admin' // TODO: Get from auth
            });
            console.log('✅ Audit marked as complete');
            onBack();
        } catch (err) {
            console.error('Complete error:', err);
        } finally {
            setCompleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800"
                    >
                        <ChevronLeft size={20} />
                        <span>Volver a Lista</span>
                    </button>

                    <h1 className="font-serif text-xl font-bold text-slate-800">
                        Estación de Evidencia Crítica
                    </h1>

                    <div className="flex gap-2">
                        <button
                            onClick={saveProgress}
                            disabled={saving}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            {saving && <Loader2 className="animate-spin" size={16} />}
                            Guardar Borrador
                        </button>
                        <button
                            onClick={markComplete}
                            disabled={completing}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center gap-2"
                        >
                            {completing && <Loader2 className="animate-spin" size={16} />}
                            <CheckCircle size={16} />
                            Marcar Completado
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Audit Info */}
                <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">
                        📋
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-slate-800">
                            @{audit.instagramUrl?.split('instagram.com/')[1]?.split('/')[0] || 'N/A'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            ID: {audit.id} | Estado:
                            <span className={`ml-1 font-medium ${audit.auditStatus === 'completed' ? 'text-emerald-600' :
                                    audit.auditStatus === 'in_progress' ? 'text-blue-600' : 'text-amber-600'
                                }`}>
                                {audit.auditStatus === 'completed' ? 'Completado' :
                                    audit.auditStatus === 'in_progress' ? 'En Proceso' : 'Pendiente'}
                            </span>
                        </p>
                    </div>
                    {audit.restrictionType && (
                        <div className="ml-auto px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            {audit.restrictionType === 'AGE_RESTRICTED' ? 'Contenido +18' : 'Perfil Privado'}
                        </div>
                    )}
                </div>

                {/* Evidence Modules Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <ScreenshotModule
                        auditId={audit.id}
                        screenshots={screenshots}
                        onUpdate={setScreenshots}
                    />
                    <CaptionsModule
                        captions={captions}
                        onChange={setCaptions}
                        aiAnalysis={captionsAnalysis}
                    />
                    <VideosModule
                        videos={videos}
                        onUpdate={setVideos}
                    />
                    <ObservationsModule
                        observations={observations}
                        onChange={setObservations}
                    />
                </div>
            </div>
        </div>
    );
};

export default EvidenceStation;
