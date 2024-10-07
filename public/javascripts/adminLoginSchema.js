import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define the User model
const User = mongoose.model('AdminLogin',userSchema);
const loginUser = async (req, res) => {
  const { username, password } = req.body;
 // console.log(req.body)
  try {
    const query = { username };

    const user = await User.findOne(query); // Use findOne instead of find
    //console.log(user);
    // If user not found
    if (!user) {
      return res.status(400).json({ error: 'Invalid username' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // If passwords match, generate JWT token
    const token = jwt.sign({ userId: user._id }, 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=', { expiresIn: '1h' });

    res.json({ token , status : 0 });
  } catch (error) {
   // console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
};

export {loginUser}
