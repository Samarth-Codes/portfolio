require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    try {
        // Check if Firebase is already initialized
        if (admin.apps.length > 0) {
            console.log('✅ Firebase already initialized');
            return admin.firestore();
        }

        // Parse service account from environment variable
        const serviceAccountJSON = process.env.FIREBASE_SERVICE_ACCOUNT;

        if (!serviceAccountJSON) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
        }

        const serviceAccount = JSON.parse(serviceAccountJSON);

        if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
            throw new Error('Invalid service account: missing required fields');
        }

        console.log(`🔧 Initializing Firebase for project: ${serviceAccount.project_id}`);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id
        });

        console.log('✅ Firebase initialized successfully');
        const db = admin.firestore();
        console.log('✅ Firestore instance created');
        return db;
    } catch (error) {
        console.error('❌ Error initializing Firebase:');
        console.error('   Error message:', error.message);
        console.error('   Stack trace:', error.stack);
        throw new Error(`Firebase initialization failed: ${error.message}`);
    }
};

const db = initializeFirebase();

module.exports = { db, admin };
