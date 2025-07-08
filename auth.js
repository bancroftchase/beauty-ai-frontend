
// Centralized Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Clear any conflicting data on init
        this.validateSession();
    }

    // Clean session validation
    validateSession() {
        try {
            const user = JSON.parse(localStorage.getItem('authUser') || 'null');
            if (user && user.email && user.sessionValid) {
                this.currentUser = user;
                return true;
            }
        } catch (e) {
            console.log('Invalid session data, clearing...');
        }
        
        this.clearSession();
        return false;
    }

    // Sign up new user
    signUp(userData) {
        const { fullName, email, password } = userData;
        
        // Check if user already exists
        const existingUsers = this.getAllUsers();
        if (existingUsers[email.toLowerCase()]) {
            throw new Error('Account already exists');
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            fullName,
            email: email.toLowerCase(),
            password,
            createdAt: new Date().toISOString(),
            sessionValid: true
        };

        // Save user
        existingUsers[email.toLowerCase()] = newUser;
        localStorage.setItem('allUsers', JSON.stringify(existingUsers));
        
        // Set as current user
        this.setCurrentUser(newUser);
        
        return newUser;
    }

    // Sign in existing user
    signIn(email, password) {
        const users = this.getAllUsers();
        const user = users[email.toLowerCase()];
        
        if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
        }

        // Update session
        user.sessionValid = true;
        user.lastSignIn = new Date().toISOString();
        
        // Save updated user data
        users[email.toLowerCase()] = user;
        localStorage.setItem('allUsers', JSON.stringify(users));
        
        this.setCurrentUser(user);
        return user;
    }

    // Set current user session
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('authUser', JSON.stringify(user));
    }

    // Get all users
    getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem('allUsers') || '{}');
        } catch (e) {
            return {};
        }
    }

    // Sign out
    signOut() {
        this.currentUser = null;
        localStorage.removeItem('authUser');
    }

    // Clear all session data
    clearSession() {
        this.currentUser = null;
        localStorage.removeItem('authUser');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('beautyProfile');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Require authentication (redirect if not logged in)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'signin.html';
            return false;
        }
        return true;
    }
}

// Global auth instance
window.authSystem = new AuthSystem();

// Demo account setup
window.authSystem.setupDemo = function() {
    const users = this.getAllUsers();
    if (!users['demo@beauty.com']) {
        users['demo@beauty.com'] = {
            id: 'demo',
            fullName: 'Demo User',
            email: 'demo@beauty.com',
            password: 'demo123',
            createdAt: new Date().toISOString(),
            isDemo: true,
            sessionValid: false
        };
        localStorage.setItem('allUsers', JSON.stringify(users));
    }
};

// Setup demo account
window.authSystem.setupDemo();
