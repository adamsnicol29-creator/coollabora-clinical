import { useState } from 'react';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';

const LeadCaptureModal = ({ isOpen, onClose, onUnlock }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [checks, setChecks] = useState({ professional: false, confidentiality: false, methodology: false });
    const [errors, setErrors] = useState({ name: null, email: null, checks: null });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Requerido';
        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!checks.professional || !checks.confidentiality || !checks.methodology) {
            newErrors.checks = 'Debe aceptar todos los protocolos de autoridad.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onUnlock(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-md p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                <div
                    className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center cursor-default select-none"
                    onDoubleClick={() => onUnlock({ name: 'Admin Override', email: 'admin@internal.system', phone: '000' })}
                    title="Developer Bypass: Double Click to Skip"
                >
                    <h3 className="font-serif font-bold text-xl text-surgical-gray flex items-center gap-2">
                        <Lock size={20} className="text-cobalt-blue" /> Acceso a Expediente
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="text-center mb-6">
                        <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Paso Final</p>
                        <p className="text-slate-600 text-sm">
                            Este análisis contiene datos de ventaja competitiva. Confirme su identidad profesional para desbloquear.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Nombre Completo del Especialista"
                                className={`w-full p-4 bg-slate-50 border ${errors.name ? 'border-red-300' : 'border-slate-200'} rounded-lg text-sm focus:border-cobalt-blue outline-none`}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="email"
                                placeholder="Email Profesional"
                                className={`w-full p-4 bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-lg text-sm focus:border-cobalt-blue outline-none`}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="tel"
                                placeholder="WhatsApp (Opcional)"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-cobalt-blue outline-none"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* AUTHORITY CHECKBOXES */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border ${checks.professional ? 'border-blue-200 bg-blue-50/50' : 'border-transparent hover:bg-slate-50'}`}>
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checks.professional ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                                {checks.professional && <CheckCircle size={12} />}
                            </div>
                            <input type="checkbox" className="hidden" checked={checks.professional} onChange={e => setChecks({ ...checks, professional: e.target.checked })} />
                            <span className="text-xs text-slate-600 leading-tight">
                                <strong>Validación Profesional:</strong> Confirmo que soy un profesional certificado en Cirugía Plástica o Medicina Estética.
                            </span>
                        </label>

                        <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border ${checks.confidentiality ? 'border-blue-200 bg-blue-50/50' : 'border-transparent hover:bg-slate-50'}`}>
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checks.confidentiality ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                                {checks.confidentiality && <CheckCircle size={12} />}
                            </div>
                            <input type="checkbox" className="hidden" checked={checks.confidentiality} onChange={e => setChecks({ ...checks, confidentiality: e.target.checked })} />
                            <span className="text-xs text-slate-600 leading-tight">
                                <strong>Confidencialidad:</strong> Entiendo que este expediente contiene análisis de brecha competitiva exclusivos.
                            </span>
                        </label>

                        <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border ${checks.methodology ? 'border-blue-200 bg-blue-50/50' : 'border-transparent hover:bg-slate-50'}`}>
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checks.methodology ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                                {checks.methodology && <CheckCircle size={12} />}
                            </div>
                            <input type="checkbox" className="hidden" checked={checks.methodology} onChange={e => setChecks({ ...checks, methodology: e.target.checked })} />
                            <span className="text-xs text-slate-600 leading-tight">
                                <strong>Metodología:</strong> Deseo recibir mi Protocolo de Reingeniería basado en Economía de la Predicción para <strong>evitar erosión progresiva de autoridad clínica</strong>.
                            </span>
                        </label>

                        {errors.checks && <p className="text-red-500 text-xs text-center font-bold animate-pulse">{errors.checks}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-900 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                    >
                        Acceder al Expediente <ArrowRight size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LeadCaptureModal;
