// Sample Data for TransLingo Platform
// This file populates the platform with realistic demo data

(function () {
    // Check if data already exists
    const existingUsers = Storage.get(Storage.KEYS.USERS);
    if (existingUsers && existingUsers.length > 0) {
        console.log('Sample data already loaded');
        return;
    }

    console.log('Loading sample data...');

    // Sample Users
    const users = [
        // Admin
        {
            id: 'admin1',
            email: 'admin@test.com',
            password: Auth.hashPassword('Test1234'),
            role: CONFIG.USER_ROLES.ADMIN,
            firstName: 'Admin',
            lastName: 'User',
            isActive: true,
            isVerified: true,
            createdAt: new Date('2025-01-01').toISOString()
        },
        // Employers
        {
            id: 'emp1',
            email: 'employer@test.com',
            password: Auth.hashPassword('Test1234'),
            role: CONFIG.USER_ROLES.EMPLOYER,
            firstName: 'John',
            lastName: 'Smith',
            companyName: 'Global Tech Solutions',
            industry: 'Technology',
            website: 'https://globaltech.example.com',
            postedJobs: 5,
            totalSpent: 2500,
            isActive: true,
            isVerified: true,
            createdAt: new Date('2025-06-15').toISOString()
        },
        {
            id: 'emp2',
            email: 'sarah.johnson@example.com',
            password: Auth.hashPassword('Test1234'),
            role: CONFIG.USER_ROLES.EMPLOYER,
            firstName: 'Sarah',
            lastName: 'Johnson',
            companyName: 'Legal Associates LLC',
            industry: 'Legal',
            postedJobs: 3,
            totalSpent: 1800,
            isActive: true,
            isVerified: true,
            createdAt: new Date('2025-08-20').toISOString()
        },
        // Freelancers
        {
            id: 'free1',
            email: 'freelancer@test.com',
            password: Auth.hashPassword('Test1234'),
            role: CONFIG.USER_ROLES.FREELANCER,
            firstName: 'Maria',
            lastName: 'Garcia',
            languages: ['English', 'Spanish', 'French'],
            specializations: ['Legal Translation', 'Business Translation'],
            hourlyRate: 35,
            bio: 'Professional translator with 8+ years of experience in legal and business translation. Native Spanish speaker with C2 English proficiency.',
            completedJobs: 47,
            totalEarnings: 8950,
            rating: 4.9,
            reviewCount: 42,
            isActive: true,
            isVerified: true,
            createdAt: new Date('2024-03-10').toISOString()
        },
        {
            id: 'free2',
            email: 'chen.wei@example.com',
            password: Auth.hashPassword('Test1234'),
            role: CONFIG.USER_ROLES.FREELANCER,
            firstName: 'Chen',
            lastName: 'Wei',
            languages: ['English', 'Chinese', 'Japanese'],
            specializations: ['Technical Translation', 'Software Localization'],
            hourlyRate: 40,
            bio: 'Specialized in technical and software translation. 10 years experience with major tech companies.',
            completedJobs: 63,
            totalEarnings: 12400,
            rating: 4.8,
            reviewCount: 58,
            isActive: true,
            isVerified: true,
            createdAt: new Date('2023-11-05').toISOString()
        },
        {
            id: 'free3',
            email: 'pierre.dubois@example.com',
            password: Auth.hashPassword('Test1234'),
            role: CONFIG.USER_ROLES.FREELANCER,
            firstName: 'Pierre',
            lastName: 'Dubois',
            languages: ['French', 'English', 'German'],
            specializations: ['Literary Translation', 'Marketing Translation'],
            hourlyRate: 30,
            bio: 'Creative translator specializing in marketing content and literary works. Native French speaker.',
            completedJobs: 28,
            totalEarnings: 5200,
            rating: 4.7,
            reviewCount: 25,
            isActive: true,
            isVerified: true,
            createdAt: new Date('2024-07-12').toISOString()
        }
    ];

    // Sample Jobs
    const jobs = [
        {
            id: 'job1',
            employerId: 'emp1',
            employerName: 'John Smith',
            companyName: 'Global Tech Solutions',
            title: 'Technical Manual Translation - English to Spanish',
            description: 'Need translation of our software user manual from English to Spanish. The manual is approximately 5000 words and contains technical terminology related to cloud computing and data analytics.',
            sourceLang: 'English',
            targetLang: 'Spanish',
            documentType: 'Technical Manual',
            specialization: 'Technical Translation',
            wordCount: 5000,
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            budget: 500,
            urgency: 'regular',
            requirements: 'Must have experience with technical software documentation. Familiarity with cloud computing terminology preferred.',
            status: CONFIG.JOB_STATUS.OPEN,
            proposalCount: 3,
            viewCount: 24,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'job2',
            employerId: 'emp2',
            employerName: 'Sarah Johnson',
            companyName: 'Legal Associates LLC',
            title: 'Legal Contract Translation - English to French',
            description: 'Urgent translation needed for international business contract. Must be certified translation. Document is 3000 words.',
            sourceLang: 'English',
            targetLang: 'French',
            documentType: 'Legal Document',
            specialization: 'Legal Translation',
            wordCount: 3000,
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            budget: 450,
            urgency: 'express',
            requirements: 'Certified translator required. Must have experience with international business contracts.',
            status: CONFIG.JOB_STATUS.IN_PROGRESS,
            proposalCount: 5,
            viewCount: 31,
            acceptedProposalId: 'prop1',
            acceptedFreelancerId: 'free1',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'job3',
            employerId: 'emp1',
            employerName: 'John Smith',
            companyName: 'Global Tech Solutions',
            title: 'Website Content Translation - English to Chinese',
            description: 'Translation of our company website content for Chinese market launch. Approximately 2500 words including product descriptions and marketing copy.',
            sourceLang: 'English',
            targetLang: 'Chinese',
            documentType: 'Website Content',
            specialization: 'Marketing Translation',
            wordCount: 2500,
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            budget: 350,
            urgency: 'regular',
            requirements: 'Experience with marketing content and SEO-friendly translations. Understanding of Chinese market preferred.',
            status: CONFIG.JOB_STATUS.OPEN,
            proposalCount: 2,
            viewCount: 18,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'job4',
            employerId: 'emp1',
            employerName: 'John Smith',
            companyName: 'Global Tech Solutions',
            title: 'Product Documentation - English to German',
            description: 'Translation of product documentation and user guides. Total 4000 words.',
            sourceLang: 'English',
            targetLang: 'German',
            documentType: 'Technical Manual',
            specialization: 'Technical Translation',
            wordCount: 4000,
            deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            budget: 400,
            urgency: 'regular',
            status: CONFIG.JOB_STATUS.COMPLETED,
            proposalCount: 4,
            viewCount: 28,
            acceptedProposalId: 'prop5',
            acceptedFreelancerId: 'free3',
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    // Sample Proposals
    const proposals = [
        {
            id: 'prop1',
            jobId: 'job2',
            freelancerId: 'free1',
            freelancerName: 'Maria Garcia',
            freelancerRating: 4.9,
            freelancerCompletedJobs: 47,
            coverLetter: 'I am a certified legal translator with extensive experience in international business contracts. I have translated similar documents for Fortune 500 companies and can guarantee accuracy and confidentiality. I will deliver the certified translation within 2 days.',
            quotedPrice: 450,
            deliveryTime: '2 days',
            status: CONFIG.PROPOSAL_STATUS.ACCEPTED,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            acceptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'prop2',
            jobId: 'job1',
            freelancerId: 'free1',
            freelancerName: 'Maria Garcia',
            freelancerRating: 4.9,
            freelancerCompletedJobs: 47,
            coverLetter: 'Hello! I specialize in technical translations and have experience with software documentation. I can deliver high-quality translation maintaining all technical terminology accurately.',
            quotedPrice: 480,
            deliveryTime: '7 days',
            status: CONFIG.PROPOSAL_STATUS.PENDING,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'prop3',
            jobId: 'job1',
            freelancerId: 'free2',
            freelancerName: 'Chen Wei',
            freelancerRating: 4.8,
            freelancerCompletedJobs: 63,
            coverLetter: 'I have 10 years of experience translating technical manuals for major tech companies. I am familiar with cloud computing and data analytics terminology and can ensure accurate translation.',
            quotedPrice: 520,
            deliveryTime: '6 days',
            status: CONFIG.PROPOSAL_STATUS.PENDING,
            createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'prop4',
            jobId: 'job3',
            freelancerId: 'free2',
            freelancerName: 'Chen Wei',
            freelancerRating: 4.8,
            freelancerCompletedJobs: 63,
            coverLetter: 'As a native Chinese speaker with marketing translation experience, I can help you create compelling content for the Chinese market. I understand cultural nuances and SEO best practices.',
            quotedPrice: 350,
            deliveryTime: '10 days',
            status: CONFIG.PROPOSAL_STATUS.PENDING,
            createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'prop5',
            jobId: 'job4',
            freelancerId: 'free3',
            freelancerName: 'Pierre Dubois',
            freelancerRating: 4.7,
            freelancerCompletedJobs: 28,
            coverLetter: 'I have experience with technical documentation and can provide accurate German translation.',
            quotedPrice: 400,
            deliveryTime: '8 days',
            status: CONFIG.PROPOSAL_STATUS.ACCEPTED,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            acceptedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    // Sample Transactions
    const transactions = [
        {
            id: 'trans1',
            jobId: 'job2',
            proposalId: 'prop1',
            employerId: 'emp2',
            freelancerId: 'free1',
            totalAmount: 450,
            platformFee: 67.50,
            freelancerAmount: 382.50,
            status: CONFIG.PAYMENT_STATUS.HELD,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            heldAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'trans2',
            jobId: 'job4',
            proposalId: 'prop5',
            employerId: 'emp1',
            freelancerId: 'free3',
            totalAmount: 400,
            platformFee: 60,
            freelancerAmount: 340,
            status: CONFIG.PAYMENT_STATUS.RELEASED,
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            heldAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            releasedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    // Sample Messages
    const messages = [
        {
            id: 'msg1',
            senderId: 'emp2',
            senderName: 'Sarah Johnson',
            recipientId: 'free1',
            jobId: 'job2',
            content: 'Hi Maria, I accepted your proposal. Can you confirm the delivery timeline?',
            isRead: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'msg2',
            senderId: 'free1',
            senderName: 'Maria Garcia',
            recipientId: 'emp2',
            jobId: 'job2',
            content: 'Thank you! Yes, I will deliver the certified translation within 2 days as promised.',
            isRead: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3600000).toISOString()
        },
        {
            id: 'msg3',
            senderId: 'emp2',
            senderName: 'Sarah Johnson',
            recipientId: 'free1',
            jobId: 'job2',
            content: 'Perfect! Looking forward to receiving it.',
            isRead: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 7200000).toISOString()
        }
    ];

    // Sample Reviews
    const reviews = [
        {
            id: 'rev1',
            jobId: 'job4',
            reviewerId: 'emp1',
            reviewerName: 'John Smith',
            revieweeId: 'free3',
            rating: 5,
            comment: 'Excellent work! The translation was accurate and delivered on time. Will definitely hire again.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    // Sample Notifications
    const notifications = [
        {
            id: 'notif1',
            userId: 'emp1',
            type: CONFIG.NOTIFICATION_TYPES.NEW_PROPOSAL,
            title: 'New Proposal Received',
            message: 'Maria Garcia submitted a proposal for "Technical Manual Translation - English to Spanish"',
            relatedId: 'prop2',
            isRead: false,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'notif2',
            userId: 'free1',
            type: CONFIG.NOTIFICATION_TYPES.PROPOSAL_ACCEPTED,
            title: 'Proposal Accepted!',
            message: 'Your proposal for "Legal Contract Translation - English to French" has been accepted',
            relatedId: 'prop1',
            isRead: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    // Save all data to storage
    Storage.set(Storage.KEYS.USERS, users);
    Storage.set(Storage.KEYS.JOBS, jobs);
    Storage.set(Storage.KEYS.PROPOSALS, proposals);
    Storage.set(Storage.KEYS.TRANSACTIONS, transactions);
    Storage.set(Storage.KEYS.MESSAGES, messages);
    Storage.set(Storage.KEYS.REVIEWS, reviews);
    Storage.set(Storage.KEYS.NOTIFICATIONS, notifications);
    Storage.set(Storage.KEYS.FILES, []);

    console.log('Sample data loaded successfully!');
    console.log('Demo accounts:');
    console.log('- Employer: employer@test.com / Test1234');
    console.log('- Freelancer: freelancer@test.com / Test1234');
    console.log('- Admin: admin@test.com / Test1234');
})();
