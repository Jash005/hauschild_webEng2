import express from 'express';
import { addUser, isUserLogin, validateLogin, showUserProfile } from '../models/databases.js';

const router = express.Router();

// Middleware für Basic Authentication
async function basicAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send('Authorisierungs Header fehlt');
    }
  
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
  
    await findUserByEmail(email, async (err, user) => {
      if (err || !user) {
        return res.status(401).send('Falsche E-Mail oder Passwort');
      }
  
      await verifyPassword(user, password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).send('Falsche E-Mail oder Passwort');
        }
  
        req.user = user;
        next();
      });
    });
  }

// Route für die Benutzerregistrierung
router.post('/register', async (req, res) => {
    console.log("HIER IN REGISTER");
  const user = req.body;
  await addUser(user, (err, newUser) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(newUser);
  });
});

// Route für den Benutzer-Login (nur zur Demonstration, Basic Auth wird normalerweise in Middleware verwendet)
router.post('/login', basicAuth, (req, res) => {
  res.status(200).send('Login erfolgreich');
});



export { router as userController };
