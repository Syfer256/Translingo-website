// Review and Rating System
const Reviews = {
    // Submit review
    submit(reviewData) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser) {
            return { success: false, error: 'Must be logged in to submit review' };
        }

        // Validate required fields
        if (!reviewData.jobId || !reviewData.revieweeId || !reviewData.rating) {
            return { success: false, error: 'Missing required fields' };
        }

        // Validate rating
        if (reviewData.rating < 1 || reviewData.rating > 5) {
            return { success: false, error: 'Rating must be between 1 and 5' };
        }

        // Check if job is completed
        const job = Storage.findById(Storage.KEYS.JOBS, reviewData.jobId);
        if (!job || job.status !== CONFIG.JOB_STATUS.COMPLETED) {
            return { success: false, error: 'Can only review completed jobs' };
        }

        // Check if user is the employer of this job
        if (job.employerId !== currentUser.id) {
            return { success: false, error: 'Only the employer can review this job' };
        }

        // Check if already reviewed
        const existing = this.getByJobAndReviewer(reviewData.jobId, currentUser.id);
        if (existing) {
            return { success: false, error: 'You have already reviewed this job' };
        }

        const review = {
            id: Utils.generateId(),
            jobId: reviewData.jobId,
            reviewerId: currentUser.id,
            reviewerName: `${currentUser.firstName} ${currentUser.lastName}`,
            revieweeId: reviewData.revieweeId,
            rating: parseInt(reviewData.rating),
            comment: reviewData.comment || '',
            createdAt: new Date().toISOString()
        };

        Storage.add(Storage.KEYS.REVIEWS, review);

        // Update freelancer rating
        this.updateFreelancerRating(reviewData.revieweeId);

        // Notify freelancer
        Notifications.create({
            userId: reviewData.revieweeId,
            type: CONFIG.NOTIFICATION_TYPES.NEW_REVIEW,
            title: 'New Review Received',
            message: `${review.reviewerName} left you a ${review.rating}-star review`,
            relatedId: review.id
        });

        return { success: true, review };
    },

    // Get reviews for a user (freelancer)
    getByFreelancer(freelancerId) {
        const reviews = Storage.findBy(Storage.KEYS.REVIEWS, { revieweeId: freelancerId });
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return reviews;
    },

    // Get review by job and reviewer
    getByJobAndReviewer(jobId, reviewerId) {
        const reviews = Storage.getAll(Storage.KEYS.REVIEWS);
        return reviews.find(r => r.jobId === jobId && r.reviewerId === reviewerId);
    },

    // Update freelancer's average rating
    updateFreelancerRating(freelancerId) {
        const reviews = this.getByFreelancer(freelancerId);

        if (reviews.length === 0) {
            return;
        }

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;

        Auth.updateProfile(freelancerId, {
            rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            reviewCount: reviews.length
        });
    },

    // Get average rating for freelancer
    getAverageRating(freelancerId) {
        const reviews = this.getByFreelancer(freelancerId);

        if (reviews.length === 0) {
            return 0;
        }

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        return Math.round((totalRating / reviews.length) * 10) / 10;
    },

    // Get rating distribution
    getRatingDistribution(freelancerId) {
        const reviews = this.getByFreelancer(freelancerId);
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        reviews.forEach(r => {
            distribution[r.rating]++;
        });

        return distribution;
    },

    // Delete review (admin only)
    delete(reviewId) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser || currentUser.role !== CONFIG.USER_ROLES.ADMIN) {
            return { success: false, error: 'Unauthorized' };
        }

        const review = Storage.findById(Storage.KEYS.REVIEWS, reviewId);
        if (!review) {
            return { success: false, error: 'Review not found' };
        }

        Storage.delete(Storage.KEYS.REVIEWS, reviewId);

        // Update freelancer rating
        this.updateFreelancerRating(review.revieweeId);

        return { success: true };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Reviews;
}
