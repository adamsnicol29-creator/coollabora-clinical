const AuditCard = ({ title, score, status, description, icon: Icon, isCritical, onInfo }) => {
    const isStatusObject = typeof status === 'object' && status !== null;
    const label = isStatusObject ? status.label : status;
    const badgeClasses = isStatusObject
        ? `font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border ${status.color}`
        : `font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border ${isCritical ? 'border-red-200 text-red-600 bg-red-50' : 'border-slate-200 text-slate-500'}`;

    return (
        <div className={`p-8 border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group h-full`}>
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-cobalt-blue transition-colors"></div>
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-serif font-bold text-xl text-surgical-gray flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isCritical ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-surgical-gray'}`}>
                        {Icon && <Icon size={20} />}
                    </div>
                    {title}
                    <button onClick={onInfo} className="text-slate-500 hover:text-blue-700 transition-colors ml-2" title="Ver Metodología">
                        <div className="w-5 h-5 rounded-full border border-slate-400 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center text-[11px] font-serif font-bold italic">i</div>
                    </button>
                </h3>
                <span className={badgeClasses}>
                    {label}
                </span>
            </div>
            <div className="mb-4">
                <span className="text-4xl font-serif font-bold text-surgical-gray">{typeof score === 'number' ? score : '-'}</span>
                <span className="text-xs text-slate-400 ml-1">/ 10</span>
            </div>
            <p className="text-slate-600 font-sans leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
};

export default AuditCard;
