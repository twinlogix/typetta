# Paginazione

La paginazione dei risultati può generalmente essere effettuata in due modi:

  - [Paginazione tramite offset](#paginazione-tramite-offset)
  - [Paginazione tramite cursore *[presto disponibile]*](#paginazione-tramite-cursore-presto-disponibile)

## Paginazione tramite offset

La paginazione tramite offset prevede l'utilizzo di due parametri `start` e `limit` per definite il primo record richiesto e limitare il numero totale dei risultati. La seguente lettura permette di recuperare 10 utenti partendo dal terzo (saltando quindi i primi due).

```typescript
const users = await daoContext.user.findAll({
  start: 2,
  limit: 10
})
```

Si noti che il parametro `start` è 0-based e di default pari a 0.

## Paginazione tramite cursore *[presto disponibile]*

Questa funzionalità non è ancora disponibile ed è attualmente in fase di progettazione.