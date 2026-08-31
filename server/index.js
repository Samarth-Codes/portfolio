require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { db } = require('./firebase');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());


// Simple authentication middleware
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD;
if (!AUTH_PASSWORD) {
    console.error('FATAL: ADMIN_PASSWORD environment variable is not set. Refusing to start.');
    process.exit(1);
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        if (!decoded || decoded.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// ==================== ACHIEVEMENTS ROUTES ====================

// Get all achievements (public)
app.get('/api/achievements', async (req, res) => {
    try {
        const snapshot = await db.collection('achievements').get();
        const achievements = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        res.json(achievements);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ error: 'Error fetching achievements' });
    }
});

// Add achievement (protected)
app.post('/api/achievements', verifyToken, async (req, res) => {
    try {
        const docRef = await db.collection('achievements').add({
            ...req.body,
            createdAt: new Date().toISOString()
        });
        const newAchievement = {
            id: docRef.id,
            ...req.body
        };
        res.status(201).json(newAchievement);
    } catch (error) {
        console.error('Error adding achievement:', error);
        res.status(500).json({ error: 'Error adding achievement' });
    }
});

// Update achievement (protected)
app.put('/api/achievements/:id', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('achievements').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Achievement not found' });
        }

        await docRef.update({
            ...req.body,
            updatedAt: new Date().toISOString()
        });

        const updatedDoc = await docRef.get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
        console.error('Error updating achievement:', error);
        res.status(500).json({ error: 'Error updating achievement' });
    }
});

// Delete achievement (protected)
app.delete('/api/achievements/:id', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('achievements').doc(req.params.id);
        await docRef.delete();
        res.json({ message: 'Achievement deleted' });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        res.status(500).json({ error: 'Error deleting achievement', details: error.message });
    }
});

// ==================== PROJECTS ROUTES ====================

// Get all projects (public)
app.get('/api/projects', async (req, res) => {
    try {
        const snapshot = await db.collection('projects').get();
        const projects = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

// Add project (protected)
app.post('/api/projects', verifyToken, async (req, res) => {
    try {
        const docRef = await db.collection('projects').add({
            ...req.body,
            createdAt: new Date().toISOString()
        });
        const newProject = {
            id: docRef.id,
            ...req.body
        };
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ error: 'Error adding project' });
    }
});

// Update project (protected)
app.put('/api/projects/:id', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('projects').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await docRef.update({
            ...req.body,
            updatedAt: new Date().toISOString()
        });

        const updatedDoc = await docRef.get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Error updating project' });
    }
});

// Delete project (protected)
app.delete('/api/projects/:id', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('projects').doc(req.params.id);
        await docRef.delete();
        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Error deleting project', details: error.message });
    }
});

// ==================== RESUME URL ROUTES ====================

// Get resume URL (public)
app.get('/api/resume', async (req, res) => {
    try {
        const docRef = db.collection('settings').doc('resume');
        const doc = await docRef.get();

        if (!doc.exists) {
            // Create default resume URL if it doesn't exist
            const defaultResume = {
                url: 'https://drive.google.com/file/d/1GL1jqtVKS8rzlxX2TJfkqcBUpkNj7Kw6/view?usp=sharing',
                createdAt: new Date().toISOString()
            };
            await docRef.set(defaultResume);
            return res.json(defaultResume);
        }

        res.json(doc.data());
    } catch (error) {
        console.error('Error fetching resume URL:', error);
        res.status(500).json({ error: 'Error fetching resume URL' });
    }
});

// Update resume URL (protected)
app.put('/api/resume', verifyToken, async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const resumeData = {
            url,
            updatedAt: new Date().toISOString()
        };

        await db.collection('settings').doc('resume').set(resumeData, { merge: true });
        res.json(resumeData);
    } catch (error) {
        console.error('Error updating resume URL:', error);
        res.status(500).json({ error: 'Error updating resume URL' });
    }
});

