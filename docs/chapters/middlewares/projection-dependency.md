# Projection Dependency

Il concetto di **projection dependency** consiste nell'avere alcuni campi di un'entità legati ad altri da una dipendenza per cui, selezionati i primi in una projection il sistema deve sempre e automaticamente selezionare i secondi.

Typetta offre la possibilità di creare un middleware che permette in maniera semplice di definire una projetion dependency. Di seguito un esempio in cui alla richiesta del campo ``fullName`` il middleware impone l'aggiunta dei campi ``firstName`` e ``lastName`` alla proiezione:

```typescript
const daoContext = new DAOContext({
  overrides: {
    user: {
      middlewares: [
        projectionDependency({
          fieldsProjection: {
            fullName: true,
          },
          requiredProjection: {
            firstName: true,
            lastName: true,
          },
        }),
      ],
    },
  }
}
```

Di per sé l'utilizzo di questo middleware non risulta particolarmente frequente in manierà a sé stante, ma è invece estremamente utile nella creazione di altri middleware. Esso permette ad esempio di costruire il middleware [computed fields](./computed-fields), grazie al quale è possibile definire del campi virtuali che sono frutto dell'elaborazione di uno o più campi dell'entità storicizzata.
