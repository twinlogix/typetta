import DataLoader from "dataloader";
import objectHash from 'object-hash';
import { AbstractDAOContext } from "./daoContext";
import { ConditionalPartialBy } from "../utils/utils";
import { PartialDeep } from "type-fest";
import { deepMerge, getTraversing, setTraversing } from '@twinlogix/tl-commons';
import { Projection, ModelProjection, StaticProjection, GenericProjection } from "../utils/types";
import { projection, getProjection, isProjectionIntersected } from "../utils/projection";
import _ from "lodash";

export enum SortDirection { ASC = 1, DESC = -1 }

export type LogicalOperators<FilterType> = {
    $and?: LogicalOperators<FilterType>[] | FilterType[],
    $not?: LogicalOperators<FilterType> | FilterType,
    $nor?: LogicalOperators<FilterType>[] | FilterType[],
    $or?: LogicalOperators<FilterType>[] | FilterType[],
}

export type ComparisonOperators<FieldType> = {
    $eq?: FieldType,
    $gt?: FieldType,
    $gte?: FieldType,
    $in?: FieldType[],
    $lt?: FieldType
    $lte?: FieldType
    $ne?: FieldType
    $nin?: FieldType[],
}

export type ElementOperators<FieldType> = {
    $exists?: Boolean,
    // $type
}

export type EvaluationOperators<FieldType> = {
    // $expr?
    // $jsonSchema
    // $mod
    // $regex
    $text?: {
        $search: String
        $language?: String
        $caseSensitive?: Boolean
        $diacriticSensitive?: Boolean
    }
    // $where
}

export type GeospathialOperators<FieldType> = {
    // $geoIntersect
    // $geoWithin
    $near?: {
        $geometry: {
            type: 'Point',
            coordinates: number[]
        },
        $maxDistance?: number,
        $minDistance: number
    },
    $nearSphere?: {
        $geometry: {
            type: 'Point',
            coordinates: number[]
        },
        $maxDistance?: number,
        $minDistance: number
    }
}

export type ArrayOperators<FieldType> = {
    $all?: FieldType[],
    // $elemMatch
    $size: number
}

export type ReadOptions = {
    secure?: boolean
    _?: any
}

export type ReadFromCacheOptions<ProjectionType> = ReadOptions & {
    onlyFromCache?: boolean
    projections?: ProjectionType
}

export type WriteOptions = {
    secure?: boolean
    _?: any
}

export type ReferenceChecksResponse<T> = true | {
    association: DAOAssociation,
    record: PartialDeep<T>,
    failedReferences: any[]
}[];

export enum DAOAssociationType {
    ONE_TO_ONE,
    ONE_TO_MANY,
}

export enum DAOAssociationReference {
    INNER,
    FOREIGN,
}

export type DAOAssociation = {
    type: DAOAssociationType,
    reference: DAOAssociationReference,
    field: string, //TODO: use recursivekeyof
    refFrom: string,
    refTo: string,
    dao: string,
    buildFilter?: (keys: any[]) => any,
    hasKey?: (record: any, key: any) => boolean
    extractField?: string
};

export type DAOComputedFields<ModelType, P extends true | StaticProjection<ModelType> | undefined | Projection<ModelType>> = {
    fieldsProjection: Projection<ModelType>,
    requiredProjection: P,
    compute: (record: ModelProjection<ModelType, P>) => Promise<PartialDeep<ModelType>>
};

export function projectionDependency<M, P extends StaticProjection<M>>(args: { 
    fieldsProjection : Projection<M>, 
    requiredProjection: P
}) : ReadDAOMiddleware<M, any> {
    return {
      beforeFind: async (filter, projection) => {
        if (isProjectionIntersected(projection ? projection as GenericProjection : true, args.fieldsProjection ? args.fieldsProjection as GenericProjection : true)) {
          return { additiveProjection: args.requiredProjection };
        }
      },
    }
}

export function buildComputedField<M, P extends StaticProjection<M>>(args: { 
    fieldsProjection: Projection<M>, 
    requiredProjection: P, 
    compute:(record: ModelProjection<M, P>) => Promise<PartialDeep<M>>}): 
    ReadDAOMiddleware<M, any> {
    return {
        beforeFind: projectionDependency(args).beforeFind,
        afterFind: async (filter, projection, result) => {
            if (result && isProjectionIntersected(projection ? projection as GenericProjection : true, args.fieldsProjection ? args.fieldsProjection as GenericProjection : true)) {
                return { additiveResult: await args.compute(result as ModelProjection<M, P>) }
            }
        }
    }
}

export type DAOResolver = {
    load: (parents: any[], projections: any) => Promise<any[]>,
    match: (source: any, value: any) => boolean;
};

export type DAOCachingStrategy<ModelType, FilterType> = {
    prefix?: string,
    getKey: (record: ModelType) => string,
    getConditions: (key: string) => FilterType,
    defaultProjections?: Projection<ModelType>,
    defaultTTL?: number,
}

