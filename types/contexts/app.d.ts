import type { Strings } from 'lit-translate';
import { ReactiveElement } from 'lit';
import { ApolloClient } from '@apollo/client/core';
import { Exome } from 'exome';
export declare type AppRoot = HTMLElement | null;
export declare type Config = {
    token: string;
    repoName: string;
    repoOwner: string;
    lang?: string;
    localesLoader?: Promise<Strings>;
};
declare class AppContext extends Exome {
    root: AppRoot;
    context: ReactiveElement['renderRoot'] | null;
    apollo: ApolloClient<any> | null;
    config: Config;
    loading: boolean;
    provider: 'github';
    setRoot(newValue: AppRoot): void;
    setContext(newValue: ReactiveElement['renderRoot']): void;
    setApolloClient(client: ApolloClient<any>): void;
    setOptions(newValue: Config): void;
    setLoading(newValue: boolean): void;
}
export declare const appContext: AppContext;
export {};
