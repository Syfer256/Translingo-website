// Payment and Escrow System
const Payments = {
    // Create escrow transaction
    createEscrow(transactionData) {
        const { jobId, proposalId, employerId, freelancerId, amount } = transactionData;

        // Validate required fields
        if (!jobId || !proposalId || !employerId || !freelancerId || !amount) {
            return { success: false, error: 'Missing required fields' };
        }

        const platformFee = amount * CONFIG.PLATFORM_COMMISSION;
        const freelancerAmount = amount - platformFee;

        const transaction = {
            id: Utils.generateId(),
            jobId,
            proposalId,
            employerId,
            freelancerId,
            totalAmount: amount,
            platformFee,
            freelancerAmount,
            status: CONFIG.PAYMENT_STATUS.HELD,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            heldAt: new Date().toISOString(),
            releasedAt: null,
            refundedAt: null
        };

        Storage.add(Storage.KEYS.TRANSACTIONS, transaction);

        return { success: true, transaction };
    },

    // Release payment to freelancer
    releasePayment(transactionId) {
        const transaction = Storage.findById(Storage.KEYS.TRANSACTIONS, transactionId);

        if (!transaction) {
            return { success: false, error: 'Transaction not found' };
        }

        if (transaction.status !== CONFIG.PAYMENT_STATUS.HELD) {
            return { success: false, error: 'Payment is not in escrow' };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || transaction.employerId !== currentUser.id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Update transaction status
        Storage.update(Storage.KEYS.TRANSACTIONS, transactionId, {
            status: CONFIG.PAYMENT_STATUS.RELEASED,
            releasedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Update job status
        Storage.update(Storage.KEYS.JOBS, transaction.jobId, {
            status: CONFIG.JOB_STATUS.COMPLETED,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Update freelancer stats
        const freelancer = Auth.getUserById(transaction.freelancerId);
        if (freelancer) {
            Auth.updateProfile(transaction.freelancerId, {
                completedJobs: (freelancer.completedJobs || 0) + 1,
                totalEarnings: (freelancer.totalEarnings || 0) + transaction.freelancerAmount
            });
        }

        // Update employer stats
        const employer = Auth.getUserById(transaction.employerId);
        if (employer) {
            Auth.updateProfile(transaction.employerId, {
                totalSpent: (employer.totalSpent || 0) + transaction.totalAmount
            });
        }

        // Notify freelancer
        Notifications.create({
            userId: transaction.freelancerId,
            type: CONFIG.NOTIFICATION_TYPES.PAYMENT_RECEIVED,
            title: 'Payment Received',
            message: `You received ${Utils.formatCurrency(transaction.freelancerAmount)} for completed work`,
            relatedId: transactionId
        });

        return { success: true };
    },

    // Refund payment to employer
    refundPayment(transactionId, reason = '') {
        const transaction = Storage.findById(Storage.KEYS.TRANSACTIONS, transactionId);

        if (!transaction) {
            return { success: false, error: 'Transaction not found' };
        }

        if (transaction.status !== CONFIG.PAYMENT_STATUS.HELD) {
            return { success: false, error: 'Payment is not in escrow' };
        }

        const currentUser = Auth.getCurrentUser();
        // Only admin can refund
        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return { success: false, error: 'Unauthorized' };
        }

        // Update transaction status
        Storage.update(Storage.KEYS.TRANSACTIONS, transactionId, {
            status: CONFIG.PAYMENT_STATUS.REFUNDED,
            refundedAt: new Date().toISOString(),
            refundReason: reason,
            updatedAt: new Date().toISOString()
        });

        // Update job status
        Storage.update(Storage.KEYS.JOBS, transaction.jobId, {
            status: CONFIG.JOB_STATUS.DISPUTED,
            updatedAt: new Date().toISOString()
        });

        // Notify both parties
        Notifications.create({
            userId: transaction.employerId,
            type: CONFIG.NOTIFICATION_TYPES.PAYMENT_RECEIVED,
            title: 'Payment Refunded',
            message: `Your payment of ${Utils.formatCurrency(transaction.totalAmount)} has been refunded`,
            relatedId: transactionId
        });

        Notifications.create({
            userId: transaction.freelancerId,
            type: CONFIG.NOTIFICATION_TYPES.JOB_STATUS_CHANGE,
            title: 'Payment Refunded',
            message: 'The payment for this job has been refunded to the employer',
            relatedId: transactionId
        });

        return { success: true };
    },

    // Get transaction by ID
    getById(transactionId) {
        return Storage.findById(Storage.KEYS.TRANSACTIONS, transactionId);
    },

    // Get transactions by user
    getByUser(userId) {
        const transactions = Storage.getAll(Storage.KEYS.TRANSACTIONS);
        return transactions.filter(t =>
            t.employerId === userId || t.freelancerId === userId
        );
    },

    // Get transactions by employer
    getByEmployer(employerId) {
        return Storage.findBy(Storage.KEYS.TRANSACTIONS, { employerId });
    },

    // Get transactions by freelancer
    getByFreelancer(freelancerId) {
        return Storage.findBy(Storage.KEYS.TRANSACTIONS, { freelancerId });
    },

    // Get transaction by job
    getByJob(jobId) {
        return Storage.findBy(Storage.KEYS.TRANSACTIONS, { jobId })[0];
    },

    // Get all transactions (admin only)
    getAll() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return [];
        }

        return Storage.getAll(Storage.KEYS.TRANSACTIONS);
    },

    // Calculate platform revenue
    calculateRevenue() {
        const transactions = Storage.getAll(Storage.KEYS.TRANSACTIONS);
        const releasedTransactions = transactions.filter(t =>
            t.status === CONFIG.PAYMENT_STATUS.RELEASED
        );

        return releasedTransactions.reduce((total, t) => total + t.platformFee, 0);
    },

    // Get transaction stats
    getStats() {
        const transactions = Storage.getAll(Storage.KEYS.TRANSACTIONS);

        return {
            total: transactions.length,
            pending: transactions.filter(t => t.status === CONFIG.PAYMENT_STATUS.PENDING).length,
            held: transactions.filter(t => t.status === CONFIG.PAYMENT_STATUS.HELD).length,
            released: transactions.filter(t => t.status === CONFIG.PAYMENT_STATUS.RELEASED).length,
            refunded: transactions.filter(t => t.status === CONFIG.PAYMENT_STATUS.REFUNDED).length,
            totalVolume: transactions.reduce((sum, t) => sum + t.totalAmount, 0),
            platformRevenue: this.calculateRevenue()
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Payments;
}
