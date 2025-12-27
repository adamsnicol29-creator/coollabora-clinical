import { useState, useEffect } from 'react';
import {
    Shield, Lock, Loader2, LogOut,
    FileText, Clock, CheckCircle, AlertTriangle,
    Upload, Eye, Video, MessageSquare
} from 'lucide-react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import EvidenceStation from '../components/EvidenceStation';

// ============================================
// ADMIN LOGIN COMPONENT
// ============================================
const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            onLogin();
        } catch (err) {
            setError('Credenciales inválidas. Acceso restringido a Auditores Senior.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield size={32} className="text-slate-600" />
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-slate-800">
                        Estación de Auditoría
                    </h1>
                    <p className="text-sm text-slate-500 mt-2">
                        Acceso restringido a Consultores Senior
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email de Auditor"
                        className="w-full p-4 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Clave de Acceso"
                        className="w-full p-4 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                        Acceder a Estación
                    </button>
                </form>
            </div>
        </div>
    );
};

// ============================================
// AUDIT CARD COMPONENT
// ============================================
const AuditCard = ({ audit, onSelect }) => {
    const statusColors = {
        pending_review: 'bg-amber-100 text-amber-700 border-amber-200',
        in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
        completed: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };

    const statusLabels = {
        pending_review: 'Pendiente de Revisión',
        in_progress: 'En Proceso',
        completed: 'Completado'
    };

    const restrictionLabels = {
        AGE_RESTRICTED: 'Contenido +18',
        PRIVATE: 'Perfil Privado'
    };

    return (
        <div
            onClick={() => onSelect(audit)}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <FileText size={20} className="text-slate-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{audit.instagramUrl?.split('instagram.com/')[1]?.split('/')[0] || 'N/A'}</h3>
                        <p className="text-xs text-slate-500">
                            {audit.createdAt?.toDate?.()?.toLocaleDateString('es-CO') || 'Fecha desconocida'}
                        </p>
                    </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[audit.auditStatus] || statusColors.pending_review}`}>
                    {statusLabels[audit.auditStatus] || 'Pendiente'}
                </span>
            </div>

            {audit.restrictionType && (
                <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                    <Lock size={12} />
                    {restrictionLabels[audit.restrictionType] || audit.restrictionType}
                </div>
            )}

            <div className="flex gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                    <Upload size={12} />
                    {audit.manualEvidence?.screenshots?.length || 0} Screenshots
                </div>
                <div className="flex items-center gap-1">
                    <Video size={12} />
                    {audit.manualEvidence?.videos?.length || 0} Videos
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <span className="text-xs text-blue-600 group-hover:text-blue-800 font-medium">
                    Abrir Estación →
                </span>
            </div>
        </div>
    );
};

// ============================================
// MAIN ADMIN PAGE
// ============================================
const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [audits, setAudits] = useState([]);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [filter, setFilter] = useState('pending_review');

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setLoading(false);
            if (user) {
                loadAudits();
            }
        });
        return () => unsubscribe();
    }, []);

    const loadAudits = async () => {
        try {
            const db = getFirestore();
            const q = query(
                collection(db, 'audits'),
                where('auditStatus', '==', filter),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const auditList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAudits(auditList);
        } catch (err) {
            console.error('Error loading audits:', err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadAudits();
        }
    }, [filter, isAuthenticated]);

    const handleLogout = async () => {
        const auth = getAuth();
        await signOut(auth);
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-400" size={40} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    // If an audit is selected, show the Evidence Station
    if (selectedAudit) {
        return (
            <EvidenceStation
                audit={selectedAudit}
                onBack={() => { setSelectedAudit(null); loadAudits(); }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Shield size={24} className="text-slate-600" />
                        <h1 className="font-serif text-xl font-bold text-slate-800">
                            Estación de Auditoría
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm"
                    >
                        <LogOut size={16} />
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex gap-2 mb-6">
                    {[
                        { key: 'pending_review', label: 'Pendientes', icon: Clock },
                        { key: 'in_progress', label: 'En Proceso', icon: Eye },
                        { key: 'completed', label: 'Completados', icon: CheckCircle }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === key
                                ? 'bg-slate-800 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Audit Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {audits.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-400">
                            No hay auditorías {filter === 'pending_review' ? 'pendientes' : filter === 'in_progress' ? 'en proceso' : 'completadas'}
                        </div>
                    ) : (
                        audits.map(audit => (
                            <AuditCard
                                key={audit.id}
                                audit={audit}
                                onSelect={setSelectedAudit}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;

