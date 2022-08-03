import type { GetRepositoryQuery } from '@/types/generated/graphql';
import type { ApolloQueryResult } from '@apollo/client';
import { LitElement } from 'lit';
import { QueryController, MutationController } from '@/features/github';
import '@/components/functional/Toast/Toast';
import '@/components/molecules/ReportForm/ReportForm';
import '@/components/organisms/Modal/Modal';
export declare class ReportLayout extends LitElement {
    static styles: import("lit").CSSResult;
    private formRef;
    private toastRef;
    private app;
    private modal;
    query: QueryController<import("@apollo/client").DocumentNode, unknown>;
    mutation: MutationController;
    repository: {
        data: GetRepositoryQuery['repository'];
        loading: ApolloQueryResult<GetRepositoryQuery>['loading'];
    };
    errors: ApolloQueryResult<GetRepositoryQuery>['errors'];
    lastCreatedIssueId: string;
    constructor();
    firstUpdated(): void;
    handleSubmit(event: CustomEvent): Promise<void>;
    fetch(): Promise<void>;
    getForm(): import("lit").TemplateResult<1>;
    handleToastClick(): void;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ir-report-layout': ReportLayout;
    }
}
