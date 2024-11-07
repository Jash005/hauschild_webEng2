# Notizen zur Aufgabenstellung
## Zur Abgabe - **22.12.24**
- keine node_module (über npm install)
- kein dist-Ordner (über ng build erzeugt)
- README.md Datei anfügen
- API-Dokumentation als _API-DOC_ ( 20% )
- Applikation ( 80% )

## Code Quality
typo = Fehler in Variable bezeichnungen


## Boilerplate Code (Vorlage)
|_| Autor (author) ändern

### basic-backend ODER basic-backendTS (! andere löschen)
_npm install_
_npm run start_

- app.js: 
- api.js: 
    Controllers hinzufügen wie echoController (User, Rezepte, ...)
- echo.js: 
    ! Validierung sinnvoll selbst wählen
    mit NeDB (emfpholen und dafür gebaut)
- Model: Datenbank
- Controller: routen und request
- Services: Businesslogik
|_| Fehlercode immer die passendste wählen (201 oder 204 anstelle von 200)



### basic-frontend
_npm install_
_npm run build_ (zum abgeben)
_ng serve_ (zum Entwickeln)

- Basepath bei Links (wie Bildern) ist default puclic/
|_| app.routes.ts: erweitern um meine routen
|_| api.service.ts: 
    zwischen Komponenten (Frontend) und Backend -> keine direkten anfragen von Frontend zum Backend
    Dateinamen zu API (BASE_URL)
    post() Methode kann so übernommen werden
        const errorText...: kann für Fehler verwendet werden (aber eigentlich nicht notwendig)
        Fehlerbehandlungen sind nicht implementiert, kann auf bedarf ergänzt werden
|_| auth.service


- shared/ : eine Komponente, die für verschiedene Sachen genutzt werden
- features/ : eine alleinstehende Komponenten die nicht von mehreren Komponenten genutzt wird

types/echo.type.ts

.gitkeep : nur für leere Ordner, da diese in Git sonst nicht drin sind




### Aufteilung
Frontend schwerer/aufwendiger als Backend

### Vorgehen
1 Git Repository anlegen
2 Grob Struktur festlegen
    aufeilen an Seiten -> Ressourcen -> API -> Datenbank
