import express from 'express';
import { addRecipe, addCommentToRecipe, findRecipeById } from '../models/recipe.js';

const router = express.Router();

// Middleware für Basic Authentication
function basicAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send('Authorisierungs Header fehlt');
    }
  
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
  
    userDb.findUserByEmail(email, (err, user) => {
      if (err || !user) {
        return res.status(401).send('Falsche E-Mail oder Passwort');
      }
  
      userDb.verifyPassword(user, password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).send('Falsche E-Mail oder Passwort');
        }
  
        req.user = user;
        next();
      });
    });
  }


// Route zum Hinzufügen eines neuen Rezepts (geschützt durch Basic Auth)
router.post('/recipes', basicAuth, async (req, res) => {
  const recipe = req.body;
  await addRecipe(recipe, (err, newRecipe) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(newRecipe);
  });
});

// Route zum Abrufen eines Rezepts nach ID
router.get('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  await findRecipeById(recipeId, (err, recipe) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!recipe) {
      return res.status(404).send('Rezept nicht gefunden');
    }
    res.status(200).send(recipe);
  });
});

// Route zum Hinzufügen eines Kommentars zu einem Rezept (geschützt durch Basic Auth)
router.post('/recipes/:id/comments', basicAuth, async (req, res) => {
  const recipeId = req.params.id;
  const comment = req.body;
  await addCommentToRecipe(recipeId, comment, (err, numUpdated) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (numUpdated === 0) {
      return res.status(404).send('Rezept nicht gefunden');
    }
    res.status(200).send('Kommentar hinzugefügt');
  });
});

export { router as userController };
