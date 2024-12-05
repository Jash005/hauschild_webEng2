import express from "express";
import {
  addUser,
  validateLogin,
  isUsernameExist,
  showUserProfile,
} from "../models/databases.js";

const router = express.Router();

// Route für die Benutzerregistrierung
router.post("/register", async (req, res) => {
  const user = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (await isUsernameExist(user.username)) {
    return res.status(400).json({ error: "Username existiert bereits" });
  }
  if (user.username.length < 3 || user.username.length > 12) {
    return res
      .status(400)
      .json({ error: "Username ist nicht zwischen 3 und 12 Zeichen lang" });
  }
  if (user.username === "Gast" || user.username === "gast") {
    return res
      .status(400)
      .json({ error: "Username darf aus technischen Gründen nicht 'Gast' sein" });
  }
  if (user.password.length < 6 || user.password.length > 20) {
    return res
      .status(400)
      .json({ error: "Passwort ist nicht zwischen 6 und 20 Zeichen lang" });
  }
  if (! emailRegex.test(user.email)) {
    return res.status(400).json({ error: "es ist kein gültiges E-Mail Format" });
  }
  if (user.acceptTerms !== true) {
    return res.status(400).json({ error: "Nutzungsbedingungen müssen akzeptiert sein" });
  }
  addUser(user, (err, newUser) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json(newUser);
  });
});

// Route für den Benutzer-Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  validateLogin(username, password, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.status(200).json({ message: "Login erfolgreich", user });
  });
});

// Route zum Anzeigen des Benutzerprofils
router.get("/profile", async (req, res) => {
  const userId = req.query.userId;
  showUserProfile(userId, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(user);
  });
});

export { router as userController };