// ==================== CURRENT EXPERIENCE ROUTES ====================

// Get current experience (public)
app.get('/api/current-experience', async (req, res) => {
    try {
        const docRef = db.collection('settings').doc('currentExperience');
        const doc = await docRef.get();

        if (!doc.exists) {
            const defaultExperience = {
                company: "Tech Innovation Lab",
                role: "Software Engineer Intern",
                location: "Remote / Hybrid",
                startDate: "Jan 2025",
                endDate: "",
                currentlyWorking: true,
                shortDescription: "Building scalable web applications, designing RESTful APIs, and developing AI-powered automation workflows.",
                detailedDescription: "Working on modern full-stack development, architecting high-performance web applications with React and TypeScript, optimizing backend services, and building intelligent data processing pipelines.",
                highlights: [
                    "Software Development: Engineered modular, responsive user interfaces and micro-interactions using React, TypeScript, and modern CSS architectures.",
                    "Backend & APIs: Developed secure Node.js/Express REST APIs with robust token-based authentication and database caching.",
                    "Automation & Data Workflows: Built automated data pipelines and integrated AI models for intelligent workflow processing.",
                    "Engineering Impact & Collaboration: Collaborated in agile sprints, participating in code reviews, CI/CD pipeline optimization, and system architecture discussions."
                ],
                technologies: [
                    "React",
                    "TypeScript",
                    "Node.js",
                    "Express",
                    "Firebase",
                    "Tailwind CSS",
                    "Python"
                ],
                slug: "current-experience",
                updatedAt: new Date().toISOString()
            };
            await docRef.set(defaultExperience);
            return res.json(defaultExperience);
        }

        res.json(doc.data());
    } catch (error) {
        console.error('Error fetching current experience:', error);
        res.status(500).json({ error: 'Error fetching current experience' });
    }
});

// Update current experience (protected)
app.put('/api/current-experience', verifyToken, async (req, res) => {
    try {
        const {
            company,
            role,
            location,
            startDate,
            endDate,
            currentlyWorking,
            shortDescription,
            detailedDescription,
            highlights,
            technologies
        } = req.body;

        if (!company || !role) {
            return res.status(400).json({ error: 'Company and Role are required' });
        }

        const isCurrentlyWorking = Boolean(currentlyWorking);

        // Sanitize highlights array
        const sanitizedHighlights = Array.isArray(highlights)
            ? highlights.map(h => String(h).trim()).filter(Boolean)
            : (typeof highlights === 'string' ? highlights.split('\n').map(h => h.trim()).filter(Boolean) : []);

        // Sanitize technologies array
        const sanitizedTechnologies = Array.isArray(technologies)
            ? technologies.map(t => String(t).trim()).filter(Boolean)
            : (typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

        const experienceData = {
            company: String(company).trim(),
            role: String(role).trim(),
            location: location ? String(location).trim() : '',
            startDate: startDate ? String(startDate).trim() : '',
            endDate: isCurrentlyWorking ? '' : (endDate ? String(endDate).trim() : ''),
            currentlyWorking: isCurrentlyWorking,
            shortDescription: shortDescription ? String(shortDescription).trim() : '',
            detailedDescription: detailedDescription ? String(detailedDescription).trim() : '',
            highlights: sanitizedHighlights,
            technologies: sanitizedTechnologies,
            slug: 'current-experience',
            updatedAt: new Date().toISOString()
        };

        const docRef = db.collection('settings').doc('currentExperience');
        await docRef.set(experienceData, { merge: true });

        const updatedDoc = await docRef.get();
        res.json(updatedDoc.data());
    } catch (error) {
        console.error('Error updating current experience:', error);
        res.status(500).json({ error: 'Error updating current experience' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (password === AUTH_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        firebase: db ? 'connected' : 'disconnected'
    });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔑 Admin password: ${AUTH_PASSWORD}`);
    console.log(`🔥 Firebase: ${db ? 'Connected' : 'Not Connected'}`);
});
