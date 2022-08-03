import { ReactiveController, ReactiveControllerHost } from 'lit';
import { ApolloQuery } from '@apollo-elements/lit-apollo';
export declare class QueryController<D, V> extends ApolloQuery implements ReactiveController {
    host: ReactiveControllerHost;
    query: any;
    private app;
    private readonly _render;
    constructor(host: ReactiveControllerHost, query: D, variables?: V);
    fetch(variables?: V): Promise<import("@apollo/client").ApolloQueryResult<unknown>>;
    update(): void;
    hostConnected(): void;
    hostDisconnected(): void;
}
