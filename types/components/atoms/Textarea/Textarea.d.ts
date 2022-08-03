import { LitElement } from 'lit';
export declare class Textarea extends LitElement {
    name: HTMLTextAreaElement['name'];
    value: string | number;
    placeholder?: string | number;
    internals_: ElementInternals;
    static styles: import("lit").CSSResult;
    static formAssociated: boolean;
    private textAreaRef;
    static get properties(): {
        name: {
            type: StringConstructor;
        };
        value: {
            type: StringConstructor;
        };
        placeholder: {
            type: StringConstructor;
        };
    };
    constructor();
    onChange(): void;
    onInput(): void;
    onBlur(): void;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ir-textarea': Textarea;
    }
}
