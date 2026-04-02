// Data Storage Layer using localStorage
const Storage = {
    // Storage Keys
    KEYS: {
        USERS: 'translingo_users',
        JOBS: 'translingo_jobs',
        PROPOSALS: 'translingo_proposals',
        TRANSACTIONS: 'translingo_transactions',
        MESSAGES: 'translingo_messages',
        REVIEWS: 'translingo_reviews',
        NOTIFICATIONS: 'translingo_notifications',
        FILES: 'translingo_files'
    },

    // Initialize storage with sample data if empty
    init() {
        if (!this.get(this.KEYS.USERS)) {
            this.loadSampleData();
        }
    },

    // Generic get method
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    },

    // Generic set method
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to storage:', error);
            return false;
        }
    },

    // Get all items of a type
    getAll(key) {
        return this.get(key) || [];
    },

    // Add item to collection
    add(key, item) {
        const items = this.getAll(key);
        items.push(item);
        return this.set(key, items);
    },

    // Update item in collection
    update(key, id, updatedItem) {
        const items = this.getAll(key);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedItem };
            return this.set(key, items);
        }
        return false;
    },

    // Delete item from collection
    delete(key, id) {
        const items = this.getAll(key);
        const filtered = items.filter(item => item.id !== id);
        return this.set(key, filtered);
    },

    // Find item by ID
    findById(key, id) {
        const items = this.getAll(key);
        return items.find(item => item.id === id);
    },

    // Find items by criteria
    findBy(key, criteria) {
        const items = this.getAll(key);
        return items.filter(item => {
            return Object.keys(criteria).every(key => item[key] === criteria[key]);
        });
    },

    // Clear all data
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    },

    // Export data
    exportData() {
        const data = {};
        Object.entries(this.KEYS).forEach(([name, key]) => {
            data[name] = this.get(key);
        });
        return data;
    },

    // Import data
    importData(data) {
        Object.entries(data).forEach(([name, value]) => {
            const key = this.KEYS[name];
            if (key) {
                this.set(key, value);
            }
        });
    },

    // Load sample data (will be populated by sample-data.js)
    loadSampleData() {
        // Initialize empty collections
        this.set(this.KEYS.USERS, []);
        this.set(this.KEYS.JOBS, []);
        this.set(this.KEYS.PROPOSALS, []);
        this.set(this.KEYS.TRANSACTIONS, []);
        this.set(this.KEYS.MESSAGES, []);
        this.set(this.KEYS.REVIEWS, []);
        this.set(this.KEYS.NOTIFICATIONS, []);
        this.set(this.KEYS.FILES, []);
    }
};

// Initialize storage on load
Storage.init();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
