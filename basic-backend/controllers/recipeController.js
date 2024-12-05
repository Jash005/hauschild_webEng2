import express from 'express';
import { addRecipe, addCommentToRecipe, findRecipeById, checkAuthHeader, editRecipe } from '../models/databases.js';

const router = express.Router();

// Middleware für Basic Authentication
function basicAuth(req, res, next) {
  if (req.headers['authorization']) {
      //Autorisierungs-Header überprüfen
      const authHeader = req.headers['authorization'];
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      req.username = username;
      req.password = password;

      //suche in UserDB nach username und password
      if(checkAuthHeader(username, password)){  
        next();
      } else {  
        res.status(401);
        res.json({message: 'falscher Authorisierungs Header'});
      } 

  } else {
      res.status(401);
      res.json({message: 'Authorisierungs Header fehlt'});
  }
}

// Route zum Hinzufügen eines neuen Rezepts (geschützt durch Basic Auth)
router.post('/', basicAuth, async (req, res) => {
  const recipe = req.body;
  await addRecipe(recipe, (err, newRecipe) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(newRecipe);
  });
});

router.put('/:id',async (req, res) => {
  const recipeId = req.params.id;
  const recipe = req.body;
  await editRecipe(recipeId, recipe, (err, numUpdated) => {
    if (err) {
      return res.status(500).send;
    } else {
      return res.status(200).send('Rezept aktualisiert');
    }
  });
});


//NOTE: no Check 
// Route zum Abrufen eines Rezepts nach ID
router.get('/:id', async (req, res) => {
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
router.put('/:id/comments', basicAuth, async (req, res) => {
  const recipeId = req.params.id;
  const comment = req.body;
  const author = req.author;
  await addCommentToRecipe(recipeId, comment, author, (err, numUpdated) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (numUpdated === 0) {
      return res.status(404).send('Rezept nicht gefunden');
    }
    res.status(200).send('Kommentar hinzugefügt');
  });
});

export { router as recipeController };
