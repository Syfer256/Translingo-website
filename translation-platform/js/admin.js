// Admin Functions
const Admin = {
    // Get platform statistics
    getStats() {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return null;
        }

        const users = Storage.getAll(Storage.KEYS.USERS);
        const jobs = Storage.getAll(Storage.KEYS.JOBS);
        const transactions = Storage.getAll(Storage.KEYS.TRANSACTIONS);

        return {
            users: {
                total: users.length,
                employers: users.filter(u => u.role === CONFIG.USER_ROLES.EMPLOYER).length,
                freelancers: users.filter(u => u.role === CONFIG.USER_ROLES.FREELANCER).length,
                active: users.filter(u => u.isActive).length,
                verified: users.filter(u => u.isVerified).length
            },
            jobs: {
                total: jobs.length,
                open: jobs.filter(j => j.status === CONFIG.JOB_STATUS.OPEN).length,
                inProgress: jobs.filter(j => j.status === CONFIG.JOB_STATUS.IN_PROGRESS).length,
                completed: jobs.filter(j => j.status === CONFIG.JOB_STATUS.COMPLETED).length,
                disputed: jobs.filter(j => j.status === CONFIG.JOB_STATUS.DISPUTED).length
            },
            transactions: Payments.getStats(),
            revenue: {
                total: Payments.calculateRevenue(),
                thisMonth: this.getMonthlyRevenue()
            }
        };
    },

    // Get monthly revenue
    getMonthlyRevenue() {
        const transactions = Storage.getAll(Storage.KEYS.TRANSACTIONS);
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyTransactions = transactions.filter(t =>
            t.status === CONFIG.PAYMENT_STATUS.RELEASED &&
            new Date(t.releasedAt) >= firstDayOfMonth
        );

        return monthlyTransactions.reduce((total, t) => total + t.platformFee, 0);
    },

    // Get all users
    getAllUsers() {
        return Auth.getAllUsers();
    },

    // Suspend user
    suspendUser(userId, reason = '') {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return { success: false, error: 'Unauthorized' };
        }

        const result = Auth.updateProfile(userId, {
            isActive: false,
            suspendedAt: new Date().toISOString(),
            suspensionReason: reason
        });

        if (result.success) {
            Notifications.create({
                userId: userId,
                type: CONFIG.NOTIFICATION_TYPES.JOB_STATUS_CHANGE,
                title: 'Account Suspended',
                message: `Your account has been suspended. Reason: ${reason}`,
                relatedId: null
            });
        }

        return result;
    },

    // Activate user
    activateUser(userId) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return { success: false, error: 'Unauthorized' };
        }

        const result = Auth.updateProfile(userId, {
            isActive: true,
            suspendedAt: null,
            suspensionReason: null
        });

        if (result.success) {
            Notifications.create({
                userId: userId,
                type: CONFIG.NOTIFICATION_TYPES.JOB_STATUS_CHANGE,
                title: 'Account Activated',
                message: 'Your account has been reactivated',
                relatedId: null
            });
        }

        return result;
    },

    // Verify user
    verifyUser(userId) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return { success: false, error: 'Unauthorized' };
        }

        return Auth.updateProfile(userId, {
            isVerified: true,
            verifiedAt: new Date().toISOString()
        });
    },

    // Get all transactions
    getAllTransactions() {
        return Payments.getAll();
    },

    // Get disputed jobs
    getDisputedJobs() {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return [];
        }

        return Jobs.getAll({ status: CONFIG.JOB_STATUS.DISPUTED });
    },

    // Resolve dispute
    resolveDispute(jobId, resolution) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return { success: false, error: 'Unauthorized' };
        }

        const job = Storage.findById(Storage.KEYS.JOBS, jobId);
        if (!job) {
            return { success: false, error: 'Job not found' };
        }

        // resolution can be 'refund' or 'release'
        const transaction = Payments.getByJob(jobId);

        if (resolution === 'refund') {
            return Payments.refundPayment(transaction.id, 'Dispute resolved in favor of employer');
        } else if (resolution === 'release') {
            return Payments.releasePayment(transaction.id);
        }

        return { success: false, error: 'Invalid resolution' };
    },

    // Delete user (admin only)
    deleteUser(userId) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return { success: false, error: 'Unauthorized' };
        }

        Storage.delete(Storage.KEYS.USERS, userId);

        return { success: true };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Admin;
}
