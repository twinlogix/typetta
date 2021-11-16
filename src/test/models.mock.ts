import BigNumber from "bignumber.js";
import { Coordinates } from "@twinlogix/tl-commons";
import { LocalizedString } from "@twinlogix/tl-commons";
export type Maybe<T> = T | null;
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
    Coordinates: Coordinates;
    LocalizedString: LocalizedString;
    Decimal: BigNumber;
};




export type UsernamePasswordCredentials = {
    __typename?: 'UsernamePasswordCredentials';
    username: Scalars['String'];
    password: Scalars['String'];
};

export type City = {
    __typename?: 'City';
    id: Scalars['ID'];
    name: Scalars['String'];
    addressId: Scalars['String'];
    computedName?: Maybe<Scalars['String']>;
    computedAddressName?: Maybe<Scalars['String']>;
};

export type Address = {
    __typename?: 'Address';
    id: Scalars['ID'];
    cities?: Maybe<Array<City>>;
};

export type Organization = {
    __typename?: 'Organization';
    id: Scalars['ID'];
    name: Scalars['String'];
    customerUsersId?: Maybe<Array<Scalars['ID']>>;
    customerUsers?: Maybe<Array<CustomerUser>>;

    vatNumber?: Maybe<Scalars['String']>;
    address?: Maybe<Address>;
    computedName?: Maybe<Scalars['String']>;
};

export type User = {
    id: Scalars['ID'];
    usernamePasswordCredentials?: Maybe<UsernamePasswordCredentials>;
    firstName?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    live: Scalars['Boolean'];
    localization?: Maybe<Scalars['Coordinates']>;
    title?: Maybe<Scalars['LocalizedString']>;
    amounts?: Maybe<Array<Scalars['Decimal']>>;
    amount?: Maybe<Scalars['Decimal']>;
};

export type CustomerUser = User & {
    __typename?: 'CustomerUser';
    id: Scalars['ID'];
    usernamePasswordCredentials?: Maybe<UsernamePasswordCredentials>;
    firstName?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    live: Scalars['Boolean'];
    localization?: Maybe<Scalars['Coordinates']>;
    title?: Maybe<Scalars['LocalizedString']>;
    amounts?: Maybe<Array<Scalars['Decimal']>>;
    amount?: Maybe<Scalars['Decimal']>;
    computedOrgName: Scalars['String'];
    organizationId?: Maybe<Scalars['ID']>;
    organization?: Maybe<Organization>;
};
