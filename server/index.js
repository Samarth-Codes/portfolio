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
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        jwt.verify(token, JWT_SECRET);
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
            id: doc.id,
            ...doc.data()
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
        await db.collection('achievements').doc(req.params.id).delete();
        res.json({ message: 'Achievement deleted' });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        res.status(500).json({ error: 'Error deleting achievement' });
    }
});

// ==================== PROJECTS ROUTES ====================

// Get all projects (public)
app.get('/api/projects', async (req, res) => {
    try {
        const snapshot = await db.collection('projects').get();
        const projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
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
        await db.collection('projects').doc(req.params.id).delete();
        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Error deleting project' });
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

// ==================== AUTH ROUTE ====================

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
