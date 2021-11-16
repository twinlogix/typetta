import { createHash } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import LRU from 'lru-cache';

interface IntrospectionResponse {
    data: {
        __schema: {
            queryType?: {
                name: string;
            };
            mutationType?: {
                name: string;
            };
            types: {
                kind: string;
                name: string;
                fields:
                    | {
                    name: string;
                }[]
                    | null;
                inputFields:
                    | {
                    name: string;
                }[]
                    | null;
            }[];
        };
    };
}

export type BlacklistEntry = {
    type: string;
    field: string;
};

export type Blacklist = BlacklistEntry[];

export function withBlacklist(blacklist: Blacklist, response: unknown): IntrospectionResponse {
    const responseTyped = response as IntrospectionResponse;

    return {
        ...responseTyped,
        data: {
            ...responseTyped.data,
            __schema: {
                ...responseTyped.data.__schema,
                types: responseTyped.data.__schema.types.reduce((prev, type) => {
                    if(type.fields) {
                        const fields = type.fields.filter(field => {
                            return !blacklist.find(b => b.type === type.name && b.field === field.name)
                        }) || [];

                        return [
                            ...prev,
                            {
                                ...type,
                                fields,
                            }
                        ];
                    } else {
                        return [...prev, type];
                    }
                }, [] as IntrospectionResponse['data']['__schema']['types']),
            },
        },
    };
}

export function introspectionMiddleware(blacklist: Blacklist)  {
    const cache = new LRU<string, IntrospectionResponse>(10);

    return function blacklistMiddleware(req: Request, res: Response, next: NextFunction) {
        const isIntrospection = req.body.operationName === 'IntrospectionQuery';

        if (!isIntrospection) {
            next();
            return;
        }

        const { send } = res;

        // Prevent infinite recursion
        let sent = false;

        res.send = function sendWithBlacklist(bodyRaw: string): Response {
            if (sent) {
                send.call(this, bodyRaw);
                return res;
            }

            const hash = createHash('sha256').update(JSON.stringify(req.body)).digest('hex');
            const cached = cache.get(hash);

            if (cached !== undefined) {
                sent = true;
                send.call(this, cached);
                return res;
            }

            const body: IntrospectionResponse = JSON.parse(bodyRaw);
            const result = withBlacklist(blacklist, body);

            cache.set(hash, result);
            sent = true;

            send.call(this, result);

            return res;
        };

        next();
    };
}
