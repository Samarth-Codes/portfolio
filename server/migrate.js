const { db } = require('./firebase');
const fs = require('fs').promises;
const path = require('path');

async function migrateData() {
    try {
        console.log('🔄 Starting data migration to Firebase...\n');

        // Migrate Achievements
        console.log('📊 Migrating achievements...');
        const achievementsPath = path.join(__dirname, 'data', 'achievements.json');
        try {
            const achievementsData = await fs.readFile(achievementsPath, 'utf8');
            const achievements = JSON.parse(achievementsData);

            if (Array.isArray(achievements) && achievements.length > 0) {
                for (const achievement of achievements) {
                    const { id, ...data } = achievement;
                    await db.collection('achievements').add({
                        ...data,
                        migratedAt: new Date().toISOString()
                    });
                }
                console.log(`✅ Migrated ${achievements.length} achievements`);
            } else {
                console.log('ℹ️  No achievements to migrate');
            }
        } catch (error) {
            console.log('ℹ️  No achievements file found, skipping...');
        }

        // Migrate Projects
        console.log('\n📁 Migrating projects...');
        const projectsPath = path.join(__dirname, 'data', 'projects.json');
        try {
            const projectsData = await fs.readFile(projectsPath, 'utf8');
            const projects = JSON.parse(projectsData);

            if (Array.isArray(projects) && projects.length > 0) {
                for (const project of projects) {
                    const { id, ...data } = project;
                    await db.collection('projects').add({
                        ...data,
                        migratedAt: new Date().toISOString()
                    });
                }
                console.log(`✅ Migrated ${projects.length} projects`);
            } else {
                console.log('ℹ️  No projects to migrate');
            }
        } catch (error) {
            console.log('ℹ️  No projects file found, skipping...');
        }

        // Migrate Resume URL
        console.log('\n📄 Migrating resume URL...');
        const resumePath = path.join(__dirname, 'data', 'resume.json');
        try {
            const resumeData = await fs.readFile(resumePath, 'utf8');
            const resume = JSON.parse(resumeData);

            await db.collection('settings').doc('resume').set({
                ...resume,
                migratedAt: new Date().toISOString()
            });
            console.log('✅ Migrated resume URL');
        } catch (error) {
            console.log('ℹ️  No resume file found, creating default...');
            await db.collection('settings').doc('resume').set({
                url: 'https://drive.google.com/file/d/1GL1jqtVKS8rzlxX2TJfkqcBUpkNj7Kw6/view?usp=sharing',
                createdAt: new Date().toISOString()
            });
            console.log('✅ Created default resume URL');
        }

        console.log('\n🎉 Migration completed successfully!');
        console.log('\n📋 Firestore Collections:');
        console.log('   - achievements');
        console.log('   - projects');
        console.log('   - settings');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateData();
