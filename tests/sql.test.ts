import BigNumber from 'bignumber.js'
import { Coordinates } from '@twinlogix/tl-commons'
import { LocalizedString } from '@twinlogix/tl-commons'
import {
  AbstractKnexJsDAO,
  DAOParams,
  SortDirection,
  OneKey,
  Schema,
  ArrayOperators,
  ComparisonOperators,
  ElementOperators,
  EvaluationOperators,
  LogicalOperators,
  AbstractDAOContext,
  overrideAssociations,
  DataTypeAdapter,
} from '@twinlogix/typetta'
import knex, { Knex } from 'knex'

type Maybe<T> = T | null

type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Coordinates: Coordinates
  Decimal: BigNumber
  LocalizedString: LocalizedString
  JSON: any
}

type UsernamePasswordCredentials = {
  username: string
  password: string
}

const usernamePasswordCredentialsSchema: Schema<Scalars> = {
  username: { scalar: 'String', required: true },
  password: { scalar: 'String', required: true },
}

type User = {
  __typename?: 'User'
  id: Scalars['ID']
  usernamePasswordCredentials?: Maybe<UsernamePasswordCredentials>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  live: Scalars['Boolean']
  localization?: Maybe<Scalars['Coordinates']>
  title?: Maybe<Scalars['LocalizedString']>
  amount?: Maybe<Scalars['Decimal']>
}

type UserExcludedFields = never

const userSchema: Schema<Scalars> = {
  id: { scalar: 'String', required: true },
  usernamePasswordCredentials: { embedded: usernamePasswordCredentialsSchema },
  firstName: { scalar: 'String' },
  lastName: { scalar: 'String' },
  live: { scalar: 'Boolean', required: true },
  localization: { scalar: 'Coordinates' },
  title: { scalar: 'LocalizedString' },
  amount: { scalar: 'Decimal' },
}

type UserFilterFields = {
  id?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  'usernamePasswordCredentials.username'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  'usernamePasswordCredentials.password'?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  firstName?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  lastName?: string | null | ComparisonOperators<string> | ElementOperators<string> | EvaluationOperators<string>
  live?: boolean | null | ComparisonOperators<boolean> | ElementOperators<boolean> | EvaluationOperators<boolean>
  localization?: Coordinates | null | ComparisonOperators<Coordinates> | ElementOperators<Coordinates> | EvaluationOperators<Coordinates>
  title?: LocalizedString | null | ComparisonOperators<LocalizedString> | ElementOperators<LocalizedString> | EvaluationOperators<LocalizedString>
  amount?: BigNumber | null | ComparisonOperators<BigNumber> | ElementOperators<BigNumber> | EvaluationOperators<BigNumber>
}
export type UserFilter = UserFilterFields & LogicalOperators<UserFilterFields>

export type UserProjection = {
  id?: boolean
  usernamePasswordCredentials?:
    | {
        username?: boolean
        password?: boolean
      }
    | boolean
  firstName?: boolean
  lastName?: boolean
  live?: boolean
  localization?: boolean
  title?: boolean
  amount?: boolean
}

export type UserSortKeys = 'id' | 'usernamePasswordCredentials.username' | 'usernamePasswordCredentials.password' | 'firstName' | 'lastName' | 'live' | 'localization' | 'title' | 'amounts' | 'amount'
export type UserSort = OneKey<UserSortKeys, SortDirection>

export type UserUpdate = {
  id?: string
  usernamePasswordCredentials?: UsernamePasswordCredentials | null
  'usernamePasswordCredentials.username'?: string
  'usernamePasswordCredentials.password'?: string
  firstName?: string | null
  lastName?: string | null
  live?: boolean
  localization?: Coordinates | null
  title?: LocalizedString | null
  amount?: BigNumber | null
}

export interface UserDAOParams extends DAOParams<User, 'id', false, UserFilter, UserProjection, UserUpdate, UserExcludedFields, UserSort, { knex?: any } & { test: string }, Scalars> {}

//@ts-ignore
export class UserDAO extends AbstractKnexJsDAO<User, 'id', false, UserFilter, UserProjection, UserSort, UserUpdate, UserExcludedFields, { knex?: any } & { test: string }, Scalars> {
  public constructor(params: { daoContext: AbstractDAOContext; knex: Knex<any, unknown[]> } & UserDAOParams) {
    super({
      tableName: 'users',
      associations: overrideAssociations([]),
      ...params,
    })
  }
}

export class DAOContext extends AbstractDAOContext {
  public constructor(adapters: Map<any, DataTypeAdapter<any, any, any>>) {
    super(adapters)
  }
}

test('asd', async () => {
  const config: Knex.Config = {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  }

  const createSchema = true
  const knexInstance = knex(config)
  if (createSchema) {
    await knexInstance.schema.createTable('users', (table) => {
      table.string('id').primary()
      table.string('firstName').nullable()
      table.string('lastName').nullable()
      table.boolean('live')
      table.string('localization').nullable()
      table.string('title').nullable()
      table.decimal('amount').nullable()
      table.string('usernamePasswordCredentials').nullable()
    })
  }

  const context = new DAOContext(
    new Map([
      [
        'Coordinates',
        {
          scalar: 'Coordinates',
          dbToModel: (v: string) => JSON.parse(v) as Scalars['Coordinates'],
          modelToDB: (v: Scalars['Coordinates']) => JSON.stringify(v),
        },
      ],
      [
        'Boolean',
        {
          scalar: 'Boolean',
          dbToModel: (v: boolean | number) => (typeof v === 'number' ? v > 0 : v),
          modelToDB: (v: Scalars['Boolean']) => v,
        },
      ],
      [
        'JSON',
        {
          scalar: 'JSON',
          dbToModel: (v: string) => JSON.parse(v),
          modelToDB: (v: Scalars['JSON']) => JSON.stringify(v),
        },
      ],
      [
        'Decimal',
        {
          scalar: 'Decimal',
          dbToModel: (v: any) => {
            return new BigNumber(v)
          },
          modelToDB: (v: Scalars['Decimal']) => v,
        },
      ],
    ]),
  )
  const dao = new UserDAO({ daoContext: context, knex: knexInstance, idField: 'id', schema: userSchema })

  if (createSchema) {
    const ins = await dao.insertOne({
      record: {
        id: '1',
        live: true,
        localization: { latitude: 1.1, longitude: 2.2 },
        amount: new BigNumber(11.11),
        usernamePasswordCredentials: {
          username: 'user',
          password: 'password',
        },
      },
    })
    console.log(ins)
  }
  const all = await dao.findAll({ filter: { id: '1' }, projection: true })
  console.log(all)
})
