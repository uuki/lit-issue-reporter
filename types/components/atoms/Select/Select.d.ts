import { LitElement } from 'lit';
export declare type SelectEvent = {
    detail: {
        selected: string;
    };
} & Event;
export declare type SelectProps = {
    label: string | number;
    value: string | number;
    checked?: boolean;
};
export declare class Select extends LitElement {
    title: string;
    defaultTitle: string;
    name?: string;
    options?: SelectProps[];
    static styles: import("lit").CSSResult[];
    static get properties(): {
        title: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        options: {
            type: ArrayConstructor;
        };
    };
    constructor();
    firstUpdated(): void;
    handleChange(event: Event): void;
    getItem({ name, value, label, checked }: any): import("lit").TemplateResult<1>;
    getIcon(): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ir-select': Select;
    }
}
