import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Lock, RefreshCw } from 'lucide-react';

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
    technologies: string[];
    github?: string;
    demo?: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    const [newProject, setNewProject] = useState<Project>({
        id: '',
        title: '',
        description: '',
        technologies: [],
        github: '',
        demo: '',
    });

    // Resume state
    const [resumeUrl, setResumeUrl] = useState('');
    const [newResumeUrl, setNewResumeUrl] = useState('');

    // Check for saved auth
    useEffect(() => {
        const savedToken = sessionStorage.getItem('adminToken');
        if (savedToken) {
            setAuthToken(savedToken);
            setIsAuthenticated(true);
            loadData();
        }
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load achievements
            const achievementsRes = await fetch(`${API_URL}/achievements`);
            const achievementsData = await achievementsRes.json();
            setAchievements(achievementsData);

            // Load projects
            const projectsRes = await fetch(`${API_URL}/projects`);
            const projectsData = await projectsRes.json();
            setProjects(projectsData);

            // Load resume URL
            const resumeRes = await fetch(`${API_URL}/resume`);
            const resumeData = await resumeRes.json();
            setResumeUrl(resumeData.url);
            setNewResumeUrl(resumeData.url);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading data. Make sure the backend server is running.');
        }
        setLoading(false);
    };

    const updateResumeUrl = async () => {
        if (!newResumeUrl.trim()) {
            alert('Please enter a resume URL');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/resume`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Password': authToken,
                },
                body: JSON.stringify({ url: newResumeUrl }),
            });

            if (response.ok) {
                const data = await response.json();
                setResumeUrl(data.url);
                alert('Resume URL updated successfully!');
            } else {
                alert('Error updating resume URL');
            }
        } catch (error) {
            alert('Error connecting to server');
        }
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
        } catch (error) {
            alert('Error connecting to server. Make sure the backend is running.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAuthToken('');
        sessionStorage.removeItem('adminToken');
    };

    // Achievement functions
    const addAchievement = async () => {
        if (!newAchievement.title || !newAchievement.event) {
            alert('Please fill in required fields (Title and Event)');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/achievements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Password': authToken,
                },
                body: JSON.stringify(newAchievement),
            });

            if (response.ok) {
                const achievement = await response.json();
                setAchievements([...achievements, achievement]);
                setNewAchievement({
                    id: '',
                    title: '',
                    event: '',
                    detail: '',
                    description: '',
                    date: '',
                    color: 'from-yellow-400 to-orange-500',
                    iconBg: 'bg-yellow-500',
                });
                alert('Achievement added successfully!');
            } else {
                alert('Error adding achievement');
            }
        } catch (error) {
            alert('Error connecting to server');
        }
    };

    const deleteAchievement = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this achievement?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/achievements/${id}`, {
                method: 'DELETE',
                headers: { 'X-Admin-Password': authToken },
            });

            if (response.ok) {
                setAchievements(achievements.filter(a => a.id !== id));
                alert('Achievement deleted successfully!');
            } else {
                alert('Error deleting achievement');
            }
        } catch (error) {
            alert('Error connecting to server');
        }
    };

    // Project functions
    const addProject = async () => {
        if (!newProject.title || !newProject.description) {
            alert('Please fill in required fields (Title and Description)');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Password': authToken,
                },
                body: JSON.stringify(newProject),
            });

            if (response.ok) {
                const project = await response.json();
                setProjects([...projects, project]);
                setNewProject({
                    id: '',
                    title: '',
                    description: '',
                    technologies: [],
                    github: '',
                    demo: '',
                });
                alert('Project added successfully!');
            } else {
                alert('Error adding project');
            }
        } catch (error) {
            alert('Error connecting to server');
        }
    };

    const deleteProject = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE',
                headers: { 'X-Admin-Password': authToken },
            });

            if (response.ok) {
                setProjects(projects.filter(p => p.id !== id));
                alert('Project deleted successfully!');
            } else {
                alert('Error deleting project');
            }
        } catch (error) {
            alert('Error connecting to server');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/60 border border-cyan-500/30 rounded-xl p-8 max-w-md w-full"
                >
                    <div className="flex items-center justify-center mb-6">
                        <Lock className="w-12 h-12 text-cyan-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-cyan-400 text-center mb-6">Admin Login</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Enter admin password"
                        className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-cyan-500 text-black font-bold py-3 rounded-lg hover:bg-cyan-400 transition-colors"
                    >
                        Login
                    </button>
                    <p className="text-gray-400 text-sm text-center mt-4">
                        Default password: admin123
                    </p>
                    <p className="text-gray-500 text-xs text-center mt-2">
                        Make sure backend server is running on port 5000
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-4 pb-10">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <button
                            onClick={() => loadData()}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="Refresh data"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('achievements')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'achievements'
                            ? 'bg-cyan-500 text-black'
                            : 'bg-black/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                            }`}
                    >
                        Achievements ({achievements.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'projects'
                            ? 'bg-cyan-500 text-black'
                            : 'bg-black/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                            }`}
                    >
                        Projects ({projects.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('resume')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'resume'
                            ? 'bg-cyan-500 text-black'
                            : 'bg-black/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                            }`}
                    >
                        Resume URL
                    </button>
                </div>

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div>
                        {/* Add New Achievement Form */}
                        <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add New Achievement
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Title (e.g., Winner, 2nd Place, Fellow)"
                                    value={newAchievement.title}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Event Name"
                                    value={newAchievement.event}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, event: e.target.value })}
                                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Detail (e.g., 1st among 1000+ teams)"
                                    value={newAchievement.detail}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, detail: e.target.value })}
                                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Date (e.g., Feb 2025)"
                                    value={newAchievement.date}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                />
                                <select
                                    value={newAchievement.color}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, color: e.target.value })}
                                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                >
                                    <option value="from-yellow-400 to-orange-500">Gold (Yellow/Orange)</option>
                                    <option value="from-cyan-400 to-blue-500">Cyan/Blue</option>
                                    <option value="from-green-400 to-emerald-500">Green/Emerald</option>
                                    <option value="from-purple-400 to-pink-500">Purple/Pink</option>
                                    <option value="from-red-400 to-rose-500">Red/Rose</option>
                                </select>
                                <textarea
                                    placeholder="Description"
                                    value={newAchievement.description}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 md:col-span-2"
                                    rows={3}
                                />
                            </div>
                            <button
                                onClick={addAchievement}
                                className="mt-4 bg-cyan-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Add Achievement
                            </button>
                        </div>

                        {/* Achievements List */}
                        <div className="space-y-4">
                            {achievements.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No achievements yet. Add your first one above!</p>
                            )}
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 flex justify-between items-start"
                                >
                                    <div className="flex-1">
                                        <h3 className={`text-lg font-bold bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`}>
                                            {achievement.title} - {achievement.event}
                                        </h3>
                                        <p className="text-cyan-300 text-sm">{achievement.detail}</p>
                                        <p className="text-gray-400 text-sm mt-1">{achievement.description}</p>
                                        <p className="text-gray-500 text-xs mt-2">{achievement.date}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteAchievement(achievement.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div>
                        {/* Add New Project Form */}
                        <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Add New Project
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    placeholder="Project Title"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                />
                                <textarea
                                    placeholder="Project Description"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                    rows={3}
                                />
                                <input
                                    type="text"
                                    placeholder="Technologies (comma-separated, e.g., React, Node.js, MongoDB)"
                                    value={newProject.technologies.join(', ')}
                                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value.split(',').map(t => t.trim()) })}
                                    className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="url"
                                        placeholder="GitHub URL (optional)"
                                        value={newProject.github}
                                        onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                                        className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                    />
                                    <input
                                        type="url"
                                        placeholder="Demo URL (optional)"
                                        value={newProject.demo}
                                        onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                                        className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={addProject}
                                className="mt-4 bg-cyan-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Add Project
                            </button>
                        </div>

                        {/* Projects List */}
                        <div className="space-y-4">
                            {projects.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No projects yet. Add your first one above!</p>
                            )}
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 flex justify-between items-start"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-cyan-400">{project.title}</h3>
                                        <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.technologies.map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">GitHub</a>}
                                            {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400">Demo</a>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resume Tab */}
                {activeTab === 'resume' && (
                    <div>
                        {/* Update Resume URL Form */}
                        <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-bold text-cyan-400 mb-4">Update Resume URL</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Enter your Google Drive link or direct PDF URL. This will be used when users click the RESUME button.
                            </p>

                            {/* Current URL Display */}
                            {resumeUrl && (
                                <div className="mb-4 p-3 bg-black/30 border border-cyan-500/20 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Current URL:</p>
                                    <p className="text-cyan-400 text-sm break-all">{resumeUrl}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
                                    value={newResumeUrl}
                                    onChange={(e) => setNewResumeUrl(e.target.value)}
                                    className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                />
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <p className="text-blue-400 text-sm font-semibold mb-2">💡 Tips:</p>
                                    <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
                                        <li>For Google Drive: Make sure link sharing is set to "Anyone with the link can view"</li>
                                        <li>For direct PDF: Upload to your server or use a public CDN</li>
                                        <li>Test the link in a new tab before saving</li>
                                    </ul>
                                </div>
                            </div>
                            <button
                                onClick={updateResumeUrl}
                                className="mt-4 bg-cyan-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Update Resume URL
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
