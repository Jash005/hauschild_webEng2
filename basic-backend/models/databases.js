import Datastore from '@seald-io/nedb';

// Bei macOS: './databases/echo.db' mit '../databases/echo.db' ersetzen

export const echoDb = new Datastore({ filename: './databases/echo.db', autoload: true });
