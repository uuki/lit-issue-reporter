import { ReactiveController, ReactiveControllerHost } from 'lit';
import { ApolloMutationController } from '@apollo-elements/core';
export declare class MutationController extends ApolloMutationController implements ReactiveController {
    host: ReactiveControllerHost;
    private app;
    private readonly _render;
    constructor(host: ReactiveControllerHost, mutate: any);
    update(): void;
    hostConnected(): void;
    hostDisconnected(): void;
}
