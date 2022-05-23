import { ObjectId } from 'mongodb'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: ObjectId
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: Date
  Email: string
  Password: string
  TenantId: number
  Username: string
}

export type Hotel = {
  __typename?: 'Hotel'
  deletionDate?: Maybe<Scalars['Date']>
  description?: Maybe<Scalars['String']>
  id: Scalars['ID']
  name: Scalars['String']
  tenantId: Scalars['TenantId']
}

export type Reservation = {
  __typename?: 'Reservation'
  deletionDate?: Maybe<Scalars['Date']>
  id: Scalars['ID']
  room?: Maybe<Room>
  roomId: Scalars['ID']
  tenantId: Scalars['TenantId']
  userId: Scalars['ID']
}

export type Room = {
  __typename?: 'Room'
  deletionDate?: Maybe<Scalars['Date']>
  hotel: Hotel
  hotelId: Scalars['ID']
  id: Scalars['ID']
  size: Scalars['String']
  tenantId: Scalars['TenantId']
}

export type Tenant = {
  __typename?: 'Tenant'
  id: Scalars['Int']
  info: Scalars['String']
}

export type User = {
  __typename?: 'User'
  credentials?: Maybe<UsernamePasswordCredentials>
  deletionDate?: Maybe<Scalars['Date']>
  email: Scalars['Email']
  firstName?: Maybe<Scalars['String']>
  id: Scalars['ID']
  lastName?: Maybe<Scalars['String']>
  reservations: Array<Maybe<Reservation>>
  tenantId: Scalars['TenantId']
}

export type UsernamePasswordCredentials = {
  __typename?: 'UsernamePasswordCredentials'
  password: Scalars['Password']
  username: Scalars['Username']
}
