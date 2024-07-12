# Progetto Basi di Dati

## Descrizione dei files

### Diagrammi ER
I diagrammi ER sono stati realizzati con il software [draw.io](https://app.diagrams.net/).
Files disponibili nella cartella [Diagrammi](Diagrammi).
- [Diagramma ER Iniziale](Diagrammi/Diagramma ER Iniziale.drawio)
- [Diagramma ER Completo](Diagrammi/Diagramma ER Completo.drawio)
- [Accorpamento](Diagrammi/Accorpamento.drawio)


### Schema del database
Lo schema logico del database è stato realizzato con il programma di JetBrains [DataGrip](https://www.jetbrains.com/datagrip/).
File disponibile nella cartella [Diagrammi](Diagrammi).
- [Schema Logico](Diagrammi/Schema Logico.png)

### Script SQL
Gli script SQL per la creazione delle tabelle, delle viste, delle procedure e dei triggers sono disponibili nella cartella [directives](code/directives).
- [Creazione Tabelle](code/directives/Creazione_db.sql)
- [Creazione Viste](code/directives/Creazione_viste.sql)
- [Creazione Procedure](code/directives/Creazione_procedure.sql)
- [Creazione Triggers](code/directives/Creazione_triggers.sql)

### Codice del progetto
Il codice del progetto si divide in backend e frontend. Il backend è stato realizzato con node.js e express.js, mentre il frontend è stato realizzato con Vue.js.
- I file del backend sono disponibili nella cartella [code](code).
- I file del frontend sono disponibili nella cartella [frontend](frontend). 

Al primo avvio del progetto è necessario installare le dipendenze di entrambi i progetti, e compilare il frontend.

## Avvio del progetto
Il progetto è stato realizzato con Docker, per avviarlo è necessario avere installato Docker e Docker Compose.

Per avviare il progetto è necessario entrare nella cartella del progetto con il terminale e lanciare il comando:
```bash
docker-compose up
```

Il progetto sarà disponibile all'indirizzo [http://localhost:5387](http://localhost:5387) dopo aver finito l'inizializzazione delle dipendenze e la compilazione del frontend.
