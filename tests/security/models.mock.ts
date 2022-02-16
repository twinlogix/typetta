export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  Email: string;
  Password: string;
  Username: string;
};

export type Hotel = {
  __typename?: 'Hotel';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  tenantId: Scalars['Int'];
  totalCustomers: Scalars['Int'];
};

export const Permission = {
  ANALYST: 'ANALYST',
  MANAGE_HOTEL: 'MANAGE_HOTEL',
  MANAGE_RESERVATION: 'MANAGE_RESERVATION',
  MANAGE_ROOM: 'MANAGE_ROOM',
  MANAGE_USER: 'MANAGE_USER',
  ONLY_ID: 'ONLY_ID',
  READONLY_RESERVATION: 'READONLY_RESERVATION',
  READONLY_ROOM: 'READONLY_ROOM',
  VIEW_HOTEL: 'VIEW_HOTEL'
} as const;

export type Permission = typeof Permission[keyof typeof Permission];
export type Reservation = {
  __typename?: 'Reservation';
  hotelId: Scalars['ID'];
  id: Scalars['ID'];
  room?: Maybe<Room>;
  roomId: Scalars['ID'];
  tenantId: Scalars['Int'];
  userId: Scalars['ID'];
};

export type Role = {
  __typename?: 'Role';
  code: RoleCode;
  permissions: Array<Maybe<Permission>>;
};

export const RoleCode = {
  ANALYST: 'ANALYST',
  HOTEL_OWNER: 'HOTEL_OWNER',
  HOTEL_VIEWER: 'HOTEL_VIEWER',
  IS_USER: 'IS_USER',
  ONLY_ID: 'ONLY_ID',
  SUPERADMIN: 'SUPERADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN'
} as const;

export type RoleCode = typeof RoleCode[keyof typeof RoleCode];
export type Room = {
  __typename?: 'Room';
  description: Scalars['String'];
  from: Scalars['Date'];
  hotel: Hotel;
  hotelId: Scalars['ID'];
  id: Scalars['ID'];
  tenantId: Scalars['Int'];
  to: Scalars['Date'];
};

export type Room2 = {
  __typename?: 'Room2';
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['Email'];
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  reservations: Array<Maybe<Reservation>>;
  roles: Array<UserRole>;
  totalPayments?: Maybe<Scalars['Int']>;
};

export type UserRole = {
  __typename?: 'UserRole';
  hotelId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  refUserId: Scalars['ID'];
  role: Role;
  roleCode: RoleCode;
  tenantId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['ID']>;
};
