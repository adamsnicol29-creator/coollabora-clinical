import { CheckCircle } from 'lucide-react';

const ProgressModal = ({ progress, status }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]/80 backdrop-blur-sm">
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cobalt-blue to-teal-400"></div>

            <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#E2E8F0"
                            strokeWidth="4"
                            fill="transparent"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#0047AB"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={226}
                            strokeDashoffset={226 - (226 * progress) / 100}
                            className="transition-all duration-500 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold text-surgical-gray">
                        {Math.round(progress)}%
                    </div>
                </div>

                <h3 className="font-serif text-xl text-surgical-gray mb-2">Auditoría en Curso</h3>
                <p className="font-mono text-xs text-slate-500 uppercase tracking-widest animate-pulse">
                    {status}
                </p>

                <div className="mt-6 w-full space-y-2">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        {progress > 30 ? <CheckCircle size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>}
                        <span>Análisis de Redes Sociales</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        {progress > 60 ? <CheckCircle size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>}
                        <span>Escaneo de Retina Digital (Web)</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        {progress > 90 ? <CheckCircle size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>}
                        <span>Generación de Veredicto Clínico</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ProgressModal;
