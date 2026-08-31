require('dotenv').config();
const { db } = require('./firebase');

async function testFirebase() {
    try {
        console.log('🔍 Testing Firebase connection...');
        const snapshot = await db.collection('achievements').get();
        console.log('✅ Successfully connected to Firebase!');
        console.log(`📊 Found ${snapshot.docs.length} achievements`);

        if (snapshot.docs.length > 0) {
            snapshot.docs.forEach(doc => {
                console.log(`  - ${doc.id}:`, doc.data());
            });
        }
    } catch (error) {
        console.error('❌ Firebase Error:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
    }
}

testFirebase();
