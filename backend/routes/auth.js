import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById, verifyPassword } from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, company, role, city, state } = req.body;

        // Validation
        if (!email || !password || !name || !role) {
            return res.status(400).json({
                error: 'Email, password, name, and role are required'
            });
        }

        if (!['warehouse', 'dealer', 'admin'].includes(role)) {
            return res.status(400).json({
                error: 'Role must be either "warehouse", "dealer" or "admin"'
            });
        }

        // Check if user already exists
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Create user
        const userId = await createUser(email, password, name, company, role, city, state);

        res.status(201).json({
            message: 'User registered successfully',
            userId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                company: user.company,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user (protected route)
router.get('/me', authenticateToken, (req, res) => {
    try {
        const user = findUserById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

export default router;
