export interface DAOCache {

    toCache(key:string, value:any, ttl?: number) : Promise<void> ;
    fromCache(key:string) : Promise<any> ;
    deleteCache(key:string) : Promise<void> ;

}
