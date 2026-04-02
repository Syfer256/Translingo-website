// Job Management System
const Jobs = {
    // Create new job
    create(jobData) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.EMPLOYER) {
            return { success: false, error: 'Only employers can post jobs' };
        }

        // Validate required fields
        if (!jobData.title || !jobData.sourceLang || !jobData.targetLang || !jobData.budget) {
            return { success: false, error: 'Missing required fields' };
        }

        const newJob = {
            id: Utils.generateId(),
            employerId: currentUser.id,
            employerName: `${currentUser.firstName} ${currentUser.lastName}`,
            companyName: currentUser.companyName || '',
            title: jobData.title,
            description: jobData.description || '',
            sourceLang: jobData.sourceLang,
            targetLang: jobData.targetLang,
            documentType: jobData.documentType || 'General Text',
            specialization: jobData.specialization || '',
            wordCount: parseInt(jobData.wordCount) || 0,
            deadline: jobData.deadline,
            budget: parseFloat(jobData.budget),
            urgency: jobData.urgency || 'regular',
            requirements: jobData.requirements || '',
            files: jobData.files || [],
            status: CONFIG.JOB_STATUS.OPEN,
            proposalCount: 0,
            viewCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        Storage.add(Storage.KEYS.JOBS, newJob);

        // Update employer stats
        Auth.updateProfile(currentUser.id, {
            postedJobs: (currentUser.postedJobs || 0) + 1
        });

        return { success: true, job: newJob };
    },

    // Get all jobs with filters
    getAll(filters = {}) {
        let jobs = Storage.getAll(Storage.KEYS.JOBS);

        // Apply filters
        if (filters.status) {
            jobs = jobs.filter(job => job.status === filters.status);
        }

        if (filters.sourceLang) {
            jobs = jobs.filter(job => job.sourceLang === filters.sourceLang);
        }

        if (filters.targetLang) {
            jobs = jobs.filter(job => job.targetLang === filters.targetLang);
        }

        if (filters.documentType) {
            jobs = jobs.filter(job => job.documentType === filters.documentType);
        }

        if (filters.specialization) {
            jobs = jobs.filter(job => job.specialization === filters.specialization);
        }

        if (filters.minBudget) {
            jobs = jobs.filter(job => job.budget >= parseFloat(filters.minBudget));
        }

        if (filters.maxBudget) {
            jobs = jobs.filter(job => job.budget <= parseFloat(filters.maxBudget));
        }

        if (filters.urgency) {
            jobs = jobs.filter(job => job.urgency === filters.urgency);
        }

        if (filters.employerId) {
            jobs = jobs.filter(job => job.employerId === filters.employerId);
        }

        // Search by keyword
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            jobs = jobs.filter(job =>
                job.title.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower)
            );
        }

        // Sort by date (newest first)
        jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return jobs;
    },

    // Get job by ID
    getById(jobId) {
        const job = Storage.findById(Storage.KEYS.JOBS, jobId);

        if (job) {
            // Increment view count
            this.incrementViewCount(jobId);
        }

        return job;
    },

    // Update job
    update(jobId, updates) {
        const job = Storage.findById(Storage.KEYS.JOBS, jobId);

        if (!job) {
            return { success: false, error: 'Job not found' };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || job.employerId !== currentUser.id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Don't allow updating certain fields
        delete updates.id;
        delete updates.employerId;
        delete updates.createdAt;

        updates.updatedAt = new Date().toISOString();

        Storage.update(Storage.KEYS.JOBS, jobId, updates);

        return { success: true };
    },

    // Delete job
    delete(jobId) {
        const job = Storage.findById(Storage.KEYS.JOBS, jobId);

        if (!job) {
            return { success: false, error: 'Job not found' };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || (job.employerId !== currentUser.id && currentUser.role !== CONFIG.USER_ROLES.ADMIN)) {
            return { success: false, error: 'Unauthorized' };
        }

        Storage.delete(Storage.KEYS.JOBS, jobId);

        return { success: true };
    },

    // Change job status
    changeStatus(jobId, newStatus) {
        const job = Storage.findById(Storage.KEYS.JOBS, jobId);

        if (!job) {
            return { success: false, error: 'Job not found' };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || job.employerId !== currentUser.id) {
            return { success: false, error: 'Unauthorized' };
        }

        Storage.update(Storage.KEYS.JOBS, jobId, {
            status: newStatus,
            updatedAt: new Date().toISOString()
        });

        // Create notification
        Notifications.create({
            userId: job.employerId,
            type: CONFIG.NOTIFICATION_TYPES.JOB_STATUS_CHANGE,
            title: 'Job Status Updated',
            message: `Job "${job.title}" status changed to ${newStatus}`,
            relatedId: jobId
        });

        return { success: true };
    },

    // Increment view count
    incrementViewCount(jobId) {
        const job = Storage.findById(Storage.KEYS.JOBS, jobId);
        if (job) {
            Storage.update(Storage.KEYS.JOBS, jobId, {
                viewCount: (job.viewCount || 0) + 1
            });
        }
    },

    // Get jobs by employer
    getByEmployer(employerId) {
        return this.getAll({ employerId });
    },

    // Get active jobs for freelancer (jobs they can apply to)
    getActiveJobs() {
        return this.getAll({ status: CONFIG.JOB_STATUS.OPEN });
    },

    // Calculate price based on word count and urgency
    calculatePrice(wordCount, baseRate, urgency = 'regular') {
        const multiplier = CONFIG.URGENCY_LEVELS[urgency]?.multiplier || 1.0;
        return wordCount * baseRate * multiplier;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Jobs;
}
