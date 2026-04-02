// Platform Configuration
const CONFIG = {
    // Platform Settings
    PLATFORM_NAME: 'TransLingo',
    PLATFORM_COMMISSION: 0.15, // 15% commission

    // Supported Languages
    LANGUAGES: [
        'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
        'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
        'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish',
        'Turkish', 'Greek', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian'
    ],

    // Document Types
    DOCUMENT_TYPES: [
        'General Text',
        'Legal Document',
        'Medical Document',
        'Technical Manual',
        'Marketing Material',
        'Academic Paper',
        'Website Content',
        'Software Localization',
        'Literary Work',
        'Business Document'
    ],

    // Specializations
    SPECIALIZATIONS: [
        'Legal Translation',
        'Medical Translation',
        'Technical Translation',
        'Literary Translation',
        'Business Translation',
        'Marketing Translation',
        'Academic Translation',
        'Software Localization',
        'Certified Translation',
        'Interpretation'
    ],

    // Urgency Levels with pricing multipliers
    URGENCY_LEVELS: {
        'regular': { label: 'Regular (7+ days)', multiplier: 1.0 },
        'express': { label: 'Express (3-6 days)', multiplier: 1.5 },
        'rush': { label: 'Rush (1-2 days)', multiplier: 2.0 }
    },

    // File Upload Settings
    FILE_UPLOAD: {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_TYPES: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/vnd.oasis.opendocument.text'
        ],
        ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt', '.odt']
    },

    // Job Status
    JOB_STATUS: {
        OPEN: 'open',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed',
        DISPUTED: 'disputed',
        CANCELLED: 'cancelled'
    },

    // Proposal Status
    PROPOSAL_STATUS: {
        PENDING: 'pending',
        ACCEPTED: 'accepted',
        REJECTED: 'rejected',
        WITHDRAWN: 'withdrawn'
    },

    // Payment Status
    PAYMENT_STATUS: {
        PENDING: 'pending',
        HELD: 'held',
        RELEASED: 'released',
        REFUNDED: 'refunded'
    },

    // User Roles
    USER_ROLES: {
        EMPLOYER: 'employer',
        FREELANCER: 'freelancer',
        ADMIN: 'admin'
    },

    // Notification Types
    NOTIFICATION_TYPES: {
        NEW_PROPOSAL: 'new_proposal',
        PROPOSAL_ACCEPTED: 'proposal_accepted',
        PROPOSAL_REJECTED: 'proposal_rejected',
        JOB_COMPLETED: 'job_completed',
        PAYMENT_RECEIVED: 'payment_received',
        NEW_MESSAGE: 'new_message',
        NEW_REVIEW: 'new_review',
        JOB_STATUS_CHANGE: 'job_status_change'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
