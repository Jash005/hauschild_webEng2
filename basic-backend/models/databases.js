import Datastore from '@seald-io/nedb';

export const userDb = new Datastore({ filename: './databases/users.db', autoload: true });
export const recipeDb = new Datastore({ filename: './databases/recipes.db', autoload: true });

// Funktion zum Hinzufügen eines neuen Benutzers
export function addUser(user, callback) {
  user.createdAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();
  return userDb.insert(user, callback);
}

// Funktion zum Überprüfen, ob ein Benutzer existiert
export function isUserLogin(email, callback) {
  return userDb.findOne({ email: email }, callback);
}

// Funktion zum Validieren des Benutzer-Logins
export function validateLogin(email, password, callback) {
  return userDb.findOne({ email: email }, (err, user) => {
    if (err || !user) {
      return callback(err || new Error('User not found'));
    }
    const isValid = user.password === password;
    callback(null, isValid ? user : null);
  });
}

// Funktion zum Anzeigen des Benutzerprofils
export function showUserProfile(userId, callback) {
  return userDb.findOne({ _id: userId }, callback);
}

// Funktion zum Hinzufügen eines Kommentars zu einem Rezept
export function addComment(recipeId, comment, callback) {
  comment.commentId = new Date().getTime().toString(); // Generiere eine eindeutige ID für den Kommentar
  comment.createdAt = new Date().toISOString();
  return recipeDb.update(
    { _id: recipeId },
    { $push: { comments: comment }, $set: { updatedAt: new Date().toISOString() } },
    {},
    callback
  );
}

// Funktion zum Erstellen eines neuen Rezepts
export function createRecipe(recipe, callback) {
  recipe.createdAt = new Date().toISOString();
  recipe.updatedAt = new Date().toISOString();
  return recipeDb.insert(recipe, callback);
}

// Funktion zum Bearbeiten eines Rezepts
export function editRecipe(recipeId, updatedRecipe, callback) {
  updatedRecipe.updatedAt = new Date().toISOString();
   return recipeDb.update(
    { _id: recipeId },
    { $set: updatedRecipe },
    {},
    callback
  );
}

// Funktion zum Löschen eines Rezepts
export function deleteRecipe(recipeId, callback) {
  return recipeDb.remove({ _id: recipeId }, {}, callback);
}

// Funktion zum Finden eines Rezepts nach ID
export function findRecipeById(recipeId, callback) {
  return recipeDb.findOne({ _id: recipeId }, callback);
}