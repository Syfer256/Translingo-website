// Proposal Management System
const Proposals = {
    // Submit proposal
    submit(proposalData) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.FREELANCER) {
            return { success: false, error: 'Only freelancers can submit proposals' };
        }

        // Validate required fields
        if (!proposalData.jobId || !proposalData.coverLetter || !proposalData.quotedPrice) {
            return { success: false, error: 'Missing required fields' };
        }

        // Check if job exists
        const job = Storage.findById(Storage.KEYS.JOBS, proposalData.jobId);
        if (!job) {
            return { success: false, error: 'Job not found' };
        }

        if (job.status !== CONFIG.JOB_STATUS.OPEN) {
            return { success: false, error: 'Job is no longer accepting proposals' };
        }

        // Check if already submitted
        const existing = this.getByFreelancerAndJob(currentUser.id, proposalData.jobId);
        if (existing) {
            return { success: false, error: 'You have already submitted a proposal for this job' };
        }

        const newProposal = {
            id: Utils.generateId(),
            jobId: proposalData.jobId,
            freelancerId: currentUser.id,
            freelancerName: `${currentUser.firstName} ${currentUser.lastName}`,
            freelancerRating: currentUser.rating || 0,
            freelancerCompletedJobs: currentUser.completedJobs || 0,
            coverLetter: proposalData.coverLetter,
            quotedPrice: parseFloat(proposalData.quotedPrice),
            deliveryTime: proposalData.deliveryTime || '',
            status: CONFIG.PROPOSAL_STATUS.PENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        Storage.add(Storage.KEYS.PROPOSALS, newProposal);

        // Update job proposal count
        Storage.update(Storage.KEYS.JOBS, proposalData.jobId, {
            proposalCount: (job.proposalCount || 0) + 1
        });

        // Notify employer
        Notifications.create({
            userId: job.employerId,
            type: CONFIG.NOTIFICATION_TYPES.NEW_PROPOSAL,
            title: 'New Proposal Received',
            message: `${newProposal.freelancerName} submitted a proposal for "${job.title}"`,
            relatedId: newProposal.id
        });

        return { success: true, proposal: newProposal };
    },

    // Get proposals for a job
    getByJob(jobId) {
        return Storage.findBy(Storage.KEYS.PROPOSALS, { jobId });
    },

    // Get proposals by freelancer
    getByFreelancer(freelancerId) {
        return Storage.findBy(Storage.KEYS.PROPOSALS, { freelancerId });
    },

    // Get specific proposal by freelancer and job
    getByFreelancerAndJob(freelancerId, jobId) {
        const proposals = Storage.getAll(Storage.KEYS.PROPOSALS);
        return proposals.find(p => p.freelancerId === freelancerId && p.jobId === jobId);
    },

    // Get proposal by ID
    getById(proposalId) {
        return Storage.findById(Storage.KEYS.PROPOSALS, proposalId);
    },

    // Accept proposal
    accept(proposalId) {
        const proposal = Storage.findById(Storage.KEYS.PROPOSALS, proposalId);

        if (!proposal) {
            return { success: false, error: 'Proposal not found' };
        }

        const job = Storage.findById(Storage.KEYS.JOBS, proposal.jobId);
        if (!job) {
            return { success: false, error: 'Job not found' };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || job.employerId !== currentUser.id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Update proposal status
        Storage.update(Storage.KEYS.PROPOSALS, proposalId, {
            status: CONFIG.PROPOSAL_STATUS.ACCEPTED,
            acceptedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Update job status
        Storage.update(Storage.KEYS.JOBS, proposal.jobId, {
            status: CONFIG.JOB_STATUS.IN_PROGRESS,
            acceptedProposalId: proposalId,
            acceptedFreelancerId: proposal.freelancerId,
            updatedAt: new Date().toISOString()
        });

        // Reject other proposals
        const otherProposals = this.getByJob(proposal.jobId);
        otherProposals.forEach(p => {
            if (p.id !== proposalId && p.status === CONFIG.PROPOSAL_STATUS.PENDING) {
                Storage.update(Storage.KEYS.PROPOSALS, p.id, {
                    status: CONFIG.PROPOSAL_STATUS.REJECTED,
                    updatedAt: new Date().toISOString()
                });

                // Notify rejected freelancers
                Notifications.create({
                    userId: p.freelancerId,
                    type: CONFIG.NOTIFICATION_TYPES.PROPOSAL_REJECTED,
                    title: 'Proposal Not Selected',
                    message: `Your proposal for "${job.title}" was not selected`,
                    relatedId: p.id
                });
            }
        });

        // Create payment transaction (escrow)
        const paymentResult = Payments.createEscrow({
            jobId: proposal.jobId,
            proposalId: proposalId,
            employerId: job.employerId,
            freelancerId: proposal.freelancerId,
            amount: proposal.quotedPrice
        });

        if (!paymentResult.success) {
            return { success: false, error: 'Failed to create payment escrow' };
        }

        // Notify freelancer
        Notifications.create({
            userId: proposal.freelancerId,
            type: CONFIG.NOTIFICATION_TYPES.PROPOSAL_ACCEPTED,
            title: 'Proposal Accepted!',
            message: `Your proposal for "${job.title}" has been accepted`,
            relatedId: proposalId
        });

        return { success: true };
    },

    // Reject proposal
    reject(proposalId) {
        const proposal = Storage.findById(Storage.KEYS.PROPOSALS, proposalId);

        if (!proposal) {
            return { success: false, error: 'Proposal not found' };
        }

        const job = Storage.findById(Storage.KEYS.JOBS, proposal.jobId);
        if (!job) {
            return { success: false, error: 'Job not found' };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || job.employerId !== currentUser.id) {
            return { success: false, error: 'Unauthorized' };
        }

        Storage.update(Storage.KEYS.PROPOSALS, proposalId, {
            status: CONFIG.PROPOSAL_STATUS.REJECTED,
            updatedAt: new Date().toISOString()
        });

        // Notify freelancer
        Notifications.create({
            userId: proposal.freelancerId,
            type: CONFIG.NOTIFICATION_TYPES.PROPOSAL_REJECTED,
            title: 'Proposal Not Selected',
            message: `Your proposal for "${job.title}" was not selected`,
            relatedId: proposalId
        });

        return { success: true };
    },

    // Withdraw proposal
    withdraw(proposalId) {
        const proposal = Storage.findById(Storage.KEYS.PROPOSALS, proposalId);

        if (!proposal) {
            return { success: false, error: 'Proposal not found' };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || proposal.freelancerId !== currentUser.id) {
            return { success: false, error: 'Unauthorized' };
        }

        if (proposal.status !== CONFIG.PROPOSAL_STATUS.PENDING) {
            return { success: false, error: 'Can only withdraw pending proposals' };
        }

        Storage.update(Storage.KEYS.PROPOSALS, proposalId, {
            status: CONFIG.PROPOSAL_STATUS.WITHDRAWN,
            updatedAt: new Date().toISOString()
        });

        // Update job proposal count
        const job = Storage.findById(Storage.KEYS.JOBS, proposal.jobId);
        if (job) {
            Storage.update(Storage.KEYS.JOBS, proposal.jobId, {
                proposalCount: Math.max(0, (job.proposalCount || 1) - 1)
            });
        }

        return { success: true };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Proposals;
}
