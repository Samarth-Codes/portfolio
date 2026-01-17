require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    try {
        // Check if Firebase is already initialized
        if (admin.apps.length > 0) {
            return admin.firestore();
        }

        // Parse service account from environment variable
        const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
        );

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log('✅ Firebase initialized successfully');
        return admin.firestore();
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error.message);
        throw new Error('Firebase initialization failed');
    }
};

const db = initializeFirebase();

module.exports = { db, admin };
