import Datastore from '@seald-io/nedb';

export const userDb = new Datastore({ filename: './databases/users.db', autoload: true });
export const recipeDb = new Datastore({ filename: './databases/recipes.db', autoload: true });

// Funktion zum Hinzufügen eines neuen Benutzers
export function addUser(user, callback) {
  user.createdAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();
  return userDb.insert(user, callback);
}

export function findUserByUsername(username, callback) {
  return userDb.findOne({ username: username }, callback);
}

export function verifyPassword(user, password) {
  return callback(null, user.password === password);
}

// Funktion zum Überprüfen, ob ein Benutzer existiert
export function isUserExist(username, callback) {
  return userDb.findOne({ username: username }, callback);
}

// Funktion zum Überprüfen, ob ein Benutzername existiert
export async function isUsernameExist(username) {
  if(await userDb.findOneAsync({ username: username })) {
    return true;
  } else {
    return false;
  }
}

// Funktion zum Validieren des Benutzer-Logins
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

// Funktion zum Anzeigen des Benutzerprofils (nur Username und Erstellungsdatum)
export function showUserProfile(userId, callback) {
  return userDb.findOne({ _id: userId }, { username: 1, createdAt: 1 }, callback);
}

// Add Comment to Recipe
export function addCommentToRecipe(recipeId, commentContent, author, callback) {
  const updatedComment = {
    commentId: new Date().getTime().toString(), 
    content: commentContent.content,
    author: commentContent.author,
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

//NOTE: no Check 
// Funktion zum Erstellen eines neuen Rezepts
export function addRecipe(recipe, callback) {
  recipe.createdAt = new Date().toISOString();
  recipe.updatedAt = new Date().toISOString();
  recipe.comments = [];
  recipe.rating = 0;
 // recipe.author = 'Anonym';
  return recipeDb.insert(recipe, callback);
}
export function checkAuthHeader(username, password) {
  return userDb.findOne({username: username, password: password});
}

//NOTE: no Check 
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

//NOTE: no Check 
// Funktion zum Löschen eines Rezepts
export function deleteRecipe(recipeId, callback) {
  return recipeDb.remove({ _id: recipeId }, {}, callback);
}

//NOTE: no Check 
// Funktion zum Finden eines Rezepts nach ID
export function findRecipeById(recipeId, callback) {
  return recipeDb.findOne({ _id: recipeId }, callback);
}