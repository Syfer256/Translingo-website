// Notification System
const Notifications = {
    // Create notification
    create(notificationData) {
        const notification = {
            id: Utils.generateId(),
            userId: notificationData.userId,
            type: notificationData.type,
            title: notificationData.title,
            message: notificationData.message,
            relatedId: notificationData.relatedId || null,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        Storage.add(Storage.KEYS.NOTIFICATIONS, notification);

        // Update UI badge if user is currently logged in
        const currentUser = Auth.getCurrentUser();
        if (currentUser && currentUser.id === notificationData.userId) {
            this.updateBadge();
        }

        return notification;
    },

    // Get notifications for user
    getByUser(userId, limit = null) {
        const notifications = Storage.findBy(Storage.KEYS.NOTIFICATIONS, { userId });
        notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (limit) {
            return notifications.slice(0, limit);
        }

        return notifications;
    },

    // Get unread count
    getUnreadCount(userId) {
        const notifications = Storage.findBy(Storage.KEYS.NOTIFICATIONS, { userId });
        return notifications.filter(n => !n.isRead).length;
    },

    // Mark as read
    markAsRead(notificationId) {
        Storage.update(Storage.KEYS.NOTIFICATIONS, notificationId, { isRead: true });
        this.updateBadge();
    },

    // Mark all as read
    markAllAsRead(userId) {
        const notifications = Storage.findBy(Storage.KEYS.NOTIFICATIONS, { userId });
        notifications.forEach(n => {
            if (!n.isRead) {
                Storage.update(Storage.KEYS.NOTIFICATIONS, n.id, { isRead: true });
            }
        });
        this.updateBadge();
    },

    // Delete notification
    delete(notificationId) {
        Storage.delete(Storage.KEYS.NOTIFICATIONS, notificationId);
        this.updateBadge();
    },

    // Clear all notifications
    clearAll(userId) {
        const notifications = Storage.findBy(Storage.KEYS.NOTIFICATIONS, { userId });
        notifications.forEach(n => {
            Storage.delete(Storage.KEYS.NOTIFICATIONS, n.id);
        });
        this.updateBadge();
    },

    // Update notification badge in UI
    updateBadge() {
        const currentUser = Auth.getCurrentUser();
        if (currentUser) {
            const count = this.getUnreadCount(currentUser.id);
            if (typeof UI !== 'undefined') {
                UI.updateNotificationBadge(count);
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Notifications;
}
