const { db } = require('./firebase');

async function addInitialProjects() {
    try {
        console.log('🚀 Adding initial projects to Firebase...\n');

        const projects = [
            {
                title: "Traffic Hive",
                description: "A comprehensive traffic management system that uses AI to analyze traffic patterns, optimize routes, and provide real-time traffic updates for smart cities.",
                category: "AI/ML",
                technologies: ["Python", "Scikit-learn", "React", "Node.js"],
                image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
                liveUrl: "https://traffic-hive.onrender.com/",
                githubUrl: "#",
                featured: false,
                badge: "WINNER - SDI 25",
                badgeColor: "green",
                order: 1
            },
            {
                title: "Police Bot",
                description: "An intelligent chatbot system designed for law enforcement agencies to handle routine inquiries, provide information, and assist with public safety communications.",
                category: "AI/ML",
                technologies: ["Python", "OpenAI API", "React", "Node.js"],
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
                liveUrl: "https://police-bot.vercel.app/",
                githubUrl: "https://github.com/Vansh-Choudhary/Police-Bot",
                featured: false,
                badge: "TOP 10 - ACEHACK 3.0",
                badgeColor: "yellow",
                order: 2
            },
            {
                title: "Craibot",
                description: "An intelligent crypto trading bot that executes cryptocurrency transactions with a single command, providing automated trading capabilities and real-time market analysis.",
                category: "Blockchain",
                technologies: ["Python", "Gemini API", "React", "Express"],
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
                liveUrl: "craibot.vanshwebserver.tech",
                githubUrl: "#",
                featured: false,
                badge: "TOP 15 - INNOVATEX",
                badgeColor: "blue",
                secondaryBadge: "UNDER MAINTENANCE",
                secondaryBadgeColor: "orange",
                order: 3
            },
            {
                title: "Keystroke-Mouse",
                description: "A biometric authentication system that analyzes keystroke dynamics and mouse movement patterns to provide secure, passwordless authentication.",
                category: "AI/ML",
                technologies: ["Python", "PyTorch", "JavaScript", "Express"],
                image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
                liveUrl: "https://keystroke-mouse-7h4m.vercel.app/",
                githubUrl: "https://github.com/Samarth-Codes/keystroke-mouse",
                featured: false,
                order: 4
            },
            {
                title: "Sorting Visualizer",
                description: "An interactive web application that demonstrates various sorting algorithms with real-time visualizations, helping users understand how different algorithms work.",
                category: "Web",
                technologies: ["JavaScript", "HTML", "CSS", "React"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
                liveUrl: "https://sorting-visualizer-iota-one.vercel.app/",
                githubUrl: "https://github.com/Samarth-Codes/Sorting-Visualizer",
                featured: false,
                order: 5
            }
        ];

        for (const project of projects) {
            await db.collection('projects').add({
                ...project,
                createdAt: new Date().toISOString()
            });
            console.log(`✅ Added: ${project.title}`);
        }

        console.log('\n🎉 All projects added successfully!');
        console.log('\n📊 Firestore Collections:');
        console.log('   - achievements (4 documents)');
        console.log('   - projects (5 documents)');
        console.log('   - settings');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error adding projects:', error);
        process.exit(1);
    }
}

// Run
addInitialProjects();
