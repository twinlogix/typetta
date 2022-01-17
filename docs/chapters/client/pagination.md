# Paginazione

La paginazione dei risultati può generalmente essere effettuata in due modi:

  - [Paginazione tramite offset](#paginazione-tramite-offset)
  - [Paginazione tramite cursore *[presto disponibile]*](#paginazione-tramite-cursore-presto-disponibile)

## Paginazione tramite offset

La paginazione tramite offset prevede l'utilizzo di due parametri `skip` e `limit` per definire da quale record partire e limitare il numero totale dei risultati. La seguente lettura permette di recuperare 10 utenti partendo dal terzo (saltando quindi i primi due).

```typescript
const users = await daoContext.user.findAll({
  skip: 2,
  limit: 10
})
```

## Paginazione tramite cursore *[presto disponibile]*

Questa funzionalità non è ancora disponibile ed è attualmente in fase di progettazione.