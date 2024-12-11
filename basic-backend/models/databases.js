import Datastore from '@seald-io/nedb';

export const userDb = new Datastore({ filename: './databases/users.db', autoload: true });
export const recipeDb = new Datastore({ filename: './databases/recipes.db', autoload: true });

/* ====================================
        User Database Functions
==================================== */
// Hinzufügen eines neuen Benutzers
export function addUser(user, callback) {
  user.createdAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();
  return userDb.insert(user, callback);
}

//TODO
// Überprüfen, ob ein Benutzer existiert
export function isUserExist(username, callback) {
  return userDb.findOne({ username: username }, callback);
}

// Überprüfen, ob ein Benutzername existiert
export async function isUsernameExist(username) {
  return !!(await userDb.findOneAsync({username: username}));
}

// Validieren des Benutzer-Logins
export function validateLogin(username, password, callback) {
  return userDb.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      return callback(err || new Error('User not found'));
    }
    const isValid = user.password === password;
    callback(null, isValid ? user : null);
  });
}

// Alle Benutzer anzeigen (nur Username und ID)
export function getAllUsers(callback) {
  return userDb.find({}, { username: 1, _id: 1 }, callback);
}

// Anzeigen des Benutzerprofils (nur Username und Erstellungsdatum)
export function showUserProfile(userId, callback) {
  return userDb.findOne({ _id: userId }, { username: 1, createdAt: 1 }, callback);
}

// Löschen eines Benutzers
export function deleteUser(userId, callback) {
  return userDb.remove({ _id: userId }, {}, callback);
}



/* ====================================
        Recipe Database Functions
==================================== */
// Kommentar zu einem Rezept hinzufügen
export function addCommentToRecipe(recipeId, commentContent, author, callback) {
  const updatedComment = {
    commentId: new Date().getTime().toString(), 
    content: commentContent.content,
    author: commentContent.author,
    authorId: commentContent.authorId,
    createdAt: new Date().toISOString()
  };
  
  return recipeDb.update(
    { _id: recipeId },
    {
      $push: {
        comments: updatedComment
      },
      $set: { updatedAt: new Date().toISOString() }
     },
    {},
    callback
  );
}

// Erstellen eines neuen Rezepts
export function addRecipe(recipe, callback) {
  recipe.createdAt = new Date().toISOString();
  recipe.updatedAt = new Date().toISOString();
  recipe.comments = [];
  recipe.rating = 0;
  
  return recipeDb.insert(recipe, callback);
}

// Überprüfen des Auth-Headers
export function checkAuthHeader(username, password) {
  return userDb.findOne({username: username, password: password});
}


// Aufrufen aller Rezepte nach Aktualisierungsdatum von Neu nach alt sortiert
export function getAllRecipes(callback) {
  return recipeDb.find({}, {author: 1, authorId: 1, rating: 1, recipeCategory: 1, recipeDescription: 1, recipeTitle: 1, updatedAt: 1, _id: 1}).sort({ updatedAt: -1 }).exec(callback);
}

// Abrufen der Top 5 Rezepte nach Bewertung
export function getTopRecipesWithLimit(limit, callback) {
  return recipeDb.find({}, {author: 1, authorId: 1, rating: 1, recipeCategory: 1, recipeDescription: 1, recipeTitle: 1, updatedAt: 1, _id: 1}).sort({ rating: -1 }).limit(limit).exec(callback);
}

// Finden eines Rezepts nach ID
export function findRecipeByUserId(userId, callback) {
  return recipeDb.findOne({ authorId: userId }, callback);
}

// Finden eines Kommentars für die Kommentarhistorie
export function findCommentByUserId(userId, callback) {
  return recipeDb.find({ 'comments.authorId': userId }, callback);
}

// Löschen eines Rezepts
export function deleteRecipe(recipeId, callback) {
  return recipeDb.remove({ _id: recipeId }, {}, callback);
}



// Bearbeiten eines Rezepts
export function editRecipe(recipeId, updatedRecipe, callback) {
  updatedRecipe.updatedAt = new Date().toISOString();
  return recipeDb.update(
    { _id: recipeId },
    { $set: updatedRecipe },
    {},
    callback
  );
}


// Finden eines Rezepts nach ID
export function findRecipeById(recipeId, callback) {
  return recipeDb.findOne({ _id: recipeId }, callback);
}




//TODO - löschen vor der Abgabe
export function deleteAllUser(callback) {
  return userDb.remove({}, { multi: true }, callback);
}
export function deleteAllRecipe(callback) {
  return recipeDb.remove({}, { multi: true }, callback);
}