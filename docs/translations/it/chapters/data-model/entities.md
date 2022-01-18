# Entità

Ogni modello applicativo è formato da un'insieme di entità. Tali entità in Typetta vengono definite in linguaggio GraphQL, seguendo i principi e la sintassi descritta nella documentazione ufficiale sul sito [graphql.org](https://graphql.org/learn/){:target="_blank"}.

  - [Entità semplici](#entità-semplici)
  - [Entità storicizzate](#entità-storicizzate)
    - [Entità SQL](#entità-sql)
    - [Entità MongoDB](#entità-mongodb)
  - [ID](#id)
  - [Enumerazioni](#enumerazioni)
  - [Entità embedded](#entità-embedded)
  - [Alias](#alias)
  - [Campi esclusi](#campi-esclusi)
  
## Entità semplici

La definizione di base di un'entità è quindi quella di un tipo GraphQL con un elenco di campi:

```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
}
```

Si noti che, seguendo la sintassi GraphQL, ogni campo può essere annotato come obbligatorio o opzionale aggiungendo o meno l'operatore `!` dopo al tipo.

Senza ulteriori specifiche, un'entità come la precedente produrrà solamente il relativo tipo TypeScript ma nessun componente di accesso al dato in quanto non risulta essere un'entità direttamente storicizzata su database.

## Entità storicizzate

Affinchè un'entità risulti collegata alla relativa struttura dati su database e permetta le relative operazioni CRUD, essa deve essere annotata esplicitamente. Esistono ad oggi due classi di driver disponibili in Typetta (SQL e MongoDB) e due relative annotazioni `sqlEntity` e `mongoEntity`.

Una volta aggiunta una di queste annotazioni, l'entità risulta accoppiata alla relativa struttura dati: alla tabella su SQL o alla collection su MongoDB.

### Entità SQL

Per specificare al sistema che un'entità rappresenta una tabella SQL si può definire come segue:
```typescript
type User @sqlEntity {
  id: ID!
  firstName: String
  lastName: String
}
```

L'annotazione `sqlEntity` riceve inoltre due parametri opzionali:
- `source`: che rappresenta il data source SQL in cui risiede la tabella che rappresenta questa entità. Si tratta di un'etichetta logica la cui configurazione andrà settata sul DAOContext. Il valore di default è `default`.

- `table`: che rappresenta il nome della tabella SQL, il valore di default è il nome dell'entità pluralizzato aggiungendo una s finale e con l'iniziale minuscola (quindi nell'esempio di cui sopra sarebbe `users`).

Di seguito quindi un esempio completo:
```typescript
type User @sqlEntity(source: "secondary-database", table: "_users") {
  id: ID!
  firstName: String
  lastName: String
}
```

### Entità MongoDB

Per specificare al sistema che un'entità rappresenta una collection MongoDB si può definire come segue:
```typescript
type User @mongoEntity {
  id: ID!
  firstName: String
  lastName: String
}
```

L'annotazione `mongoEntity` riceve inoltre due parametri opzionali:
- `source`: che rappresenta il data source MongoDB in cui risiede la collection che rappresenta questa entità. Si tratta di un'etichetta logica la cui configurazione andrà settata sul DAOContext. Il valore di default è `default`.

- `collection`: che rappresenta il nome della collection MongoDB, il valore di default è il nome dell'entità pluralizzato aggiungendo una s finale e con l'iniziale minuscola (quindi nell'esempio di cui sopra sarebbe `users`).

Di seguito quindi un esempio completo:
```typescript
type User @mongoEntity(source: "secondary-database", collection: "_users") {
  id: ID!
  firstName: String
  lastName: String
}
```

## ID

Ogni entità storicizzata necessita di un identificativo univoco. Qualsiasi campo dell'entità può essere annotato come `@id` purchè abbia come tipo uno scalare e non un'altra entità. Non c'è alcuna correlazione tra lo scalare GraphQL ID e l'id dell'entità. 

Per definire l'id di un'entità si deve utilizzare la direttiva `@id` come nel seguente esempio:
```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
}
```

Tale direttiva riceve anche un parametro opzionale `from` che può assumere i seguenti valori:
- `db`: quando l'id viene autogenerato dal DB, sia esso un intero autoincrementale SQL o una stringa univoca come in MongoDB.

```typescript
type User @mongoEntity {
  id: String! @id(from: "db") @alias(value: "_id")
  name: String!
}
```

- `user`: quando l'id viene generato manualmente dall'utilizzatore di Typetta, sarà quindi un campo obbligatorio di ogni operazione di insert.

- `generator`: quando l'id viene autogenerato da Typetta con una logica configurabile a livello di DAOContext o di singolo DAO. Si può creare un generatore di ID per ogni scalare che verrà quindi invocato per tutti i campi dello specifico scalare annotati con la direttiva `@id`. Un esempio di utilizzo è il caso in cui tutti gli ID debbano essere gestiti come UUID creati a livello applicativo. Per ottenere questo si può quindi configurare il DAOContext come segue:

```typescript
import { v4 as uuidv4 } from 'uuid'

const daoContext = new DAOContext({
  scalars: {
    ID: {
      generator: () => uuidv4()
    }
  }
});
```

Se si vuole un comportamento diverso per un singolo DAO, si può creare un override come il seguente:

```typescript
import { v4 as uuidv4 } from 'uuid'

const daoContext = new DAOContext({
  scalars: {
    ID: {
      generator: () => uuidv4()
    }
  }
  overrides: {
    user: {
      scalars: {
        ID: {
          generator: () => 'user_' + uuidv4()
        }
      }
    }
  }
});
```

## Enumerazioni

La specifica GraphQL prevede la definizione di enumerazioni con la seguente sintassi:
```typescript
enum UserType {
  ADMINISTRATOR
  CUSTOMER
}
```

Un'enumerazione può essere utilizzata esattamente come uno scalare per definire i campi di un'entità, come dall'esempio seguente:
```typescript
type User {
  id: ID!
  firstName: String
  lastName: String
  type: UserType!
}
```

Typetta supporta le enumerazioni sia a livello di tipo TypeScript che a livello di database, sia SQL che MongoDB, dove vengono serializzate in tipo di dato stringa.

## Entità embedded

Un'entità embedded è un'entità non direttamente storicizzata in una tabella SQL o in una collection MongoDB, ma inclusa solamente dentro ad un'altra entità con una logica di composizione. Le entità embedded sono un concetto tipico dei database documentali, che tuttavia può essere parzialmente supportato anche dai database SQL, come descritto in seguito. 

In Typetta ogni entità può avere uno o più campi che a loro volta sono altre entità embedded. Queste seconde entità non possono essere annotate come `@sqlEntity` o `@mongoEntity`. Di seguito un semplice esempio: 

```typescript
type Address {
  street: String
  city: String
  district: String
  zipcode: String
  country: String
}

type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  address: Address
}
```

Typetta offre il più avanzato supporto possibile alle entità embedded su MongoDB, che vengono trasformate in embedded documents, dando quindi la possibilità di selezionare, filtrare e ordinare i campi delle entità embedded. Sui database SQL queste entità vengono invece appiattite su molteplici colonne, offerndo anche in questo caso la possibilità di selezionare, filtrare e ordinare i campi delle entità embedded.

## Alias

Ogni campo di un'entità storicizzata ha una corrispondenza diretta con la relativa colonna SQL o la relativa chiave del documento MongoDB e tale corrispondenza è data dal nome del campo stesso. Nel caso si voglia disaccoppiare il nome dell'entità del modello applicativo dalla chiave presente sul database si può utilizzare la direttiva alias:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String @alias(value: "name")
  lastName: String @alias(value: "surname")
  address: Address
}
```

Nel precedente esempio il tipo TypeScript generato avrà i campi `firstName:string` e `lastName:string`, mentre i documenti della connection MongoDB avrà due chiavi `name` e `surname`.

## Campi esclusi

E' possibile definire dei campi nel modello applicativo che non hanno corrispondenza nella tabella SQL o nella collection MongoDB. Questi campi si riflettono quindi sul tipo di dato TypeScript ma non vengono né serializzati né deserializzati sul database.

Per definire un campo esluso si può utilizzare la direttiva `@exclude` come di seguito:

```typescript
type User @mongoEntity {
  id: ID! @id
  firstName: String
  lastName: String
  excludedField: String @exclude
}
```