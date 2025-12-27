import { useState, useEffect } from 'react';

const CountdownTimer = ({ initialMinutes = 15 }) => {
    const [seconds, setSeconds] = useState(initialMinutes * 60);

    useEffect(() => {
        if (seconds <= 0) return;
        const interval = setInterval(() => setSeconds(s => s - 1), 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeString = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    return (
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-100 border border-amber-200 text-amber-800 px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-widest animate-pulse">
            <span className="w-2 h-2 bg-amber-600 rounded-full animate-ping"></span>
            Acceso al Informe de Reingeniería reservado por: {timeString} min
        </div>
    );
};

export default CountdownTimer;
