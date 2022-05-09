# Scalari

- [Scalari Base](#scalari-base) 
- [Scalari Aggiuntivi](#scalari-aggiuntivi) 
  - [Mapping TypeScript](#mapping-typescript) 
  - [DataType Adapter](#datatype-adapter) 
  - [Validazione](#validazione) 

## Scalari Base

La specifica GraphQL ha un elenco di scalari di base, una sorta di tipi di dato standard, da cui attingere nella modellazione di un'entità. Questo elenco si compone di:
- **Int**: un intero con segno a 32‐bit.
- **Float**: un intero con segno a double-precision e floating-point.
- **String**: una sequenza di caratteri UTF‐8.
- **Boolean**: un booleano true/false.
- **ID**: un identificatore univoco.

Questi scalari possono essere utilizzati per la modellazione di un'entità come nell'esempio seguente:
```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
  active: Boolean
}
```

## Scalari Aggiuntivi

Questo insieme di scalari standard può poi essere esteso con un numero a piacere di scalari aggiuntivi, che possono essere definiti nello schema GraphQL *schema.graphql* con la seguente sintassi:

```typescript
scalar Timestamp
scalar DateTime
```

Ogni volta che si definisce un nuovo scalare occorre configurare il sistema affinchè sappia come esso deve essere rappresentato nel tipo di dato TypeScript e come deve essere serializzato e deserializzato su ogni driver (SQL, MongoDB ed eventuali altri aggiuntivi). 

Il meccanismo di estensibilità dato dagli scalari aggiuntivi è molto potente perchè permette di aumentare l'espressività del modello applicativo e di creare regole di validazione del dato che vengono applicate da Typetta prima di storicizzare il dato su database.

### Mapping TypeScript

Il mapping di uno scalare aggiuntivo nel relativo tipo TypeScript va configurato nel file di configurazione del generatore *codegen.yml*. Come si può vedere nell'esempio seguente, in questo file possiamo aggiungere tutti i mapping necessari all'interno della sezione *config* del generatore standard TypeScript:

```yaml
schema: "src/schema.graphql"
generates:
  src/models.ts:
    plugins:
      - "typescript"
    config:
      scalars:
        Timestamp: Date
        DateTime: Date
  [...]
```
La chiave di sinistra corrisponde al nome dello scalare aggiuntivo definito nello schema GraphQL, mentre il valore di destra è il tipo di dato TypeScript corrispondente.

E' possibile creare anche scalari aggiuntivi che non abbiano una controparte in un tipo primitivo TypeScript, bensì un tipo o una classe proprietaria o di una libreria di terze parti. 

Di seguito un esempio di uno scalare Decimal mappato sul tipo di dato BigNumber della libreria [bignumber.js](https://mikemcl.github.io/bignumber.js/){:target="_blank"}:

```yaml
schema: "src/schema.graphql"
generates:
  src/models.ts:
    plugins:
      - "typescript"
    config:
      scalars:
        Decimal: bignumber.js#BigNumber
  [...]
```

### Scalar Adapter

La seconda specifica necessaria per l'utilizzo di uno scalare aggiuntivo è la definizione del suo cosiddetto *adapter*.

Uno ``Scalar Adapter`` è un oggetto che contiene le specifiche di come il sistema deve comportarsi con lo specifico scalare in merito a:
- Serializzazione sul database
- Deserializzazione dal database
- Validazione
- Autogenerazione

Gli Scalar adapters vanno configurati a livello di EntityManager e sono condivisi da tutti i DAO.

Di seguito un esempio di Scalar Adapter per lo scalare Decimal già descritto precedentemente. Il tipo di dato TypeScript su cui è mappato questo scalare è BigNumber, mentre il tipo di dato su cui deve essere serializzato su MongoDB è il Decimal128.

```typescript
const decimalAdapter = {
  dbToModel: (o: Decimal128) => new BigNumber(o.toString()),
  modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
};
```

Nel caso si stiano utilizzando sorgenti dati di tipo diverso, sia MongoDB che SQL, è possibile specificare due adapter diversi come nel seguente esempio in cui per SQL il tipo di dato Decimal viene storicizzato in un campo di tipo stringa:

```typescript
const decimalAdapter = {
  mongo: {
    dbToModel: (o: Decimal128) => new BigNumber(o.toString()),
    modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
  },
  knexjs: {
    dbToModel: (o: String) => new BigNumber(o),
    modelToDB: (o: BigNumber) => o.toString(),
  }
};
```
La configurazione del EntityManager con lo scalar adapter di cui sopra risulta quindi la seguente:

```typescript
const entityManager = new EntityManager({
  scalars: {
    Decimal: decimalAdapter
  }
});
```

### Validazione

Ogni `Scalar Adapter` permette la specifica di regole di validazione che vengono applicate sia alla lettura che alla scrittura dello scalare su ogni sorgente dati.

Ipotizziamo per esempio di voler creare uno scalare aggiuntivo che rappresenti solamente numeri interi positivi:

```typescript
scalar IntPositive
```

E' possibile difinire un semplice validatore ed il relativo `Scalar Adapter` come segue:

```typescript
const entityManager = new EntityManager({
  scalars: {
    IntPositive: {
      validate: (data: number) : Error | true => {
        if(Number.isInteger(value) && value > 0){
          return true;
        } else {
          return new Error('IntPositive must be a valid positive integer number.');
        }
      }
    }
  }
});
```
