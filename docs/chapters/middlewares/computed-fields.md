# Computed Fields

Per **campo calcolato** si intende un campo di un'entità che non è presente nella sorgente dati, ma è frutto di un'elaborazione eseguita utilizzando il valore di altri campi. Un campo calcolato quindi viene ignorato in ogni operazione di inserimento o modifica e viene invece popolato automaticamente dal sistema in ogni operazione di lettura in cui site richiesto.

Typetta offre un comodo middleware che può essere utilizzato per la definizione di campi calcolati. Nel seguente esempio si mostra come è possibile definire un campo ``fullName`` che è la composizione di ``firstName`` e ``lastName`` di un'ipotetica entità che rappresenta un utente. Questi ultimi due sono campi effettivamente storicizzati nella sorgente dati, mentre ``fullName`` è di fatto un campo virtuale.

```typescript
const daoContext = new DAOContext({
  overrides: {
    user: {
      middlewares: [
        computedField({
          fieldsProjection: {
            fullName: true
          },
          requiredProjection: {
            firstName: true,
            lastName: true
          },
          compute: async (user) => {
            return {
              fullName: `${user.fisrtName} ${user.lastName}`,
            }
          }
        })
      ],
    },
  }
}
```

Nell'esempio precedente ``fieldsProjection`` rappresenta l'insieme del campi calcolati, ``requiredProjection`` rappresenta l'insieme dei campi che sono necerrari per l'elaborazione e ``compute`` la funzione che riceve in input i campi presenti sulla sorgente dati e deve fornire in output i campi calcolati a valle dell'elaborazione.

Si noti che questo middleware utilizza il [Projection Dependency Middleware](./projection-dependency.md) descritto in precedenza con una logica di composizione e riutilizzo.