export type DAOSecurityPolicy<ModelType, FilterType, SecurityContext> = {
    secureConditions?: (ctx: SecurityContext | null | undefined, conditions: FilterType) => FilterType,
    secureProjections?: (ctx: SecurityContext | null | undefined, conditions: FilterType, projections?: Projection<ModelType>) => Projection<ModelType> | undefined,
    secureRecords?: (ctx: SecurityContext | null | undefined, records: ModelType[], conditions?: FilterType, projections?: Projection<ModelType>) => ModelType[],
}

export interface ReadDAO<DBRef, DBObj, ModelType, IDKey extends keyof ModelType, FilterType, SortType> {
    find<P extends true | StaticProjection<ModelType> | undefined | Projection<ModelType> = true>(conditions: FilterType, projections?: P, sorts?: SortType, start?: number, limit?: number, options?: ReadOptions): Promise<ModelProjection<ModelType, P>[]>;
    findOne<P  extends true | StaticProjection<ModelType> | undefined | Projection<ModelType> = true>(conditions: FilterType, projections?: P, options?: ReadOptions): Promise<ModelProjection<ModelType, P> | null>;
    findPage(conditions: FilterType, projections?: Projection<ModelType>, sorts?: SortType, start?: number, limit?: number, options?: ReadOptions): Promise<{ totalCount: number, records: ModelType[] }>;
    findByQuery(query: (dbRef: DBRef, dbProjections: any, dbSorts?: any, start?: number, limit?: number, options?: any) => Promise<DBObj[]>, projections?: Projection<ModelType>, options?: ReadOptions): Promise<ModelType[]>;
    load(keys: any[], buildFilter: (keys: any[]) => FilterType, hasKey: (record: ModelType, key: any) => boolean, projections?: Projection<ModelType>, loaderIdetifier?: string, options?: ReadOptions): Promise<(ModelType | null | Error)[]>;
    checkReferences(records: PartialDeep<ModelType> | PartialDeep<ModelType>[], options?: ReadOptions): Promise<ReferenceChecksResponse<ModelType>>
    exists(conditions: FilterType, options?: ReadOptions): Promise<boolean>;
    count(conditions: FilterType, options?: ReadOptions): Promise<number>;
    findFromCache(key: string, options?: ReadFromCacheOptions<Projection<ModelType>>): Promise<ModelType | null>;
    deleteCache(key: string): Promise<void>;
}

export interface SuperClassDAO<DBRef, DBObj, ModelType, IDKey extends keyof ModelType, FilterType, SortType, UpdateType> extends ReadDAO<DBRef, DBObj, ModelType, IDKey, FilterType, SortType> {
    update<T extends Pick<ModelType, IDKey>>(record: T, changes: UpdateType, options?: WriteOptions): Promise<void>;
    updateOne(filter: FilterType, changes: UpdateType, options?: WriteOptions): Promise<void>;
    updateMany(filter: FilterType, changes: UpdateType, options?: WriteOptions): Promise<void>;
    delete<T extends Pick<ModelType, IDKey>>(record: T, options?: WriteOptions): Promise<void>;
    deleteOne(filter: FilterType, options?: WriteOptions): Promise<void>;
    deleteMany(filter: FilterType, options?: WriteOptions): Promise<void>;
}

export interface DAO<DBRef, DBObj, ModelType, IDKey extends keyof Omit<ModelType, ExcludedFields>, IDAutogenerated extends boolean, FilterType, SortType, UpdateType, ExcludedFields extends keyof ModelType> extends ReadDAO<DBRef, DBObj, ModelType, IDKey, FilterType, SortType> {
    insert(record: ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated>, options?: WriteOptions): Promise<ModelType>;
    update<T extends Pick<ModelType, IDKey>>(record: T, changes: UpdateType, options?: WriteOptions): Promise<void>;
    updateOne(filter: FilterType, changes: UpdateType, options?: WriteOptions): Promise<void>;
    updateMany(filter: FilterType, changes: UpdateType, options?: WriteOptions): Promise<void>;
    replace<T extends Pick<ModelType, IDKey>>(from: T, to: Omit<ModelType, ExcludedFields>, options?: WriteOptions): Promise<void>;
    replaceOne(filter: FilterType, to: Omit<ModelType, ExcludedFields>, options?: WriteOptions): Promise<void>;
    delete<T extends Pick<ModelType, IDKey>>(record: T, options?: WriteOptions): Promise<void>;
    deleteOne(filter: FilterType, options?: WriteOptions): Promise<void>;
    deleteMany(filter: FilterType, options?: WriteOptions): Promise<void>;
}

