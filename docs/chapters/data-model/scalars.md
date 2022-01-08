# Scalari

- [Scalari Base](#scalari-base) 
- [Scalari Aggiuntivi](#scalari-aggiuntivi) 
  - [Mapping TypeScript](#mapping-typescript) 
  - [DataType Adapter](#datatype-adapter) 
  - [Validazione](#validazione) 
  <!-- - [Scalari Geospaziali [Draft]](#scalari-geospaziali-draft)  -->

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

E' possibile creare anche scalari aggiuntivi che non abbiano una controparte in un tipo primitivo TypeScript, bensì un tipo o una classe proprietaria o di una libreria di terze parti. Per fare questo occorre aggiungere un ulteriore plugin di generazione che permette di inserire una riga di import all'inizio del file contenente le entità del modello applicativo. Di seguito un esempio di uno scalare Decimal mappato sul tipo di dato BigNumber della libreria [bignumber.js](https://mikemcl.github.io/bignumber.js/){:target="_blank"}:

```yaml
schema: "src/schema.graphql"
generates:
  src/models.ts:
    plugins:
      - add:
          content: 'import BigNumber from "bignumber.js";'
      - "typescript"
    config:
      scalars:
        Decimal: BigNumber
  [...]
```

### DataType Adapter

La seconda specifica necessaria per l'utilizzo di uno scalare aggiuntivo è la definizione dei cosiddetti DataType Adapters.

Un DataType Adapter è un oggetto che contiene due funzioni: una per serializzare lo scalare su uno specifico database e una per deserializzare il valore presente sul database nel tipo di dato TypeScript corrispondente. I DataType Adapters vanno configurati a livello di DAOContext e sono condivisi da tutti i DAO.

Di seguito un esempio di DataType Adapter per lo scalare Decimal già descritto precedentemente. Il tipo di dato TypeScript su cui è mappato questo scalare è BigNumber, mentre il tipo di dato su cui deve essere serializzato su MongoDB è il Decimal128.

```typescript
const decimalDataTypeAdapter : DataTypeAdapter<BigNumber, Decimal128> = {
  dbToModel: (o: Decimal128) => new BigNumber(o.toString()),
  modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
};
```

In maniera ancora più concisa è possibile settare il DataType Adapter direttamente nel costruttore del DAOContext, come mostrato di seguito:

```typescript
const daoContext = new DAOContext({
  adapters: {
    mongo: {
      Decimal: {
        dbToModel: (o: Decimal128) => new BigNumber(o.toString()),
        modelToDB: (o: BigNumber) => Decimal128.fromString(o.toString()),
      }
    }
  }
});
```

### Validazione

Il meccanismo degli scalari aggiuntivi può essere utilizzato anche per definire dei tipi di dato complessi e le loro regole di validazione. Le funzioni di trasformazione `dbToModel` e `modelToDB` vengono infatti invocate ogni qualvolta un dato deve essere serializzato o deserializzato sullo specifico database, quindi si può inserire in esse ogni logica di validazione.

Ipotizziamo per esempio di voler creare uno scalare custom che rappresenti solamente numeri interi positivi:

```typescript
scalar IntPositive
```

si potrebbe difinire un semplice validatore ed il relativo DataType Adapter come segue:

```typescript
const validateIntPositive = (value: number) : boolean => {
  return Number.isInteger(value) && value > 0;
}

const daoContext = new DAOContext({
  adapters: {
    mongo: {
      IntPositive: {
        dbToModel: (dbValue: Int32) => {
          const modelValue = dbValue.valueOf();
          if(validateIntPositive(modelValue)){
            return modelValue;
          } else {
            throw new Error('IntPositive must be a valid positive integer number.');
          }
        },
        modelToDB: (modelValue: number) => {
          if(validateIntPositive(modelValue)){
            return new Int32(modelValue);
          } else {
            throw new Error('IntPositive must be a valid positive integer number.');
          }
        }
      }
    }
  },
});
```

<!-- ### Scalari Geospaziali [Draft]

In molti contesti applicativi risulta utile la definizione di un tipo di dato che identifichi una posizione precisa sul globo terrestre, definita dalle sue coordinate di latitudine e longitudine. Alcuni database supportano in maniera nativa o tramite degli appositi plugin questo tipo di dato e offrono svariate funzioni di query e ordinamento.

Per supportare questo tipo di scalari, in Typetta è stata aggiunta una direttiva con la quale si può specificare che uno scalare aggiuntivo rappresenta una posizione geografica:

```typescript
scalar Coordinates @geopoint
```

Lo scalare in questione segue le stesse identiche regole di tutti gli altri scalari aggiuntivi perciò necessita di un DataType Adapter per fare in modo che venga correttamente trasformato nel tipo di dato atteso dal database target. La direttiva però permette al sistema di estendere i possibili filtri applicabili su un campo di questo tipo, in particolare aggiungendo le seguenti opzioni di query:

```typescript
{
  $near?: {
    $coordnates: Coordinate
    $maxDistance?: number
    $minDistance: number
  }
}
``` -->



