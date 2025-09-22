const jwt = require("jsonwebtoken");
const User = require("./../models/User");
const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    console.log("user.password:", user.password);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
      secretKey,
      {
        expiresIn: "1h",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000, // 1 час
    });
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out" });
};

exports.register = async (req, res) => {
  try {
    const { surname, name, email, password, birthYear } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!surname || !name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    const user = await User.create({
      surname,
      name,
      email,
      password,
      birthYear,
      role: "user",
    });
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name,
        surname: user.surname,
      },
      secretKey,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });
    res.json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        surname: user.surname,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration error", error: err.message });
  }
};
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { surname, name, birthYear } = req.body;
    if (!surname && !name && !birthYear) {
      return res.status(400).json({ message: "Нет данных для обновления" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (surname) user.surname = surname;
    if (name) user.name = name;
    if (birthYear) user.birthYear = birthYear;
    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        surname: user.surname,
        name: user.name,
        birthYear: user.birthYear,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};
