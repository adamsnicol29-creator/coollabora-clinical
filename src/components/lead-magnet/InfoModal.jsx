const InfoModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1120]/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full border border-slate-200 relative animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-cobalt-blue">
                    <span className="font-serif font-bold italic">i</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-surgical-gray mb-3">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans border-t border-slate-100 pt-3">
                    {content}
                </p>
            </div>
        </div>
    );
};

export default InfoModal;
