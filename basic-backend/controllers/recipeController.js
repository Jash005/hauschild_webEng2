import express from "express";
import {
  addRecipe,
  addCommentToRecipe,
  findRecipeById,
  checkAuthHeader,
  editRecipe,
  getAllRecipes,
  deleteRecipe,
  getTopRecipesWithLimit,
  findRecipeByUserId,
  findCommentByUserId,
} from "../models/databases.js";

const router = express.Router();

/* ----------- Middleware für Basic Authentication -----------*/
function basicAuth(req, res, next) {
  if (req.headers["authorization"]) {
    // Autorisierungs-Header überprüfen
    const authHeader = req.headers["authorization"];
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");
    req.username = username;
    req.password = password;

    // suche in UserDB nach username und password
    if (checkAuthHeader(username, password)) {
      next();
    } else {
      res.status(401);
      res.json({ message: "falscher Authorisierungs Header" });
    }
  } else {
    res.status(401);
    res.json({ message: "Authorisierungs Header fehlt" });
  }
}

/* ----------- Routen -----------*/
// Hinzufügen eines neuen Rezepts (geschützt durch Basic Auth)
router.post("/", basicAuth, async (req, res) => {
  const recipe = req.body;
  await addRecipe(recipe, (err, newRecipe) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(newRecipe);
  });
});

// bekomme zufällige Rezept ID
router.get("/random", async (req, res) => {
  await getAllRecipes((err, resData) => {
    if (err) {
      return res.status(500).send("Rezepte konnten nicht gefunden werden");
    }
    const randomIndex = Math.floor(Math.random() * resData.length);
    const randomRecipe = resData[randomIndex];
    res
      .status(200)
      .json({ id: randomRecipe._id, authorId: randomRecipe.authorId });
  });
});

// Rezept aktualisieren
router.put("/:id", async (req, res) => {
  const recipeId = req.params.id;
  const recipe = req.body;
  await editRecipe(recipeId, recipe, (err) => {
    if (err) {
      return res.status(500).send;
    } else {
      res.status(200).send("Rezept aktualisiert");
    }
  });
});

// Rezpte abrufen nach Aktualisierungsdatum
router.get("/", async (req, res) => {
  await getAllRecipes((err, resData) => {
    if (err) {
      return res.status(500).send("Rezepte konnten nicht gefunden werden");
    }
    res.status(200).send(resData);
  });
});

// Rezept abrufen nach Bewertung (Top 5)
router.get("/top", async (req, res) => {
  await getTopRecipesWithLimit(5, (err, resData) => {
    if (err) {
      return res.status(500).send("Rezepte konnten nicht gefunden werden");
    }
    res.status(200).send(resData);
  });
});

// Route zum Abrufen eines Rezepts nach ID
router.get("/:id", async (req, res) => {
  const recipeId = req.params.id;
  await findRecipeById(recipeId, (err, resData) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!resData) {
      return res.status(404).send("Rezept nicht gefunden");
    }
    res.status(200).send(resData);
  });
});

// Route zum Hinzufügen eines Kommentars zu einem Rezept (geschützt durch Basic Auth)
router.put("/:id/comments", basicAuth, async (req, res) => {
  const recipeId = req.params.id;
  const comment = req.body;
  const author = req.author;
  const authorId = req.authorId;
  await addCommentToRecipe(
    recipeId,
    comment,
    author,
    authorId,
    (err, numUpdated) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (numUpdated === 0) {
        return res.status(204).send("Keine Kommentare vorhanden");
      }
      res.status(200).send("Kommentar hinzugefügt");
    }
  );
});

// Rezept Verlauf einer UsersId
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  await findRecipeByUserId(userId, (err, resData) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!resData) {
      return res.status(204).send("keine Rezepte vorhanden");
    }
    res.status(200).send(resData);
  });
});

// Kommentar Verlauf einer UserId
router.get("/comment/:id", async (req, res) => {
  const userId = req.params.id;
  await findCommentByUserId(userId, (err, resData) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!resData) {
      return res.status(404).send("Kommentar nicht gefunden");
    }
    res.status(200).send(resData);
  });
});

// Rezept löschen
router.delete("/:id", async (req, res) => {
  const recipeId = req.params.id;
  await deleteRecipe(recipeId, (err, numDeleted) => {
    if (err) {
      return res.status(500);
    }
    if (numDeleted === 0) {
      return res.status(404).send("Rezept nicht gefunden");
    }
    res.status(200).send("Rezept gelöscht");
  });
});

export { router as recipeController };
