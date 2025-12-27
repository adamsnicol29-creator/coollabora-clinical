import { X, Lock, AlertTriangle, ShieldAlert, TrendingDown, CheckCircle, FileText, Search } from 'lucide-react';

const SampleReportModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-slate-200 my-8">

                {/* Header Sticker */}
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold uppercase py-1 px-3 rounded-bl-lg z-10">
                    Ejemplo Ilustrativo
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="h-[85vh] overflow-y-auto custom-scrollbar">

                    {/* DOCUMENT HEADER */}
                    <header className="bg-slate-50 p-8 border-b border-slate-200 text-center">
                        <div className="inline-flex flex-col items-center gap-2 mb-4">
                            <span className="text-3xl">🩺</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Documento Confidencial de Muestra</span>
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-surgical-gray mb-2">
                            INFORME CLÍNICO DE AUTORIDAD DIGITAL
                        </h1>
                        <p className="font-mono text-cobalt-blue text-sm uppercase mb-6">
                            Dr. XXXXX | Cirugía Plástica
                        </p>
                        <div className="max-w-xl mx-auto bg-amber-50 border border-amber-100 p-3 rounded-lg">
                            <p className="text-xs text-amber-800 italic">
                                "Este documento es un ejemplo estructural del tipo de informe que reciben los médicos bajo custodia clínica activa. No corresponde a un caso real."
                            </p>
                        </div>
                    </header>

                    <div className="p-8 md:p-12 space-y-12 font-sans text-slate-600 leading-relaxed">

                        {/* 1. RESUMEN EJECUTIVO */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-serif font-bold text-slate-500">1</div>
                                <h3 className="font-serif font-bold text-xl text-surgical-gray uppercase tracking-wide">Resumen Ejecutivo Clínico</h3>
                            </div>
                            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-6">
                                <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1">Veredicto General</p>
                                <h4 className="text-xl font-bold text-red-700 mb-2">🟥 Disonancia de Autoridad con Impacto Financiero</h4>
                                <p className="text-sm text-red-900/80">
                                    El ecosistema digital del Dr. XXXXX presenta señales claras de erosión silenciosa de autoridad clínica, provocadas no por falta de experiencia médica, sino por incongruencias en comunicación visual, narrativa clínica y arquitectura de percepción.
                                </p>
                            </div>
                            <p className="text-sm text-slate-500 italic">
                                "Estas señales no generan rechazo inmediato, pero sí filtran negativamente el tipo de paciente que llega a consulta."
                            </p>
                        </section>

                        {/* 2. MAPA DE RIESGOS */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-serif font-bold text-slate-500">2</div>
                                <h3 className="font-serif font-bold text-xl text-surgical-gray uppercase tracking-wide">Mapa de Riesgos Detectados</h3>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                        <tr>
                                            <th className="px-6 py-3">Pilar Evaluado</th>
                                            <th className="px-6 py-3">Estado</th>
                                            <th className="px-6 py-3">Impacto Sistémico</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-slate-700">Comunicación Visual</td>
                                            <td className="px-6 py-4"><span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs">🟥 Crítico</span></td>
                                            <td className="px-6 py-4 text-slate-600">Afecta percepción de sofisticación</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-slate-700">Lenguaje Clínico</td>
                                            <td className="px-6 py-4"><span className="inline-flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded text-xs">🟧 En Riesgo</span></td>
                                            <td className="px-6 py-4 text-slate-600">Genera fricción cognitiva</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-slate-700">Perfil Paciente</td>
                                            <td className="px-6 py-4"><span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs">🟥 Crítico</span></td>
                                            <td className="px-6 py-4 text-slate-600">Desalineado con alto ticket</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-slate-700">Compliance</td>
                                            <td className="px-6 py-4"><span className="inline-flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded text-xs">🟧 Latente</span></td>
                                            <td className="px-6 py-4 text-slate-600">Riesgo de limitación algorítmica</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 bg-slate-50 p-2 rounded text-center">
                                Nota: Ningún punto aislado explica la pérdida de autoridad. El impacto emerge de su combinación sistémica.
                            </p>
                        </section>

                        {/* 3. HALLAZGO CLINICO 1 (PARTIAL) */}
                        <section className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-serif font-bold text-slate-500">3</div>
                                <h3 className="font-serif font-bold text-xl text-surgical-gray uppercase tracking-wide">Hallazgo Clínico #1: Comunicación Visual</h3>
                            </div>

                            <div className="mb-6">
                                <p className="font-bold text-slate-700 mb-2">Observación Sistémica:</p>
                                <p className="mb-4">El sistema detectó una incongruencia estética recurrente entre el contenido clínico, el contenido personal y la evidencia quirúrgica publicada.</p>
                                <p className="italic text-slate-500 mb-6 border-l-2 border-red-300 pl-4">"Esto genera una narrativa visual fragmentada."</p>

                                <div className="bg-red-50 p-4 rounded-lg mb-6">
                                    <p className="font-bold text-red-800 mb-1">Veredicto Clínico:</p>
                                    <p className="text-red-700 text-sm">🟥 Disonancia Estética y Riesgo de Percepción</p>
                                    <p className="text-red-900/70 text-sm mt-2">
                                        Cuando la evidencia quirúrgica se expone sin un blindaje estético adecuado, la autoridad médica se transforma progresivamente en una galería de impacto emocional, no de confianza clínica.
                                    </p>
                                </div>
                            </div>

                            {/* BLUR START */}
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    <Lock size={12} /> Análisis Detallado — Bajo Custodia
                                </div>
                                <div className="filter blur-[6px] select-none opacity-60">
                                    <p className="mb-4">Se identificaron patrones específicos en la secuencia de publicaciones que provocan una ruptura entre expectativa y percepción del paciente decisor…</p>
                                    <p className="mb-4">Esta ruptura suele correlacionar con la llegada de pacientes que priorizan precio, comparan procedimientos sin contexto clínico y presentan baja adherencia al proceso quirúrgico…</p>
                                    <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                            </div>
                        </section>

                        {/* 4. HALLAZGO CLINICO 2 (PARTIAL) */}
                        <section className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-serif font-bold text-slate-500">4</div>
                                <h3 className="font-serif font-bold text-xl text-surgical-gray uppercase tracking-wide">Hallazgo Clínico #2: Lenguaje Médico</h3>
                            </div>

                            <div className="mb-4">
                                <p className="font-bold text-slate-700 mb-1">Patrón Detectado:</p>
                                <p className="text-orange-600 font-medium">🟧 Oscilación entre lenguaje excesivamente técnico y simplificación excesiva del mensaje clínico.</p>
                                <p className="text-xs text-slate-400 mt-2 italic flex items-center gap-1">
                                    <Search size={12} /> Este patrón es altamente frecuente en médicos con formación sólida que no han calibrado su narrativa digital.
                                </p>
                            </div>

                            {/* BLUR START */}
                            <div className="relative mt-6">
                                <div className="filter blur-[6px] select-none opacity-60">
                                    <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <p className="mb-4 font-bold text-slate-700">Consecuencia observada en perfiles similares:</p>
                                    <ul className="list-disc pl-5 mb-4">
                                        <li>Pacientes confundidos que solo preguntan “precio”</li>
                                        <li>Pacientes curiosos sin intención real de procedimiento</li>
                                        <li>Desencanto silencioso del paciente de alto ticket</li>
                                    </ul>
                                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                            </div>
                        </section>

                        {/* 5. HALLAZGO CLINICO 3 (MOSTLY HIDDEN) */}
                        <section className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-serif font-bold text-slate-500">5</div>
                                <h3 className="font-serif font-bold text-xl text-surgical-gray uppercase tracking-wide">Hallazgo Clínico #3: Tipo de Paciente</h3>
                            </div>

                            <p className="text-red-600 font-bold mb-4">🟥 Desalineación entre autoridad proyectada y paciente captado</p>

                            {/* BLUR START */}
                            <div className="relative">
                                <div className="filter blur-[8px] select-none opacity-50">
                                    <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <p className="mb-4">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                                </div>
                                <p className="text-center text-xs text-slate-400 mt-4 italic">
                                    "El sistema no evalúa cantidad de leads, sino calidad psicológica del paciente que llega a consulta."
                                </p>
                            </div>
                        </section>

                        {/* 6. IMPACTO FINANCIERO */}
                        <section className="border-t border-slate-200 pt-8 relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-serif font-bold text-slate-500">6</div>
                                <h3 className="font-serif font-bold text-xl text-surgical-gray uppercase tracking-wide">Impacto Financiero Proyectado</h3>
                            </div>

                            <p className="text-sm text-slate-500 mb-6">Basado en patrones comparativos de clínicas del mismo ticket:</p>

                            <div className="space-y-4 max-w-lg">
                                <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-100 relative overflow-hidden">
                                    <span className="font-bold text-red-800 text-sm z-10">Pérdida estimada procedimientos:</span>
                                    <div className="bg-red-200/50 absolute inset-0 filter blur-sm"></div>
                                    <span className="font-mono font-bold text-red-800 z-10 blur-[4px] select-none">USD $12,500</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200 relative overflow-hidden">
                                    <span className="font-bold text-slate-700 text-sm z-10">Incremento consultas improductivas:</span>
                                    <span className="font-mono font-bold text-slate-500 z-10 blur-[4px] select-none">+35%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200 relative overflow-hidden">
                                    <span className="font-bold text-slate-700 text-sm z-10">Erosión percepción premium:</span>
                                    <span className="font-mono font-bold text-slate-500 z-10 blur-[4px] select-none">CRÍTICA</span>
                                </div>
                            </div>
                        </section>

                        {/* 7. VEREDICTO FINAL */}
                        <section className="bg-slate-900 text-white p-8 rounded-xl relative overflow-hidden shadow-2xl">
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-serif font-bold text-white">7</div>
                                <h3 className="font-serif font-bold text-xl uppercase tracking-wide">Veredicto Final</h3>
                            </div>

                            <p className="text-lg md:text-xl font-serif leading-relaxed mb-6 italic relative z-10">
                                "El problema no es su nivel médico. Es que su ecosistema digital no lo está defendiendo."
                            </p>

                            <p className="text-sm text-slate-400 relative z-10">
                                La mayoría de estos factores no son evidentes para el propio médico, porque no se perciben desde dentro del sistema, sino desde la mirada del paciente decisor.
                            </p>

                            {/* Texture */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        </section>

                        {/* 8. PROTOCOLO DE CUSTODIA (CTA) */}
                        <section className="text-center pt-8 pb-4">
                            <h3 className="font-serif font-bold text-2xl text-surgical-gray mb-6">Protocolo de Custodia Clínica</h3>
                            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                                Al activar Custodia Clínica Digital, su expediente pasa a un sistema vivo que incluye:
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-left max-w-3xl mx-auto">
                                <div className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-cobalt-blue" /> Informe sin restricciones</div>
                                <div className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-cobalt-blue" /> Evidencia visual anotada</div>
                                <div className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-cobalt-blue" /> Estrategia personalizada</div>
                                <div className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-cobalt-blue" /> Mockup correctivo</div>
                                <div className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-cobalt-blue" /> Supervisión continua</div>
                                <div className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-cobalt-blue" /> Soporte de ingeniería</div>
                            </div>

                            <button
                                onClick={onClose}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cobalt-blue text-white font-bold rounded-lg shadow-xl hover:bg-blue-900 transition-all uppercase tracking-widest text-sm"
                            >
                                <Lock size={16} className="text-blue-300" /> Acceder al Expediente Clínico Completo
                            </button>
                            <p className="text-xs text-slate-400 mt-3 font-mono">Acceso individual, confidencial y no reutilizable</p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SampleReportModal;