export type ReadDAOMiddleware<ModelType, FilterType> = {
    beforeFind?: (filter: Readonly<FilterType> | undefined | null, projection: Readonly<Projection<ModelType>> | undefined | null) => Promise<void | { error: Error } | { additiveProjection: Projection<ModelType> }>;
    afterFind?: (filter: Readonly<FilterType> | undefined | null, projection: Readonly<Projection<ModelType>> | undefined | null, result: Readonly<PartialDeep<ModelType>> | null) => Promise<void | { additiveResult: PartialDeep<ModelType> }>;
}

export type WriteDAOMiddleware<ModelType, IDKey extends keyof Omit<ModelType, ExcludedFields>, IDAutogenerated extends boolean, FilterType, UpdateType, ExcludedFields extends keyof ModelType> = {
    beforeInsert?: (record: Readonly<ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated>>) => Promise<void | { error: Error } | { record: ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated> }>;
    afterInsert?: (record: Readonly<ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated>>, result: Readonly<ModelType>) => Promise<void>;

    beforeUpdate?: (filter: Readonly<FilterType>, changes: Readonly<UpdateType>) => Promise<void | { cancel: boolean, error?: Error } | { changes: UpdateType }>;
    afterUpdate?: (filter: Readonly<FilterType>, changes: Readonly<UpdateType>) => Promise<void>;

    beforeReplace?: (filter: Readonly<FilterType>, to: Readonly<Omit<ModelType, ExcludedFields>>) => Promise<void | { cancel: boolean, error?: Error } | { to: Omit<ModelType, ExcludedFields> }>;
    afterReplace?: (filter: Readonly<FilterType>, to: Readonly<Omit<ModelType, ExcludedFields>>) => Promise<void>;

    beforeDelete?: (filter: Readonly<FilterType>) => Promise<void | { cancel: boolean, error?: Error }>;
    afterDelete?: (filter: Readonly<FilterType>) => Promise<void>;
}

export interface DAOParams<ModelType, IDKey extends keyof Omit<ModelType, ExcludedFields>, IDAutogenerated extends boolean, FilterType, UpdateType, ExcludedFields extends keyof ModelType, SecurityContext> {
    pageSize?: number;
    associations?: DAOAssociation[];
    middlewares?: (WriteDAOMiddleware<ModelType, IDKey, IDAutogenerated, FilterType, UpdateType, ExcludedFields> | ReadDAOMiddleware<ModelType, FilterType>)[];
    cachingStrategy?: DAOCachingStrategy<ModelType, FilterType>;
    securityPolicy?: DAOSecurityPolicy<ModelType, FilterType, SecurityContext>;
}

export abstract class AbstractReadDAO<DBRef, DBObj, ModelType, IDKey extends keyof Omit<ModelType, ExcludedFields>, FilterType, SortType, ExcludedFields extends keyof ModelType, SecurityContext = any> implements ReadDAO<DBRef, DBObj, ModelType, IDKey, FilterType, SortType> {

    protected idField: IDKey;
    protected daoContext: AbstractDAOContext<SecurityContext>;
    protected associations: DAOAssociation[];
    protected rMiddlewares: ReadDAOMiddleware<ModelType, FilterType>[]
    protected pageSize: number;
    protected resolvers: any;
    protected dataLoaders: Map<string, DataLoader<ModelType[IDKey], ModelType[] | null>>;
    protected cachingStrategy: DAOCachingStrategy<ModelType, FilterType>;
    protected securityPolicy?: DAOSecurityPolicy<ModelType, FilterType, SecurityContext>;

    protected constructor({
        idField,
        daoContext,
        pageSize = 50,
        associations = [],
        middlewares: middleware = [],
        cachingStrategy = { getKey: (m: ModelType) => "" + m[this.idField], getConditions: (key: string) => { return { [this.idField]: key } as any; } },
        securityPolicy
    }: { idField: IDKey, daoContext: AbstractDAOContext<SecurityContext> } & DAOParams<ModelType, IDKey, boolean, FilterType, any, ExcludedFields, SecurityContext>) {

        this.dataLoaders = new Map<string, DataLoader<ModelType[IDKey], ModelType[]>>();

        this.idField = idField;
        this.daoContext = daoContext;
        this.pageSize = pageSize;

        this.resolvers = {};
        this.associations = associations;
        this.associations.forEach(association => this.addResolver(association))

        this.rMiddlewares = middleware.flatMap(m => 'beforeFind' in m || 'afterFind' in m ? [m] : [])
        this.cachingStrategy = cachingStrategy;
        this.securityPolicy = securityPolicy;
    }

    protected elabConditions(conditions: FilterType, secure?: boolean): FilterType {
        return this.applySecurityOnConditions(conditions, secure);
    }

    protected async elabProjections(conditions: FilterType, projections?: Projection<ModelType>, secure?: boolean): Promise<Projection<ModelType> | undefined> {
        const newProjections = await this.beforeFind(conditions, projections ?? true)
        return this.applySecurityOnProjections(conditions, newProjections, secure);
    }

