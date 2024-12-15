const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Profile = require("../models/Profile");
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Signup route
// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      username,
      password,
      isAdmin: true, // Automatically set new users as admin
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const profile = new Profile({
      userId: user.id,
      name,
      email,
      username,
      profilePicture: "./assets/logo192.png", // Set default image path
      wallet: 0, // Initialize wallet with 0 balance
    });
    await profile.save();

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin, // Include isAdmin in payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin, // Include isAdmin in payload
        username: user.username, // Include username in payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, username: user.username }); // Return token and username
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get profile details
// Get profile details
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).send("Server error");
  }
});

// Update profile details
router.post("/profile/update", auth, async (req, res) => {
  const { name } = req.body;
  try {
    let profile = await Profile.findOne({ userId: req.user.id });
    if (profile) {
      profile.name = name || profile.name;
      await profile.save();
      res.json(profile);
    } else {
      res.status(404).json({ msg: "Profile not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Upload profile image
router.post(
  "/profile/upload-image",
  auth,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ userId: req.user.id });
      if (profile) {
        profile.profilePicture = `/uploads/${req.file.filename}`;
        await profile.save();
        res.json(profile);
      } else {
        res.status(404).json({ msg: "Profile not found" });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Get wallet balance
router.get("/wallet", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.json({ wallet: profile.wallet });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add money to wallet
router.post("/wallet/add", auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    profile.wallet += amount;
    await profile.save();
    res.json({ wallet: profile.wallet });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Withdraw money from wallet
router.post("/wallet/withdraw", auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    if (profile.wallet < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }
    profile.wallet -= amount;
    await profile.save();
    res.json({ wallet: profile.wallet });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Change user password
router.post("/user/change-password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
