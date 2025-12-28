/**
 * @component ProjectionTimeline
 * @description Visualization of the 90-Day Authority Correction Protocol.
 * STRICTLY ADHERES TO EXECUTIVE DIRECTIVE PHASE 3:
 * - NO Checklists.
 * - NO Tasks.
 * - Structure: Three 30-day blocks.
 * - Content: Risk -> Bias -> Correction.
 */

import React from 'react';
import { Shield, AlertTriangle, ArrowRight, Brain, Lock } from 'lucide-react';

const ProjectionTimeline = ({ correctionPhases }) => {
    if (!correctionPhases) return null;

    const sprints = [
        {
            id: 'S1',
            days: 'DÍAS 1-30',
            title: 'ESTABILIZACIÓN DE AUTORIDAD',
            data: correctionPhases.phase1,
            color: 'bg-red-50',
            borderColor: 'border-red-200',
            iconColor: 'text-red-600',
            Icon: AlertTriangle
        },
        {
            id: 'S2',
            days: 'DÍAS 31-60',
            title: 'FILTRADO DE PACIENTES',
            data: correctionPhases.phase2,
            color: 'bg-amber-50',
            borderColor: 'border-amber-200',
            iconColor: 'text-amber-600',
            Icon: Shield
        },
        {
            id: 'S3',
            days: 'DÍAS 61-90',
            title: 'CUSTODIA PERMANENTE',
            data: correctionPhases.phase3,
            color: 'bg-slate-50',
            borderColor: 'border-slate-200',
            iconColor: 'text-slate-600',
            Icon: Lock
        }
    ];

    return (
        <div className="w-full space-y-8">
            <div className="text-center mb-10">
                <h3 className="font-serif text-2xl text-slate-800 font-bold mb-2">Protocolo de Corrección de Riesgo</h3>
                <div className="flex items-center justify-center gap-2">
                    <span className="h-px w-8 bg-slate-300"></span>
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Proyección de 90 Días</p>
                    <span className="h-px w-8 bg-slate-300"></span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden lg:block absolute top-6 left-1/6 right-1/6 h-0.5 bg-slate-200 -z-10"></div>

                {sprints.map((sprint, index) => (
                    <div key={sprint.id} className={`relative flex flex-col h-full bg-white rounded-xl border ${sprint.borderColor} shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300`}>
                        {/* Header */}
                        <div className={`${sprint.color} p-4 border-b ${sprint.borderColor}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 bg-white rounded-lg shadow-sm border ${sprint.borderColor}`}>
                                    <sprint.Icon size={20} className={sprint.iconColor} />
                                </div>
                                <span className="text-[10px] font-bold bg-white px-2 py-1 rounded text-slate-500 uppercase tracking-widest border border-slate-100">
                                    {sprint.days}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                                {sprint.title}
                            </h4>
                        </div>

                        {/* Content Blocks */}
                        <div className="p-6 flex-1 space-y-6">

                            {/* BLOCK 1: CURRENT RISK */}
                            <div>
                                <p className="text-[10px] uppercase font-bold text-red-400 mb-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    Riesgo Activo
                                </p>
                                <p className="text-sm font-medium text-slate-700 leading-snug">
                                    "{sprint.data.risk}"
                                </p>
                            </div>

                            {/* BLOCK 2: PATIENT BIAS */}
                            <div className="bg-slate-50 p-4 rounded-lg border-l-2 border-slate-300">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                                    <Brain size={10} />
                                    Sesgo del Paciente
                                </p>
                                <p className="text-sm text-slate-600 italic font-serif">
                                    "{sprint.data.bias}"
                                </p>
                            </div>

                            {/* ARROW */}
                            <div className="flex justify-center text-slate-300">
                                <ArrowRight size={16} className="rotate-90 lg:rotate-0" />
                            </div>

                            {/* BLOCK 3: CORRECTION */}
                            <div>
                                <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1 flex items-center gap-1">
                                    <Shield size={10} />
                                    Estado Corregido
                                </p>
                                <p className="text-sm font-bold text-slate-800 leading-snug">
                                    {sprint.data.correction}
                                </p>
                            </div>
                        </div>

                        {/* Footer decorative */}
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50"></div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <p className="text-xs text-slate-400 italic">
                    * La ejecución de este protocolo requiere supervisión externa para evitar recaídas en sesgos comerciales.
                </p>
            </div>
        </div>
    );
};

export default ProjectionTimeline;
