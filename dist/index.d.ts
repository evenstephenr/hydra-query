import { Dispatch } from "react";
/**
 * QueryProps defines the properties required (or optionally used) to define
 *  a useQuery hook.
 *
 * QueryProps uses generics (received from a useQuery hook) to determine the following...
 *  1. what data is accessible in the useQuery hook
 *  2. what query params exist for the useQuery hook
 */
declare type QueryProps<Params> = {
    /** All queries require a target endpoint */
    endpoint: string;
    /** All queries have optional params (defaults to `undefined`) */
    params?: Params;
    /**
     * useQuery defaults to using the global `fetch` browser API
     *  - you can provide your own external request util here as needed
     */
    requestUtil?: (url: string, options?: RequestInit | undefined) => Promise<Response>;
    /**
     * useQuery can optionally serve cached data, rather than what's provided by an
     *  external `fetch`
     *  - localStorage is used for the cache
     *  - data provided by this hook will be cached using the given key passed by `withCache`
     *  - the data that is cached will be replaced by any use of useQuery's `requestUtil`
     * */
    withCache?: string;
};
/**
 * QueryState defines the stateful properties that are returned from every instance
 *  of a useQuery hook
 */
declare type QueryState<Data, Params> = {
    /** If an external request is currently active, isLoading will be set to `true` */
    isLoading: boolean;
    /** The params used in the current or most recent instance of a useQuery hook */
    params: Params | {};
    /** The resulting URL used in the current or most recent instance of a useQuery hook */
    url: string;
    /** This will always match the endpoint defined in QueryProps */
    endpoint?: string;
    /** The data expected to be retrieved by a useQuery hook */
    data?: Data;
    /** Any error thrown by a useQuery hook will be communicated here */
    error?: string;
    /** If an error status code is returned from an external request, it will be populated here */
    errorCode?: number;
};
/**
 * QueryFetch is exported here for typing use outside of this module
 *
 * ex:
 *  type FetchSomeType = QueryFetch<{ data: SomeType }, {}>;
 */
export declare type QueryFetch<Data, Params> = (config?: {
    params?: Params;
    options?: RequestInit;
    /**
     * `onResponse` can be used to mutate the data returned from your external source
     *  - This function defaults to a noop wrapped in a Promise that immediately resolves
     *  - if you supply your own handler here, it must be wrapped in a promise
     */
    onResponse?: (data: any) => Promise<{
        data: Data;
    }>;
}) => void;
/**
 * QueryResult defines the properties that are returned from every instance
 *  of a useQuery hook.
 *
 * QueryResult extends QueryState
 *
 * QueryResult uses generics (received from a useQuery hook) to determine the following...
 *  1. what data is accessible in the useQuery hook
 *  2. what query params exist for the useQuery hook
 */
declare type QueryResult<Data, Params> = QueryState<Data, Params> & {
    /**
     * `fetch` can be used for controlled external data retrieval from whatever context
     *  defines a useQuery hook
     */
    fetch: QueryFetch<Data, Params>;
    /**
     * this is generally useful for testing, you can also use it to wipe the state of the hook
     */
    dispatch: Dispatch<QueryActions<Data, Params>>;
};
export declare enum ACTION {
    RESET = "reset",
    REFRESH = "refresh",
    SUCCESS = "success",
    ERROR = "error"
}
declare type RESET_ACTION = {
    type: ACTION.RESET;
};
declare type REFRESH_ACTION<P> = {
    type: ACTION.REFRESH;
    url: string;
    params?: P | {};
};
declare type SUCCESS_ACTION<D> = {
    type: ACTION.SUCCESS;
    data: D;
    prevPage?: string;
    nextPage?: string;
};
declare type ERROR_ACTION = {
    type: ACTION.ERROR;
    error: string;
    errorCode?: number;
};
declare type QueryActions<D, P> = RESET_ACTION | REFRESH_ACTION<P> | SUCCESS_ACTION<D> | ERROR_ACTION;
export declare function useQueryReducer<Data, Params>(state: QueryState<Data, Params>, action: QueryActions<Data, Params>): QueryState<Data, Params>;
/**
 * useQuery is a custom hook that enforces consistent patterns for...
 *  1. retrieving data from external resources
 *  2. typing the values returned from external resources
 *  3. typing the optional query parameters available on an external resource
 */
export declare function useQuery<D, P>({ endpoint, withCache, params, requestUtil, }: QueryProps<P>): QueryResult<D, P>;
export {};
