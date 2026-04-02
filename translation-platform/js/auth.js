// Authentication System
const Auth = {
    // Current user session
    currentUser: null,

    // Initialize auth system
    init() {
        this.loadSession();
    },

    // Hash password (simulated - in production use bcrypt)
    hashPassword(password) {
        // Simple hash simulation - NOT SECURE for production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hashed_' + Math.abs(hash).toString(36);
    },

    // Register new user
    register(userData) {
        const users = Storage.getAll(Storage.KEYS.USERS);

        // Validate required fields
        if (!userData.email || !userData.password || !userData.role) {
            return { success: false, error: 'Missing required fields' };
        }

        // Validate email format
        if (!Utils.validateEmail(userData.email)) {
            return { success: false, error: 'Invalid email format' };
        }

        // Validate password strength
        if (!Utils.validatePassword(userData.password)) {
            return {
                success: false,
                error: 'Password must be at least 8 characters with uppercase, lowercase, and number'
            };
        }

        // Check if email already exists
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, error: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: Utils.generateId(),
            email: userData.email,
            password: this.hashPassword(userData.password),
            role: userData.role,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            company: userData.company || '',
            phone: userData.phone || '',
            avatar: userData.avatar || '',
            createdAt: new Date().toISOString(),
            isActive: true,
            isVerified: false,

            // Role-specific fields
            ...(userData.role === CONFIG.USER_ROLES.FREELANCER && {
                languages: userData.languages || [],
                specializations: userData.specializations || [],
                hourlyRate: userData.hourlyRate || 0,
                bio: userData.bio || '',
                portfolio: userData.portfolio || [],
                certifications: userData.certifications || [],
                completedJobs: 0,
                totalEarnings: 0,
                rating: 0,
                reviewCount: 0
            }),

            ...(userData.role === CONFIG.USER_ROLES.EMPLOYER && {
                companyName: userData.companyName || '',
                industry: userData.industry || '',
                website: userData.website || '',
                postedJobs: 0,
                totalSpent: 0
            })
        };

        Storage.add(Storage.KEYS.USERS, newUser);

        return { success: true, user: this.sanitizeUser(newUser) };
    },

    // Login user
    login(email, password) {
        const users = Storage.getAll(Storage.KEYS.USERS);
        const hashedPassword = this.hashPassword(password);

        const user = users.find(u =>
            u.email === email && u.password === hashedPassword
        );

        if (!user) {
            return { success: false, error: 'Invalid email or password' };
        }

        if (!user.isActive) {
            return { success: false, error: 'Account is suspended' };
        }

        // Create session
        this.currentUser = this.sanitizeUser(user);
        this.saveSession();

        return { success: true, user: this.currentUser };
    },

    // Logout user
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('translingo_session');
        window.location.href = 'index.html';
    },

    // Save session
    saveSession() {
        if (this.currentUser) {
            sessionStorage.setItem('translingo_session', JSON.stringify(this.currentUser));
        }
    },

    // Load session
    loadSession() {
        const session = sessionStorage.getItem('translingo_session');
        if (session) {
            this.currentUser = JSON.parse(session);
        }
    },

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    },

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    },

    // Require authentication (redirect if not logged in)
    requireAuth(redirectUrl = 'auth.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // Require specific role
    requireRole(role, redirectUrl = 'index.html') {
        if (!this.hasRole(role)) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // Update user profile
    updateProfile(userId, updates) {
        const users = Storage.getAll(Storage.KEYS.USERS);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return { success: false, error: 'User not found' };
        }

        // Don't allow updating sensitive fields
        delete updates.password;
        delete updates.email;
        delete updates.role;
        delete updates.id;

        users[userIndex] = { ...users[userIndex], ...updates };
        Storage.set(Storage.KEYS.USERS, users);

        // Update current session if it's the current user
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = this.sanitizeUser(users[userIndex]);
            this.saveSession();
        }

        return { success: true, user: this.sanitizeUser(users[userIndex]) };
    },

    // Change password
    changePassword(userId, oldPassword, newPassword) {
        const users = Storage.getAll(Storage.KEYS.USERS);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (user.password !== this.hashPassword(oldPassword)) {
            return { success: false, error: 'Incorrect current password' };
        }

        if (!Utils.validatePassword(newPassword)) {
            return {
                success: false,
                error: 'New password must be at least 8 characters with uppercase, lowercase, and number'
            };
        }

        Storage.update(Storage.KEYS.USERS, userId, {
            password: this.hashPassword(newPassword)
        });

        return { success: true };
    },

    // Remove sensitive data from user object
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    },

    // Get user by ID
    getUserById(userId) {
        const user = Storage.findById(Storage.KEYS.USERS, userId);
        return user ? this.sanitizeUser(user) : null;
    },

    // Get all users (admin only)
    getAllUsers() {
        if (!this.hasRole(CONFIG.USER_ROLES.ADMIN)) {
            return [];
        }

        const users = Storage.getAll(Storage.KEYS.USERS);
        return users.map(u => this.sanitizeUser(u));
    }
};

// Initialize auth on load
Auth.init();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
