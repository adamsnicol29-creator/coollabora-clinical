import { Lock } from 'lucide-react';

const ManualReviewPlaceholder = ({ restrictionType }) => {
    const isAgeRestricted = restrictionType === 'AGE_RESTRICTED';
    const isPending = restrictionType === 'PRIVATE' || isAgeRestricted;

    if (!isPending) return null;

    return (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center relative overflow-hidden col-span-2">
            {/* Subtle animated border */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50 animate-pulse"></div>

            <div className="relative z-10">
                {/* Shield Icon - Heraldic/Sobrio */}
                <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                    <Lock size={28} className="text-slate-400" />
                </div>

                <h4 className="font-serif text-lg font-bold text-slate-600 mb-3 uppercase tracking-wider">
                    Expediente bajo Custodia de Nivel 2
                </h4>

                <p className="text-sm text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
                    {isAgeRestricted
                        ? "Debido a su Blindaje de Compliance (+18), este módulo requiere una validación supervisada por un auditor senior."
                        : "Este perfil posee restricciones de privacidad que requieren acceso manual autorizado."
                    }
                </p>

                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-mono border border-amber-200">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    Tiempo estimado de liberación: &lt; 6 horas
                </div>
            </div>
        </div>
    );
};

export default ManualReviewPlaceholder;
