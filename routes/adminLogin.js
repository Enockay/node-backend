// Import required modules
import express from 'express';
import { loginUser } from '../public/javascripts/adminLoginSchema.js';

// Create an Express router instance
const LoginAdmin = express.Router();

// Define a route for user login
LoginAdmin.post('/login', loginUser);

// Export the router to be used in your main application file
export default LoginAdmin;
