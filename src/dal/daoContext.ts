import { DAOCache } from "./cache";
import { DAO, ReadDAO } from './dao';

type SecurityContextGenerator<SecurityContext> = () => SecurityContext;

function isSecurityContextGenerator<T>(sc: T | SecurityContextGenerator<T>): sc is SecurityContextGenerator<T> {
    return typeof sc === 'function';
}

export abstract class AbstractDAOContext<SecurityContext> {

    protected theCache?: DAOCache;
    protected theSecurityContext?: SecurityContext | SecurityContextGenerator<SecurityContext>;

    constructor(options?: { pageSize?: number, cache?: DAOCache, securityContext?: SecurityContext | (() => SecurityContext) }) {
        this.theCache = options?.cache;
        this.theSecurityContext = options?.securityContext;
    }

    public cache(): DAOCache | undefined {
        return this.theCache;
    }

    public securityContext(securityContext?: SecurityContext): SecurityContext | undefined {

        if (securityContext) {
            this.theSecurityContext = securityContext;
        }

        if (this.theSecurityContext && isSecurityContextGenerator(this.theSecurityContext)) {
            return this.theSecurityContext();
        } else {
            return this.theSecurityContext;
        }
    }

    public dao(daoName: string): ReadDAO<any, any, any, any, any, any> | DAO<any, any, any, any, any, any, any, any, never> {
        return (this as any)[daoName];
    }

}
