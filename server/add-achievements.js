const { db } = require('./firebase');

async function addInitialAchievements() {
    try {
        console.log('🎯 Adding initial achievements to Firebase...\n');

        const achievements = [
            {
                icon: "🏆",
                title: "Winner",
                event: "Smart Delhi Ideathon 2025",
                detail: "1st among 1000+ teams",
                description: "AI-based traffic optimization system recognized by the Lt. Governor of Delhi",
                date: "Feb 2025",
                color: "from-yellow-400 to-orange-500",
                iconBg: "bg-yellow-500",
                order: 1
            },
            {
                icon: "🥈",
                title: "2nd Place",
                event: "NHAI Hackathon 2025",
                detail: "Top 2 of 138 entries",
                description: "AI-powered maintenance monitoring solution for national highways",
                date: "Sept 2025",
                color: "from-cyan-400 to-blue-500",
                iconBg: "bg-cyan-500",
                order: 2
            },
            {
                icon: "🌍",
                title: "Fellow",
                event: "UNESCO Climate Leadership",
                detail: "Top 40 Global Fellows",
                description: "Selected to lead climate innovation and sustainability initiatives",
                date: "Apr 2025",
                color: "from-green-400 to-emerald-500",
                iconBg: "bg-emerald-500",
                order: 3
            },
            {
                icon: "🎓",
                title: "Delegate",
                event: "Harvard HPAIR Conference",
                detail: "Selected Delegate",
                description: "Selected to attend the prestigious Harvard Project for Asian and International Relations conference",
                date: "2025",
                color: "from-purple-400 to-pink-500",
                iconBg: "bg-purple-500",
                order: 4
            }
        ];

        for (const achievement of achievements) {
            await db.collection('achievements').add({
                ...achievement,
                createdAt: new Date().toISOString()
            });
            console.log(`✅ Added: ${achievement.title} - ${achievement.event}`);
        }

        console.log('\n🎉 All achievements added successfully!');
        console.log('\n📊 Firestore Collections:');
        console.log('   - achievements (4 documents)');
        console.log('   - projects');
        console.log('   - settings');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error adding achievements:', error);
        process.exit(1);
    }
}

// Run
addInitialAchievements();
