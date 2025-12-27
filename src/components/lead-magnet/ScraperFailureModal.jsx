import { AlertTriangle, Scan, X } from 'lucide-react';

const ScraperFailureModal = ({ isOpen, onClose, onRetry }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-md p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full border-l-4 border-red-500 relative animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cerrar"
                >
                    <X size={20} />
                </button>

                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600 mx-auto">
                    <AlertTriangle size={24} />
                </div>
                <h3 className="font-serif font-bold text-xl text-surgical-gray mb-3 text-center uppercase tracking-wide">
                    Interrupción de Protocolo de Auditoría
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed text-center mb-6 font-sans">
                    Nuestros sistemas de alta precisión han detectado una restricción temporal en la conexión con la arquitectura de Instagram.
                    <br /><br />
                    Para garantizar un diagnóstico de autoridad con el rigor que su clínica merece, no podemos procesar un expediente basado en datos incompletos.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-xs text-slate-500 text-center">
                    <strong>Acción Requerida:</strong> Por favor, verifique que su perfil sea público y que la URL sea correcta. Intentaremos un nuevo escaneo de alta resolución en 60 segundos.
                </div>
                <button
                    onClick={() => { onClose(); onRetry(); }}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 mb-3"
                >
                    <Scan size={16} /> Re-ejecutar Escaneo de Autoridad
                </button>
                <button
                    onClick={onClose}
                    className="w-full text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors"
                >
                    ← Volver al Inicio
                </button>
            </div>
        </div>
    );
};

export default ScraperFailureModal;
