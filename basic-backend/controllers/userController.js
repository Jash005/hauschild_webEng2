import express from "express";
import {
  addUser,
  validateLogin,
  isUsernameExist,
  showUserProfile,
  getAllUsers,
  deleteUser,
  deleteAllUser
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
  await addUser(user, (err, newUser) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json(newUser);
  });
});

// Route für den Benutzer-Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  await validateLogin(username, password, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.status(200).json({ message: "Login erfolgreich", user });
  });
});

// alle Benutzer anzeigen
router.get("/", async (req, res) => {
  await getAllUsers((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Abrufen der Benutzer" });
    }
    res.status(200).json(users);
  }
  );
});

// einzelnen Benutzer mit ID anzeigen
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  await showUserProfile(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Abrufen des Benutzers" });
    }
    res.status(200).json(user);
  });
});


/* --- Benutzer löschen --- */
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  await deleteUser(userId, (err, numDeleted) => {
    if (err) {
      return res.status(500);
    }
    if (numDeleted === 0) {
      return res.status(404).send('Benutzer nicht gefunden');
    }
    res.status(200).send('Benutzer gelöscht');
  });
});



//TODO - löschen vor der Abgabe
router.delete('/ALL/ALL', async (req, res) => {
  await deleteAllUser((err, numDeleted) => {
    if (err) {
      return res.status(500);
    }
    if (numDeleted === 0) {
      return res.status(404).send('fehler User');
    }
    res.status(200).send('alles User gelöscht');
  });
});


export { router as userController };