    protected async elabRecords(records: ModelType[], conditions?: FilterType, projections?: Projection<ModelType>, secure?: boolean): Promise<ModelType[]> {
        for(let i = 0; i < records.length; i++) {
            records[i] = (await this.afterFind(conditions, projections, records[i]))!
        }
        return this.applySecurityOnRecords(records, conditions, projections, secure);
    }

    protected async elabRecord(record: ModelType | null, conditions?: FilterType, projections?: Projection<ModelType>, secure?: boolean): Promise<ModelType | null> {
        return this.applySecurityOnRecord(await this.afterFind(conditions, projections, record), conditions, projections, secure);
    }

    private async beforeFind(filter: FilterType | undefined | null, proj: Projection<ModelType>): Promise<Projection<ModelType>> {
        for(const middleware of this.rMiddlewares) {
            if(middleware.beforeFind) {
                const res = await middleware.beforeFind(filter, proj as Readonly<Projection<ModelType>>);
                if(res && 'error' in res) {
                    throw res.error
                } else if(res && 'additiveProjection' in res) {
                    proj = projection<ModelType>().merge(proj, res.additiveProjection) 
                }
            }
        }
        return proj
    }

    private async afterFind(filter: FilterType | undefined | null, proj: Projection<ModelType> | undefined | null, result: ModelType | null): Promise<ModelType | null> {
        for(const middleware of this.rMiddlewares) {
            if(middleware.afterFind) {
                const res = await middleware.afterFind(filter as Readonly<FilterType>, proj as Readonly<Projection<ModelType>>, result as Readonly<PartialDeep<ModelType>>)
                if(res) {
                    result = deepMerge(result, res.additiveResult)
                }
            }
        }
        return result
    }

    async find<P extends true | StaticProjection<ModelType> | undefined | Projection<ModelType> = true>(conditions: FilterType, projections?: P, sorts?: SortType, start?: number, limit?: number, options?: ReadOptions): Promise<ModelProjection<ModelType, P>[]> {
        return (await this.elabRecords(await this._find(this.elabConditions(conditions, options?.secure), await this.elabProjections(conditions, projections, options?.secure), sorts, start, limit, options), conditions, projections, options?.secure)) as ModelProjection<ModelType, P>[]
    }

    async findOne<P extends true | StaticProjection<ModelType> | undefined | Projection<ModelType>  = true>(conditions: FilterType, projections?: P, options?: ReadOptions): Promise<ModelProjection<ModelType, P> | null> {
        return (await this.elabRecord(await this._findOne(this.elabConditions(conditions, options?.secure), await this.elabProjections(conditions, projections, options?.secure), options), conditions, projections, options?.secure)) as ModelProjection<ModelType, P>
    }

    async findByQuery(query: (dbRef: DBRef, dbProjections: any, dbSorts?: any, start?: number, limit?: number, options?: any) => Promise<DBObj[]>, projections?: Projection<ModelType>, sorts?: SortType, start?: number, limit?: number, options?: ReadOptions): Promise<ModelType[]> {
        return this.elabRecords(await this._findByQuery(query, projections, sorts, start, limit, options));
    }

    async findPage(conditions: FilterType, projections?: Projection<ModelType>, sorts?: SortType, start?: number, limit?: number, options?: ReadOptions): Promise<{ totalCount: number, records: ModelType[] }> {
        const page = await this._findPage(this.elabConditions(conditions, options?.secure), await this.elabProjections(conditions, projections, options?.secure), sorts, start, limit, options);
        page.records = await this.elabRecords(page.records, conditions, projections, options?.secure);
        return page;
    }

    async exists(conditions: FilterType, options?: ReadOptions): Promise<boolean> {
        return this._exists(this.elabConditions(conditions, options?.secure), options);
    }

    async count(conditions: FilterType, options?: ReadOptions): Promise<number> {
        return this._count(this.elabConditions(conditions, options?.secure), options);
    }

    // -----------------------------------------------------------------------
    // ------------------------------ ABSTRACTS ------------------------------
    // -----------------------------------------------------------------------
    protected abstract _find(conditions: FilterType, projections?: Projection<ModelType>, sorts?: SortType, start?: number, limit?: number, options?: ReadOptions): Promise<ModelType[]>;

    protected abstract _findOne(conditions: FilterType, projections?: Projection<ModelType>, options?: ReadOptions): Promise<ModelType | null>;

    protected abstract _findPage(conditions: FilterType, projections?: Projection<ModelType>, sorts?: SortType, start?: number, limit?: number, options?: ReadOptions): Promise<{ totalCount: number, records: ModelType[] }>;

    protected abstract _findByQuery(query: (dbRef: DBRef, dbProjections: any) => Promise<DBObj[]>, projections?: Projection<ModelType>, sorts?: SortType, start?: number, limit?: number, options?: ReadOptions): Promise<ModelType[]>;

