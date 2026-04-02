// Messaging System
const Messaging = {
    // Send message
    send(messageData) {
        const currentUser = Auth.getCurrentUser();

        if (!currentUser) {
            return { success: false, error: 'Must be logged in to send messages' };
        }

        // Validate required fields
        if (!messageData.recipientId || !messageData.content) {
            return { success: false, error: 'Missing required fields' };
        }

        const message = {
            id: Utils.generateId(),
            senderId: currentUser.id,
            senderName: `${currentUser.firstName} ${currentUser.lastName}`,
            recipientId: messageData.recipientId,
            jobId: messageData.jobId || null,
            content: messageData.content,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        Storage.add(Storage.KEYS.MESSAGES, message);

        // Notify recipient
        Notifications.create({
            userId: messageData.recipientId,
            type: CONFIG.NOTIFICATION_TYPES.NEW_MESSAGE,
            title: 'New Message',
            message: `${message.senderName} sent you a message`,
            relatedId: message.id
        });

        return { success: true, message };
    },

    // Get conversation between two users
    getConversation(userId1, userId2) {
        const messages = Storage.getAll(Storage.KEYS.MESSAGES);
        return messages.filter(m =>
            (m.senderId === userId1 && m.recipientId === userId2) ||
            (m.senderId === userId2 && m.recipientId === userId1)
        ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },

    // Get all conversations for a user
    getConversations(userId) {
        const messages = Storage.getAll(Storage.KEYS.MESSAGES);
        const userMessages = messages.filter(m =>
            m.senderId === userId || m.recipientId === userId
        );

        // Group by conversation partner
        const conversations = {};
        userMessages.forEach(msg => {
            const partnerId = msg.senderId === userId ? msg.recipientId : msg.senderId;

            if (!conversations[partnerId]) {
                conversations[partnerId] = {
                    partnerId,
                    messages: [],
                    unreadCount: 0,
                    lastMessage: null
                };
            }

            conversations[partnerId].messages.push(msg);

            if (msg.recipientId === userId && !msg.isRead) {
                conversations[partnerId].unreadCount++;
            }
        });

        // Get last message for each conversation
        Object.values(conversations).forEach(conv => {
            conv.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            conv.lastMessage = conv.messages[0];
        });

        return Object.values(conversations).sort((a, b) =>
            new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
        );
    },

    // Mark message as read
    markAsRead(messageId) {
        Storage.update(Storage.KEYS.MESSAGES, messageId, { isRead: true });
    },

    // Mark all messages in conversation as read
    markConversationAsRead(userId, partnerId) {
        const messages = Storage.getAll(Storage.KEYS.MESSAGES);
        messages.forEach(msg => {
            if (msg.senderId === partnerId && msg.recipientId === userId && !msg.isRead) {
                this.markAsRead(msg.id);
            }
        });
    },

    // Get unread message count
    getUnreadCount(userId) {
        const messages = Storage.getAll(Storage.KEYS.MESSAGES);
        return messages.filter(m => m.recipientId === userId && !m.isRead).length;
    },

    // Delete message
    delete(messageId) {
        const message = Storage.findById(Storage.KEYS.MESSAGES, messageId);

        if (!message) {
            return { success: false, error: 'Message not found' };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || (message.senderId !== currentUser.id && currentUser.role !== CONFIG.USER_ROLES.ADMIN)) {
            return { success: false, error: 'Unauthorized' };
        }

        Storage.delete(Storage.KEYS.MESSAGES, messageId);
        return { success: true };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Messaging;
}
