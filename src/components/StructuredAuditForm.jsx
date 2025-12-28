import { useState } from 'react';
import { AlertTriangle, CheckCircle, Save, Info } from 'lucide-react';

/**
 * STRUCTURED AUDIT FORM (Protocolo Estricto V1.0)
 * Reemplaza el texto libre por campos obligatorios taxonómicos.
 */
const StructuredAuditForm = ({ initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData || {
        channel: 'IG',
        riskType: 'authority',
        fact: '',
        strategicNote: '',
        isHiddenClient: false
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} className="text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Protocolo de Auditoría Humana</h3>
                    <p className="text-xs text-slate-500">Ingesta Estructurada para ClinicalTruthModel</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* 1. CANAL OBSERVADO */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Canal Observado
                        </label>
                        <select
                            value={formData.channel}
                            onChange={(e) => handleChange('channel', e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-500"
                        >
                            <option value="IG">Instagram Feed/Stories</option>
                            <option value="TikTok">TikTok</option>
                            <option value="Web">Website / Landing</option>
                            <option value="WhatsApp">WhatsApp / Chat</option>
                            <option value="Secretaria">Llamada a Recepción</option>
                        </select>
                    </div>

                    {/* 2. TIPO DE RIESGO */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Dimensión de Riesgo
                        </label>
                        <select
                            value={formData.riskType}
                            onChange={(e) => handleChange('riskType', e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-500"
                        >
                            <option value="authority">Percepción de Autoridad (Erosión)</option>
                            <option value="regulatory">Riesgo Regulatorio / Legal</option>
                            <option value="financial">Fuga Financiera Invisible</option>
                            <option value="visual">Incongruencia Estética</option>
                        </select>
                    </div>
                </div>

                {/* 3. HECHO OBSERVADO (FACTUAL) */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Hecho Observado (Factual)</span>
                        <span className="text-slate-400 font-normal normal-case">Qué ocurrió exactamente, sin opiniones.</span>
                    </label>
                    <textarea
                        value={formData.fact}
                        onChange={(e) => handleChange('fact', e.target.value)}
                        placeholder="Ej: El médico utiliza música de tendencia viral (reggaetón) en un video explicando un procedimiento de alta complejidad..."
                        className="w-full h-24 p-3 border border-slate-200 rounded-lg text-sm resize-none focus:border-indigo-500 outline-none"
                    />
                </div>

                {/* 4. NOTA ESTRATÉGICA (HUMAN INSIGHT) */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Nota Estratégica (Interpretación)</span>
                        <span className="text-slate-400 font-normal normal-case">Por qué esto daña la autoridad.</span>
                    </label>
                    <div className="relative">
                        <textarea
                            value={formData.strategicNote}
                            onChange={(e) => handleChange('strategicNote', e.target.value)}
                            placeholder="Ej: Esto genera una disonancia cognitiva inmediata. El paciente asocia el audio de bajo estatus con la calidad del procedimiento, trivializando la intervención."
                            className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm resize-none focus:border-indigo-500 outline-none bg-amber-50/30"
                        />
                        <div className="absolute top-3 right-3 text-amber-500">
                            <Info size={16} />
                        </div>
                    </div>
                </div>

                {/* CLIPBOARD TOGGLE */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="mystery"
                        checked={formData.isHiddenClient}
                        onChange={(e) => handleChange('isHiddenClient', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="mystery" className="text-sm text-slate-600">
                        Evidencia obtenida mediante Cliente Oculto (Mystery Shopper)
                    </label>
                </div>

                {/* SAVE ACTION */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        className="bg-indigo-900 hover:bg-black text-white px-6 py-3 rounded-lg font-bold text-sm tracking-wide flex items-center gap-2 transition-all"
                    >
                        <Save size={18} />
                        GUARDAR HALLAZGO ESTRUCTURADO
                    </button>
                </div>

            </form>
        </div>
    );
};

export default StructuredAuditForm;