    protected abstract _exists(conditions: FilterType, options?: ReadOptions): Promise<boolean>;

    protected abstract _count(conditions: FilterType, options?: ReadOptions): Promise<number>;

    async checkReferences(records: PartialDeep<ModelType> | PartialDeep<ModelType>[], options?: ReadOptions): Promise<ReferenceChecksResponse<ModelType>> {
        const errors = [];
        if (records) {
            const inputRecords = records instanceof Array ? records : [records];
            for (const association of this.associations) {
                if (association.reference === DAOAssociationReference.INNER) {
                    const associationProjection = {};
                    setTraversing(associationProjection, association.refTo, true);
                    const resolver: DAOResolver = getTraversing(this.resolvers, association.field)[0];

                    const associationFieldPathSplitted = association.field.split('.');
                    associationFieldPathSplitted.pop();
                    const parentPath = associationFieldPathSplitted.join('.');
                    const parents = getTraversing(inputRecords, parentPath);
                    const associatedRecords = await resolver.load(parents, associationProjection);

                    for (const inputRecord of inputRecords) {
                        const notFoundRefsFrom = getTraversing(inputRecord, association.refFrom)
                            .filter(refFrom => {
                                return !associatedRecords.find(associatedRecord =>
                                    associatedRecord && getTraversing(associatedRecord, association.refTo).length > 0 &&
                                    refFrom === getTraversing(associatedRecord, association.refTo)[0]
                                )
                            });
                        if (notFoundRefsFrom.length > 0) {
                            errors.push({ association, record: inputRecord, failedReferences: notFoundRefsFrom });
                        }
                    }
                }
            }
        }
        if (errors.length > 0) {
            return errors;
        } else {
            return true;
        }
    }

    // -----------------------------------------------------------------------
    // ---------------------------- ASSOCIATIONS -----------------------------
    // -----------------------------------------------------------------------
    async load(keys: any[], buildFilter: (keys: any[]) => FilterType, hasKey: (record: ModelType, key: any) => boolean, projections: Projection<ModelType>, loaderIdetifier: string = '', options?: ReadOptions): Promise<(ModelType | null | Error)[]> {
        const dataLoader = this.getDataLoader(buildFilter, hasKey, projections, loaderIdetifier);
        const loadedResults = (await dataLoader.loadMany(keys));
        const results = [];
        for (const loadedResult of loadedResults) {
            if (loadedResult instanceof Error) {
                throw loadedResult;
            } else if (loadedResult !== null) {
                results.push(...loadedResult);
            }
        }
        return this.elabRecords(results, undefined, projections, options?.secure);
    }

    protected getDataLoader(buildFilter: (keys: any[]) => FilterType, hasKey: (record: ModelType, key: any) => boolean, projections: Projection<ModelType>, loaderIdetifier: string): DataLoader<any, ModelType[] | null> {
        const hash = loaderIdetifier + '-' + objectHash(projections || null, { respectType: false, unorderedArrays: true });
        const dataLoader = this.dataLoaders.get(hash);
        if (dataLoader) {
            return dataLoader;
        } else {
            const newDataLoader = new DataLoader<any, ModelType[] | null>(
                async keys => {
                    const filter = buildFilter(keys as ModelType[IDKey][]);
                    const loadedResults: any[] = await this.find(filter, projections);
                    const orderedResults = [];
                    for (const key of keys) {
                        orderedResults.push(loadedResults.filter(loadedResult => hasKey(loadedResult, key)) || null);
                    }
                    return orderedResults;
                },
                {
                    maxBatchSize: this.pageSize
                }
            );
            this.dataLoaders.set(hash, newDataLoader)
            return newDataLoader;
        }
    }

    protected async resolveAssociations(dbObjects: any[], projections?: Projection<ModelType>): Promise<ModelType[]> {
        for (const association of this.associations) {
            if (projections) {
                let associationProjection = getProjection(projections as GenericProjection, association.field);
                if (associationProjection && projections !== true) {
                    if (associationProjection !== true) {
                        if (association.reference === DAOAssociationReference.INNER) {
                            setTraversing(associationProjection, association.refTo, true);
                        } else if (association.reference === DAOAssociationReference.FOREIGN) {
                            setTraversing(associationProjection, association.refFrom, true);
                        }
                    }
                    const resolver: DAOResolver = getTraversing(this.resolvers, association.field)[0];

                    const associationFieldPathSplitted = association.field.split('.');
                    const associationField = associationFieldPathSplitted.pop();
                    if (associationField) {
                        const parentPath = associationFieldPathSplitted.join('.');
                        const parents = getTraversing(dbObjects.filter(dbObject => dbObject != null), parentPath);
                        const associatedRecords = await resolver.load(parents, associationProjection);
                        parents.forEach(parent => {
                            if (association.type === DAOAssociationType.ONE_TO_ONE) {
                                parent[associationField] = associatedRecords.find((value) => {
                                    return resolver.match(parent, value)
                                }) || null;
                            } else if (association.type === DAOAssociationType.ONE_TO_MANY) {
                                parent[associationField] = associatedRecords.filter((value) => {
                                    return resolver.match(parent, value)
                                }) || null;
                            }
                        })
                    }
                }
            }
        }
        return dbObjects;
    }

