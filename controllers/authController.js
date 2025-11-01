const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // console.log(role);
    

    if (!role && !role.toLowerCase() === 'admin') {
      return res.status(403).json({ message: 'You cannot register as admin' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role || 'user',
    });

    await user.save();

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const newFileName = `${user._id}${ext}`;
      const oldPath = req.file.path;
      const newPath = path.join(path.dirname(oldPath), newFileName);
      fs.renameSync(oldPath, newPath);
      user.image = newFileName;
      await user.save();
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        image: user.image,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during registration', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, role: user.role, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: user.image,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, address, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.email || req.body.phone || req.body.role || req.body.isAdmin) {
      return res.status(400).json({ message: 'You are not allowed to update email, phone, or role' });
    }

    if (name) user.name = name;
    if (address) user.address = address;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const newFileName = `${user._id}${ext}`;
      const oldPath = req.file.path;
      const newPath = path.join(path.dirname(oldPath), newFileName);

      if (user.image) {
        const oldImagePath = path.join(path.dirname(oldPath), user.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      fs.renameSync(oldPath, newPath);
      user.image = newFileName;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: user.image,
        role: user.role,
      },  
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
