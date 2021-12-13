import BigNumber from "bignumber.js";
import {Coordinates} from "@twinlogix/tl-commons";
import {LocalizedString} from "@twinlogix/tl-commons";
import { ObjectId } from "mongodb"
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
  Decimal: BigNumber;
  IntAutoInc: number;
  JSON: any;
  MongoID: ObjectId;
};

export type A = {
  __typename?: 'A';
  id: Scalars['MongoID'];
  value: Scalars['Int'];
};

export type B = {
  __typename?: 'B';
  id: Scalars['ID'];
  value: Scalars['Int'];
};

export type C = {
  __typename?: 'C';
  id: Scalars['ID'];
  value: Scalars['Int'];
};

export type D = {
  __typename?: 'D';
  id: Scalars['IntAutoInc'];
  value: Scalars['Int'];
};

export type E = {
  __typename?: 'E';
  id: Scalars['ID'];
  value: Scalars['Int'];
};

export type F = {
  __typename?: 'F';
  id: Scalars['ID'];
  value: Scalars['Int'];
};