    protected addResolver(association: DAOAssociation) {
        let resolver;

        if (association.reference === DAOAssociationReference.INNER) {
            const refFrom = association.refFrom.split('.').pop();
            const refTo = association.refTo;
            const linkedDAO = association.dao;
            if (refFrom) {
                if (association.type === DAOAssociationType.ONE_TO_ONE) {
                    resolver = {
                        load: async (parents: any[], projections: any) => {
                            const ids = parents.map(parent => parent[refFrom])
                                .filter((value, index, self) => (value !== null && value !== undefined && self.indexOf(value) === index));

                            return this.daoContext.dao(linkedDAO).load(
                                ids,
                                association.buildFilter || ((keys: any[]): FilterType => {
                                    // @ts-ignore
                                    return { [refTo]: { $in: keys } };
                                }),
                                association.hasKey || ((record: ModelType, key: any): boolean => {
                                    return (record as any)[refTo] === key
                                }),
                                projections,
                                refTo
                            );
                        },
                        match: (source: any, value: any): boolean => {
                            return source[refFrom] === value[refTo];
                        }
                    };
                } else if (association.type === DAOAssociationType.ONE_TO_MANY) {
                    resolver = {
                        load: async (parents: any[], projections: any) => {
                            const ids = parents.map(parent => parent[refFrom])
                                .filter(value => value !== null && value !== undefined)
                                .reduce((a, c) => [...a, ...c], [])
                                .filter((value: any[], index: number, self: any) => self.indexOf(value) === index);

                            return this.daoContext.dao(linkedDAO).load(
                                ids,
                                association.buildFilter || ((keys: any[]): FilterType => {
                                    // @ts-ignore
                                    return { [refTo]: { $in: keys } };
                                }),
                                association.hasKey || ((record: ModelType, key: any): boolean => {
                                    return (record as any)[refTo] === key
                                }),
                                projections,
                                refTo
                            );
                        },
                        match: (source: any, value: any): boolean => {
                            return source[refFrom] && source[refFrom].includes(value[refTo]);
                        }
                    };
                }
            }
        } else if (association.reference === DAOAssociationReference.FOREIGN) {
            const refFrom = association.refFrom;
            const refTo = association.refTo.split('.').pop();
            const linkedDAO = association.dao;
            if (refTo) {
                resolver = {
                    load: async (parents: any[], projections: any) => {
                        const ids = parents.map(parent => parent[refTo])
                            .filter((value, index, self) => (value !== null && value !== undefined && self.indexOf(value) === index));

                        return this.daoContext.dao(linkedDAO).load(
                            ids,
                            association.buildFilter || ((keys: any[]): FilterType => {
                                // @ts-ignore
                                return { [refFrom]: { $in: keys } };
                            }),
                            association.hasKey || ((record: ModelType, key: any): boolean => {
                                return (record as any)[refFrom] === key
                            }),
                            projections,
                            refFrom
                        );
                    },
                    match: (source: any, value: any): boolean => {
                        const tmp = getTraversing(value, refFrom);
                        return tmp.includes(source[refTo]);
                    }
                };
            }
        }
        setTraversing(this.resolvers, association.field, resolver);
    }

    // -----------------------------------------------------------------------
    // ------------------------------- CACHE ---------------------------------
    // -----------------------------------------------------------------------
    async findFromCache(key: string, options?: ReadFromCacheOptions<Projection<ModelType>>): Promise<ModelType | null> {
        if (this.daoContext.cache()) {
            let record = await (this.daoContext.cache()!.fromCache((this.cachingStrategy.prefix || "") + key)) as ModelType | null;
            if (!record && !(options?.onlyFromCache)) {
                record = await this._findOne(this.cachingStrategy.getConditions(key), options?.projections || this.cachingStrategy.defaultProjections, options);
                if (record) {
                    await (this.daoContext.cache()!.toCache((this.cachingStrategy.prefix || "") + this.cachingStrategy.getKey(record), record, this.cachingStrategy.defaultTTL));
                }
            }
            return this.elabRecord(record);
        } else {
            throw new Error("No cache found in current context.");
        }
    }

    async deleteCache(key: string): Promise<void> {
        if (this.daoContext.cache()) {
            await (this.daoContext.cache()!.deleteCache((this.cachingStrategy.prefix || "") + key));
        }
    }

