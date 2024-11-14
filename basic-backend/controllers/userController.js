import express from 'express';
import { addUser, validateLogin, isUsernameExists, showUserProfile } from '../models/databases.js';

const router = express.Router();

// Route für die Benutzerregistrierung
router.post('/register', async (req, res) => {
  const user = req.body;
  if(await isUsernameExists(user.username)) {
    return res.status(400).json({ error: 'Username existiert bereits' });
  }
  addUser(user, (err, newUser) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json(newUser);
  });

});

// Route für den Benutzer-Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  validateLogin(username, password, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    res.status(200).json({ message: 'Login erfolgreich', user });
  });
});

// Route zum Anzeigen des Benutzerprofils
router.get('/profile', async (req, res) => {
  const userId = req.query.userId;
  showUserProfile(userId, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(user);
  });
});

export { router as userController };
