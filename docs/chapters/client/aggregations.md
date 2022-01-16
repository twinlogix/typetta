# Aggregazioni

Typetta supporta la lettura di dati aggregati e/o gruppati attraverso una specifica API di nome [aggregate](/typedoc/classes/AbstractDAO.html#aggregate){:target="_blank"}.

  - [Campi aggregati](#campi-aggregati)
  - [Count](#count)
  - [Raggruppamenti](#raggruppamenti)
  - [Filtri e ordinamenti](#filtri-e-ordinamenti)

## Campi aggregati

Al fine di definire dei campi aggregati, il cui valore è frutto dell'applicazione di un operatore su tutti i record raggruppati, l'API `aggregate` accetta uno specifico parametro `aggregations`. Tramite questo parametro l'utente può specificare una mappa le cui chiavi sono i nomi dei nuovi campi aggregati che verranno ritornati nel risultato e i cui valori sono le definizioni di come questi campi devono essere calcolati.

Ipotizziamo per esempio di voler leggere il numero totale di utenti e la loro età media:

```typescript
const res = await dao.user.aggregate(
  {
    aggregations: { 
      userCount: { field: 'id', operation: 'count' }, 
      averageAge: { field: 'age', operation: 'avg' } 
    },
  }
)
```

Il risultato di questa operazione sarà del tipo:

```typescript
{
  userCount: 123,
  averageAge: 24.9
}
```

Si noti che nell'esempio `userCount` e `averageAge` sono due chiavi definite dall'utente e la cui logica di calcolo dipende dal parametro `operation`. Le `aggregations` possono riguardare solamente campi di tipo numerico e le relative `operation` possono assumere i seguenti valori:
- `count`: conta il numero di occorrenze
- `sum`: effettua la somma di tutti i valori
- `avg`: effettua la media di tutti i valori
- `min`: trova il minimo tra tutti i valori
- `max`: trova il massimo tra tutti i valori

## Count

A differenza di tutti gli altri operatori, che devono necessariamente essere specificati su `aggregations` di uno specifico campo, l'operatore `count` può essere applicato in maniera globale, per calcolare il numero totale di risultati. 

Di seguito un esempio di interrogazione del numero totale di utenti:

```typescript
const res = await dao.user.aggregate(
  {
    aggregations: { 
      userCount: { operation: 'count' }
    }
  }
)
```

Il cui risultato sarà:

```typescript
{
  userCount: 123
}
```

## Raggruppamenti

L'API `aggregate` permette all'utente di raggruppare i record per il valore di uno o più campi e di calcolare le aggregazioni su ognuno dei gruppi trovati. per fare questo l'API mette a disposizione il parametro `by` tarmite il quale è possibile specificare una sorta di proiezione dei campi che devono costituire la chiave dei vari gruppi.

Nel seguente esempio una aggregate in cui gli utenti vengono raggruppati per sesso e per ogni gruppo si calcola l'età media:

```typescript
const res = await dao.user.aggregate(
  {
    by: {
      gender: true
    },
    aggregations: { 
      averageAge: { field: 'age', operation: 'avg' } 
    }
  }
)
```

Come visto in precedenza, i raggruppamenti sono opzionali e se nessun valore viene passato al parametro `by` l'API effettua un unico raggruppamento contenente tutti i record.

## Filtri e ordinamenti

L'API di aggregazione può ricevere, opzionalmente, un parametro `filter` esattamente come tutte le altre API di lettura. Tale filtro limita l'applicazione delle logiche di aggregazione e raggruppamento ad un sottoinsieme dei record determinato dalle condizioni definite.

Oltre a questa possibilità, così come avviene tipicamente sui principali database SQL, Typetta mette a disposizione la possibilità di filtrare e ordinare anche per i campi frutto di raggruppamento o aggregazione. Questo secondo step di elaborazione può essere definito tramite un secondo parametro dell'API `aggregate`.

Di seguito un esempio di interrogazione di tutti gli utenti, raggruppati per sesso, la cui età media è maggiore o ugual di 18 anni, ordinati per età media:

```typescript
const res = await dao.user.aggregate(
  {
    by: {
      gender: true
    },
    aggregations: { 
      averageAge: { field: 'age', operation: 'avg' } 
    }
  }, {
    having: { averageAge: { $gte: 18 } },
    sorts: [{ averageAge: 'asc' }]
  }
)
```