    // -----------------------------------------------------------------------
    // ------------------------------- SECURITY ------------------------------
    // -----------------------------------------------------------------------
    protected applySecurityOnConditions(conditions: FilterType, secure?: boolean): FilterType {
        if (!secure && this.securityPolicy && this.securityPolicy.secureConditions) {
            return this.securityPolicy.secureConditions(this.daoContext.securityContext(), conditions);
        } else {
            return conditions;
        }
    }

    protected applySecurityOnProjections(conditions: FilterType, projections?: Projection<ModelType>, secure?: boolean): Projection<ModelType> | undefined {
        if (!secure && this.securityPolicy && this.securityPolicy.secureProjections) {
            return this.securityPolicy.secureProjections(this.daoContext.securityContext(), conditions, projections);
        } else {
            return projections;
        }
    }

    protected applySecurityOnRecords(records: ModelType[], conditions?: FilterType, projections?: Projection<ModelType>, secure?: boolean): ModelType[] {
        if (!secure && this.securityPolicy && this.securityPolicy.secureRecords && records) {
            return this.securityPolicy.secureRecords(this.daoContext.securityContext(), records, conditions, projections);
        } else {
            return records;
        }
    }

    protected applySecurityOnRecord(record: ModelType | null, conditions?: FilterType, projections?: Projection<ModelType>, secure?: boolean): ModelType | null {
        if (!secure && this.securityPolicy && this.securityPolicy.secureRecords && record) {
            return this.securityPolicy.secureRecords(this.daoContext.securityContext(), [record], conditions, projections)![0];
        } else {
            return record;
        }
    }

}

export abstract class AbstractDAO<DBRef, DBObj, ModelType, IDKey extends keyof Omit<ModelType, ExcludedFields>, IDAutogenerated extends boolean, FilterType, SortType, UpdateType, ExcludedFields extends keyof ModelType, SecurityContext> extends AbstractReadDAO<DBRef, DBObj, ModelType, IDKey, FilterType, SortType, ExcludedFields, SecurityContext> implements DAO<DBRef, DBObj, ModelType, IDKey, IDAutogenerated, FilterType, SortType, UpdateType, ExcludedFields> {

    private wMiddlewares: WriteDAOMiddleware<ModelType, IDKey, IDAutogenerated, FilterType, UpdateType, ExcludedFields>[]
    protected constructor(params: { idField: IDKey, daoContext: AbstractDAOContext<SecurityContext> } & DAOParams<ModelType, IDKey, IDAutogenerated, FilterType, UpdateType, ExcludedFields, SecurityContext>) {
        super(params);
        this.wMiddlewares = params.middlewares?.flatMap(m => 
            'beforeInsert' in m || 'beforeUpdate' in m || 'beforeReplace' in m || 'beforeDelete' in m ||
            'afterInsert' in m || 'afterUpdate' in m || 'afterReplace' in m || 'afterDelete' in m ? [m] : []) ?? []
    }

    protected idFilter<T extends Pick<ModelType, IDKey>>(model: T): FilterType {
        return { [this.idField]: model[this.idField] } as unknown as FilterType;
    }

    private async beforeInsert(record: ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated>): Promise<ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated>> {
        for(const middleware of this.wMiddlewares) {
            if(middleware.beforeInsert) {
                //TODO: why readonly not compiling?
                //@ts-ignore
                const res = await middleware.beforeInsert(record);
                if(res && 'error' in res) {
                    throw res.error
                } else if(res && 'record' in res) {
                    record = res.record
                }
            }
        }
        return record
    }

    private async afterInsert(record: ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated>, result: ModelType) {
        for(const middleware of this.wMiddlewares) {
            if(middleware.afterInsert) {
                //TODO: why readonly not compiling?
                //@ts-ignore
                await middleware.afterInsert(record, result)
            }
        }
    }

    async insert(record: ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated>, options?: WriteOptions): Promise<ModelType> {
        const newRecord = await this.beforeInsert(record);
        const result = await this._insert(newRecord, options);
        await this.afterInsert(newRecord, result)
        return result
    }

    private async beforeUpdate(filter: FilterType, changes: UpdateType): Promise<UpdateType | null> {
        for(const middleware of this.wMiddlewares) {
            if(middleware.beforeUpdate) {
                const res = await middleware.beforeUpdate(filter, changes);
                if(res && 'cancel' in res && res.cancel) {
                    if(res.error) {
                        throw res.error
                    } else {
                        return null
                    }
                } else if(res && 'changes' in res) {
                    changes = res.changes
                }
            }
        }
        return changes
    }

    private async afterUpdate(filter: FilterType, changes: UpdateType) {
        for(const middleware of this.wMiddlewares) {
            if(middleware.afterUpdate) {
                await middleware.afterUpdate(filter, changes);
            }
        }
    }

    async update<T extends Pick<ModelType, IDKey>>(record: T, changes: UpdateType, options?: WriteOptions): Promise<void> {
        const filter = this.idFilter(record)
        const newChanges = await this.beforeUpdate(filter, changes);
        if(newChanges) {
            await this._updateOne(this.elabConditions(filter, options?.secure), newChanges, (options || {})._);
            await this.afterUpdate(filter, newChanges);
        }
    }

