import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Lock, RefreshCw, Pencil, X, Image } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    event: string;
    detail: string;
    description: string;
    date: string;
    color: string;
    iconBg: string;
}

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    technologies: string[];
    techRaw?: string;          // raw comma-separated string while editing
    image: string;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    badge?: string;
    badgeColor?: string;
    secondaryBadge?: string;
    secondaryBadgeColor?: string;
    order?: number;
}

const EMPTY_PROJECT: Project = {
    id: '',
    title: '',
    description: '',
    category: 'Web',
    technologies: [],
    techRaw: '',
    image: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    badge: '',
    badgeColor: '',
    secondaryBadge: '',
    secondaryBadgeColor: '',
    order: 0,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const inputCls = 'bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 w-full';
const labelCls = 'block text-xs text-gray-400 mb-1';

interface ProjectFormProps {
    project: Project;
    setProject: (p: Project) => void;
    onSave: () => void;
    onCancel?: () => void;
    isEdit?: boolean;
    imgError: boolean;
    setImgError: (v: boolean) => void;
}

const convertGDriveUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
        const match = url.match(/\/d\/([^/]+)/);
        if (match && match[1]) {
            return `https://lh3.googleusercontent.com/d/${match[1]}`;
        }
    }
    return url;
};

const ProjectForm: React.FC<ProjectFormProps> = ({ project, setProject, onSave, onCancel, isEdit = false, imgError, setImgError }) => (
    <div className="grid grid-cols-1 gap-4">
        {/* Title + Category row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className={labelCls}>Title *</label>
                <input type="text" placeholder="Project Title" value={project.title}
                    onChange={e => setProject({ ...project, title: e.target.value })} className={inputCls} />
            </div>
            <div>
                <label className={labelCls}>Category *</label>
                <select value={project.category} onChange={e => setProject({ ...project, category: e.target.value })} className={inputCls}>
                    <option value="Web">Web</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Other">Other</option>
                </select>
            </div>
        </div>

        {/* Description */}
        <div>
            <label className={labelCls}>Description *</label>
            <textarea placeholder="Project Description" value={project.description}
                onChange={e => setProject({ ...project, description: e.target.value })}
                className={inputCls} rows={3} />
        </div>

        {/* Technologies */}
        <div>
            <label className={labelCls}>Technologies (comma-separated)</label>
            <input type="text" placeholder="React, Node.js, MongoDB"
                value={project.techRaw ?? project.technologies.join(', ')}
                onChange={e => setProject({ ...project, techRaw: e.target.value })}
                className={inputCls} />
        </div>

        {/* Image URL */}
        <div>
            <label className={labelCls}><Image className="inline w-3 h-3 mr-1" />Image URL</label>
            <input type="url" placeholder="https://example.com/image.png"
                value={project.image}
                onChange={e => { 
                    const val = convertGDriveUrl(e.target.value);
                    setProject({ ...project, image: val }); 
                    setImgError(false); 
                }}
                className={inputCls} />
            {project.image && !imgError && (
                <img src={project.image} alt="preview" onError={() => setImgError(true)}
                    className="mt-2 h-24 w-full object-cover rounded-lg border border-cyan-500/20" />
            )}
            {project.image && imgError && (
                <p className="text-xs text-red-400 mt-1">⚠️ Could not load image preview — double-check the URL.</p>
            )}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className={labelCls}>Live URL</label>
                <input type="url" placeholder="https://yourproject.com"
                    value={project.liveUrl || ''} onChange={e => setProject({ ...project, liveUrl: e.target.value })} className={inputCls} />
            </div>
            <div>
                <label className={labelCls}>GitHub URL</label>
                <input type="url" placeholder="https://github.com/..."
                    value={project.githubUrl || ''} onChange={e => setProject({ ...project, githubUrl: e.target.value })} className={inputCls} />
            </div>
        </div>

        {/* Badges + Order */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label className={labelCls}>Badge</label>
                <input type="text" placeholder="e.g. NEW"
                    value={project.badge || ''} onChange={e => setProject({ ...project, badge: e.target.value })} className={inputCls} />
            </div>
            <div>
                <label className={labelCls}>Badge Color</label>
                <select value={project.badgeColor || ''} onChange={e => setProject({ ...project, badgeColor: e.target.value })} className={inputCls}>
                    <option value="">None</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="blue">Blue</option>
                    <option value="orange">Orange</option>
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                </select>
            </div>
            <div>
                <label className={labelCls}>2nd Badge</label>
                <input type="text" placeholder="e.g. HOT"
                    value={project.secondaryBadge || ''} onChange={e => setProject({ ...project, secondaryBadge: e.target.value })} className={inputCls} />
            </div>
            <div>
                <label className={labelCls}>2nd Badge Color</label>
                <select value={project.secondaryBadgeColor || ''} onChange={e => setProject({ ...project, secondaryBadgeColor: e.target.value })} className={inputCls}>
                    <option value="">None</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="blue">Blue</option>
                    <option value="orange">Orange</option>
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                </select>
            </div>
        </div>

        {/* Featured + Order */}
        <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={project.featured}
                    onChange={e => setProject({ ...project, featured: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm text-gray-300">Featured</span>
            </label>
            <div className="flex items-center gap-2">
                <label className={labelCls + ' mb-0'}>Display Order:</label>
                <input type="number" value={project.order ?? 0}
                    onChange={e => setProject({ ...project, order: Number(e.target.value) })}
                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-3 py-1 text-white w-20 focus:outline-none focus:border-cyan-500" />
            </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-2">
            <button onClick={onSave}
                className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isEdit ? 'Save Changes' : 'Add Project'}
            </button>
            {onCancel && (
                <button onClick={onCancel}
                    className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                </button>
            )}
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authToken, setAuthToken] = useState('');
    const [activeTab, setActiveTab] = useState<'achievements' | 'projects' | 'resume'>('achievements');
    const [loading, setLoading] = useState(false);

    // Achievements state
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [newAchievement, setNewAchievement] = useState<Achievement>({
        id: '',
        title: '',
        event: '',
        detail: '',
        description: '',
        date: '',
        color: 'from-yellow-400 to-orange-500',
        iconBg: 'bg-yellow-500',
    });

    // Projects state
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProject, setNewProject] = useState<Project>({ ...EMPTY_PROJECT });
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [imagePreviewError, setImagePreviewError] = useState(false);
    const [editImagePreviewError, setEditImagePreviewError] = useState(false);

    // Resume state
    const [resumeUrl, setResumeUrl] = useState('');
    const [newResumeUrl, setNewResumeUrl] = useState('');

    useEffect(() => {
        const savedToken = sessionStorage.getItem('adminToken');
        if (savedToken) {
            setAuthToken(savedToken);
            setIsAuthenticated(true);
            loadData();
        }
        // eslint-disable-next-line
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [achievementsRes, projectsRes, resumeRes] = await Promise.all([
                fetch(`${API_URL}/achievements`),
                fetch(`${API_URL}/projects`),
                fetch(`${API_URL}/resume`),
            ]);
            setAchievements(await achievementsRes.json());
            const projectsData = await projectsRes.json();
            setProjects(projectsData.sort((a: Project, b: Project) => (a.order ?? 0) - (b.order ?? 0)));
            const resumeData = await resumeRes.json();
            setResumeUrl(resumeData.url);
            setNewResumeUrl(resumeData.url);
        } catch (error) {
            alert('Error loading data. Make sure the backend server is running.');
        }
        setLoading(false);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (data.success) {
                setAuthToken(data.token);
                setIsAuthenticated(true);
                sessionStorage.setItem('adminToken', data.token);
                loadData();
            } else {
                alert('Incorrect password!');
            }
        } catch {
            alert('Error connecting to server. Make sure the backend is running.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAuthToken('');
        sessionStorage.removeItem('adminToken');
    };

    // ==================== ACHIEVEMENTS ====================

    const addAchievement = async () => {
        if (!newAchievement.title || !newAchievement.event) {
            alert('Please fill in required fields (Title and Event)');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/achievements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(newAchievement),
            });
            if (response.ok) {
                const achievement = await response.json();
                setAchievements([...achievements, achievement]);
                setNewAchievement({ id: '', title: '', event: '', detail: '', description: '', date: '', color: 'from-yellow-400 to-orange-500', iconBg: 'bg-yellow-500' });
                alert('Achievement added!');
            } else { alert('Error adding achievement'); }
        } catch { alert('Error connecting to server'); }
    };

    const deleteAchievement = async (id: string) => {
        if (!window.confirm('Delete this achievement?')) return;
        try {
            const response = await fetch(`${API_URL}/achievements/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            if (response.ok) {
                setAchievements(achievements.filter(a => a.id !== id));
            } else { alert('Error deleting achievement'); }
        } catch { alert('Error connecting to server'); }
    };

    // ==================== PROJECTS ====================

    const cleanProject = (p: Project) => {
        const { id, techRaw, ...rest } = p;
        const techsFromRaw = techRaw !== undefined
            ? techRaw.split(',').map(t => t.trim()).filter(Boolean)
            : rest.technologies;
        return {
            ...rest,
            technologies: techsFromRaw.length > 0 ? techsFromRaw : (Array.isArray(rest.technologies) ? rest.technologies : []),
            featured: Boolean(rest.featured),
            order: Number(rest.order) || 0,
        };
    };

    const addProject = async () => {
        if (!newProject.title || !newProject.description) {
            alert('Please fill in Title and Description');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(cleanProject(newProject)),
            });
            if (response.ok) {
                const project = await response.json();
                setProjects([...projects, project].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
                setNewProject({ ...EMPTY_PROJECT });
                setImagePreviewError(false);
                alert('Project added!');
            } else { alert('Error adding project'); }
        } catch { alert('Error connecting to server'); }
    };

    const saveEditProject = async () => {
        if (!editingProject) return;
        if (!editingProject.title || !editingProject.description) {
            alert('Please fill in Title and Description');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/projects/${editingProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(cleanProject(editingProject)),
            });
            if (response.ok) {
                const updated = await response.json();
                setProjects(projects.map(p => p.id === updated.id ? updated : p).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
                setEditingProject(null);
                setEditImagePreviewError(false);
                alert('Project updated!');
            } else { alert('Error updating project'); }
        } catch { alert('Error connecting to server'); }
    };

    const deleteProject = async (id: string) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            const response = await fetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            if (response.ok) {
                setProjects(projects.filter(p => p.id !== id));
            } else { alert('Error deleting project'); }
        } catch { alert('Error connecting to server'); }
    };

    // ==================== RESUME ====================

    const updateResumeUrl = async () => {
        if (!newResumeUrl.trim()) { alert('Please enter a resume URL'); return; }
        try {
            const response = await fetch(`${API_URL}/resume`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify({ url: newResumeUrl }),
            });
            if (response.ok) {
                const data = await response.json();
                setResumeUrl(data.url);
                alert('Resume URL updated!');
            } else { alert('Error updating resume URL'); }
        } catch { alert('Error connecting to server'); }
    };

    // ==================== LOGIN SCREEN ====================


    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-black/60 border border-cyan-500/30 rounded-xl p-8 max-w-md w-full">
                    <div className="flex items-center justify-center mb-6">
                        <Lock className="w-12 h-12 text-cyan-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-cyan-400 text-center mb-6">Admin Login</h1>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleLogin()}
                        placeholder="Enter admin password"
                        className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-cyan-500" />
                    <button onClick={handleLogin}
                        className="w-full bg-cyan-500 text-black font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors">
                        Login
                    </button>
                    <p className="text-gray-500 text-xs text-center mt-4">Backend must be running on port 5000</p>
                </motion.div>
            </div>
        );
    }

    // ==================== DASHBOARD ====================

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-4 pb-10">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <button onClick={loadData} className="text-cyan-400 hover:text-cyan-300 transition-colors" title="Refresh">
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <button onClick={handleLogout}
                        className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors">
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    {(['achievements', 'projects', 'resume'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors capitalize ${activeTab === tab
                                ? 'bg-cyan-500 text-black'
                                : 'bg-black/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'}`}>
                            {tab === 'achievements' ? `Achievements (${achievements.length})`
                                : tab === 'projects' ? `Projects (${projects.length})`
                                    : 'Resume URL'}
                        </button>
                    ))}
                </div>

                {/* ===== ACHIEVEMENTS TAB ===== */}
                {activeTab === 'achievements' && (
                    <div>
                        <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5" /> Add New Achievement
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: 'title', placeholder: 'Title (e.g., Winner, 2nd Place)' },
                                    { key: 'event', placeholder: 'Event Name' },
                                    { key: 'detail', placeholder: 'Detail (e.g., 1st among 1000+ teams)' },
                                    { key: 'date', placeholder: 'Date (e.g., Feb 2025)' },
                                ].map(({ key, placeholder }) => (
                                    <input key={key} type="text" placeholder={placeholder}
                                        value={(newAchievement as any)[key]}
                                        onChange={e => setNewAchievement({ ...newAchievement, [key]: e.target.value })}
                                        className={inputCls} />
                                ))}
                                <select value={newAchievement.color}
                                    onChange={e => setNewAchievement({ ...newAchievement, color: e.target.value })}
                                    className={inputCls}>
                                    <option value="from-yellow-400 to-orange-500">Gold</option>
                                    <option value="from-cyan-400 to-blue-500">Cyan/Blue</option>
                                    <option value="from-green-400 to-emerald-500">Green</option>
                                    <option value="from-purple-400 to-pink-500">Purple/Pink</option>
                                    <option value="from-red-400 to-rose-500">Red/Rose</option>
                                </select>
                                <textarea placeholder="Description"
                                    value={newAchievement.description}
                                    onChange={e => setNewAchievement({ ...newAchievement, description: e.target.value })}
                                    className={inputCls + ' md:col-span-2'} rows={3} />
                            </div>
                            <button onClick={addAchievement}
                                className="mt-4 bg-cyan-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2">
                                <Save className="w-4 h-4" /> Add Achievement
                            </button>
                        </div>
                        <div className="space-y-4">
                            {achievements.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No achievements yet.</p>
                            )}
                            {achievements.map(a => (
                                <div key={a.id} className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className={`text-lg font-bold bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}>
                                            {a.title} — {a.event}
                                        </h3>
                                        <p className="text-cyan-300 text-sm">{a.detail}</p>
                                        <p className="text-gray-400 text-sm mt-1">{a.description}</p>
                                        <p className="text-gray-500 text-xs mt-2">{a.date}</p>
                                    </div>
                                    <button onClick={() => deleteAchievement(a.id)} className="text-red-400 hover:text-red-300 transition-colors ml-4">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== PROJECTS TAB ===== */}
                {activeTab === 'projects' && (
                    <div>
                        {/* Add new project */}
                        <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5" /> Add New Project
                            </h2>
                            <ProjectForm
                                project={newProject}
                                setProject={setNewProject}
                                onSave={addProject}
                                imgError={imagePreviewError}
                                setImgError={setImagePreviewError}
                            />
                        </div>

                        {/* Projects list */}
                        <div className="space-y-4">
                            {projects.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No projects yet.</p>
                            )}
                            {projects.map(project => (
                                <div key={project.id}>
                                    {/* Edit mode */}
                                    <AnimatePresence>
                                        {editingProject?.id === project.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-black/80 border border-cyan-400/50 rounded-xl p-6 mb-2"
                                            >
                                                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                                    <Pencil className="w-4 h-4" /> Editing: {project.title}
                                                </h3>
                                                <ProjectForm
                                                    project={editingProject}
                                                    setProject={setEditingProject}
                                                    onSave={saveEditProject}
                                                    onCancel={() => { setEditingProject(null); setEditImagePreviewError(false); }}
                                                    isEdit
                                                    imgError={editImagePreviewError}
                                                    setImgError={setEditImagePreviewError}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Project card */}
                                    {editingProject?.id !== project.id && (
                                        <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 flex gap-4">
                                            {/* Thumbnail */}
                                            {project.image ? (
                                                <img src={project.image} alt={project.title}
                                                    className="w-20 h-16 object-cover rounded-lg border border-cyan-500/20 flex-shrink-0"
                                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                            ) : (
                                                <div className="w-20 h-16 bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Image className="w-6 h-6 text-cyan-500/30" />
                                                </div>
                                            )}

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-lg font-bold text-cyan-400">{project.title}</h3>
                                                    <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
                                                        {project.category}
                                                    </span>
                                                    {project.featured && (
                                                        <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded">
                                                            ⭐ Featured
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-500">Order: {project.order ?? 0}</span>
                                                </div>
                                                <p className="text-gray-300 text-sm mt-1 line-clamp-2">{project.description}</p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {project.technologies.slice(0, 5).map((t, i) => (
                                                        <span key={i} className="bg-cyan-500/10 text-cyan-400 text-xs px-2 py-0.5 rounded border border-cyan-500/20">
                                                            {t}
                                                        </span>
                                                    ))}
                                                    {project.technologies.length > 5 && (
                                                        <span className="text-xs text-gray-500">+{project.technologies.length - 5} more</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => { setEditingProject({ ...project, techRaw: project.technologies.join(', ') }); setEditImagePreviewError(false); }}
                                                    className="text-cyan-400 hover:text-cyan-300 transition-colors p-1.5 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10"
                                                    title="Edit">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteProject(project.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors p-1.5 border border-red-500/30 rounded-lg hover:bg-red-500/10"
                                                    title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== RESUME TAB ===== */}
                {activeTab === 'resume' && (
                    <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-4">Update Resume URL</h2>
                        <p className="text-gray-400 text-sm mb-4">
                            Enter your Google Drive link or direct PDF URL. Used when users click the RESUME button.
                        </p>
                        {resumeUrl && (
                            <div className="mb-4 p-3 bg-black/30 border border-cyan-500/20 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Current URL:</p>
                                <p className="text-cyan-400 text-sm break-all">{resumeUrl}</p>
                            </div>
                        )}
                        <input type="url"
                            placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
                            value={newResumeUrl} onChange={e => setNewResumeUrl(e.target.value)}
                            className={inputCls + ' mb-4'} />
                        <button onClick={updateResumeUrl}
                            className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2">
                            <Save className="w-4 h-4" /> Update Resume URL
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
