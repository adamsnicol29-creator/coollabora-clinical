const RiskTrafficLight = ({ score }) => {
    return (
        <div className="flex items-center gap-1 mb-4">
            <div className={`h-2 flex-1 rounded-l-sm ${score > 5 ? 'bg-slate-200' : 'bg-red-500'}`}></div>
            <div className={`h-2 flex-1 bg-slate-200 opacity-30`}></div>
            <div className={`h-2 flex-1 rounded-r-sm ${score > 8 ? 'bg-green-500' : 'bg-slate-200 opacity-30'}`}></div>
        </div>
    );
};

export default RiskTrafficLight;