    async updateOne(conditions: FilterType, changes: UpdateType, options?: WriteOptions): Promise<void> {
        const newChanges = await this.beforeUpdate(conditions, changes);
        if(newChanges) {
            await this._updateOne(this.elabConditions(conditions, options?.secure), newChanges, options);
            await this.afterUpdate(conditions, newChanges);
        }
    }

    async updateMany(conditions: FilterType, changes: UpdateType, options?: WriteOptions): Promise<void> {
        const newChanges = await this.beforeUpdate(conditions, changes);
        if(newChanges) {
            await this._updateMany(this.elabConditions(conditions, options?.secure), newChanges, options);
            await this.afterUpdate(conditions, newChanges);
        }
    }

    private async beforeReplace(filter: FilterType, to: Omit<ModelType, ExcludedFields>): Promise<Omit<ModelType, ExcludedFields> | null> {
        for(const middleware of this.wMiddlewares) {
            if(middleware.beforeReplace) {
                const res = await middleware.beforeReplace(filter, to);
                if(res && 'cancel' in res && res.cancel) {
                    if(res.error) {
                        throw res.error
                    } else {
                        return null
                    }
                } else if (res && 'to' in res) {
                    to = res.to
                }
            }
        }
        return to
    }

    private async afterReplace(filter: FilterType, to: Omit<ModelType, ExcludedFields>) {
        for(const middleware of this.wMiddlewares) {
            if(middleware.afterReplace) {
                await middleware.afterReplace(filter, to);
            }
        }
    }

    async replace<T extends Pick<ModelType, IDKey>>(from: T, to: Omit<ModelType, ExcludedFields>, options?: WriteOptions): Promise<void> {
        const filter = this.idFilter(from)
        const newTo = await this.beforeReplace(filter, to);
        if(newTo) {
            await this._replaceOne(this.elabConditions(filter, options?.secure), newTo, options);
            await this.afterReplace(filter, newTo);
        }
    }

    async replaceOne(conditions: FilterType, to: Omit<ModelType, ExcludedFields>, options?: WriteOptions): Promise<void> {
        const newTo = await this.beforeReplace(conditions, to);
        if(newTo) {
            await this._replaceOne(this.elabConditions(conditions, options?.secure), newTo, options);
            await this.afterReplace(conditions, newTo);
        }
    }

    private async beforeDelete(filter: FilterType): Promise<true | null> {
        for(const middleware of this.wMiddlewares) {
            if(middleware.beforeDelete) {
                const res = await middleware.beforeDelete(filter);
                if(res && res.cancel) {
                    if(res.error) {
                        throw res.error
                    } else {
                        return null
                    }
                }
            }
        }
        return true
    }

    private async afterDelete(filter: FilterType) {
        for(const middleware of this.wMiddlewares) {
            if(middleware.afterDelete) {
                await middleware.afterDelete(filter);
            }
        }
    }

    async delete<T extends Pick<ModelType, IDKey>>(record: T, options?: WriteOptions): Promise<void> {
        const filter = this.idFilter(record)
        const procede = await this.beforeDelete(filter);
        if(procede) {
            await this._deleteOne(this.elabConditions(filter, options?.secure), options);
            await this.afterDelete(filter);
        }
    }

    async deleteOne(conditions: FilterType, options?: WriteOptions): Promise<void> {
        const procede = await this.beforeDelete(conditions);
        if(procede) {
            await this._deleteOne(this.elabConditions(conditions, options?.secure), options);
            await this.afterDelete(conditions);
        }
    }

    async deleteMany(conditions: FilterType, options?: WriteOptions): Promise<void> {
        const procede = await this.beforeDelete(conditions);
        if(procede) {
            await this._deleteMany(this.elabConditions(conditions, options?.secure), options);
            await this.afterDelete(conditions);
        }
    }

    // -----------------------------------------------------------------------
    // ------------------------------ ABSTRACTS ------------------------------
    // -----------------------------------------------------------------------
    protected abstract _insert(record: ConditionalPartialBy<Omit<ModelType, ExcludedFields>, IDKey, IDAutogenerated>, options?: WriteOptions): Promise<ModelType>;
    protected abstract _updateOne(filter: FilterType, changes: UpdateType, options?: WriteOptions): Promise<void>;
    protected abstract _updateMany(filter: FilterType, changes: UpdateType, options?: WriteOptions): Promise<void>;
    protected abstract _replaceOne(filter: FilterType, to: Omit<ModelType, ExcludedFields>, options?: WriteOptions): Promise<void>;
    protected abstract _deleteOne(filter: FilterType, options?: WriteOptions): Promise<void>;
    protected abstract _deleteMany(filter: FilterType, options?: WriteOptions): Promise<void>;

}
