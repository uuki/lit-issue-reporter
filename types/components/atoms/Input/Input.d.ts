import { LitElement } from 'lit';
export declare class Input extends LitElement {
    type: HTMLInputElement['type'];
    name: HTMLInputElement['name'];
    value: string;
    placeholder?: string | number;
    modifier?: string;
    internals_: ElementInternals;
    static styles: import("lit").CSSResult;
    static formAssociated: boolean;
    private inputRef;
    static get properties(): {
        type: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        value: {
            type: StringConstructor;
        };
        placeholder: {
            type: StringConstructor;
        };
        modifier: {
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
        'ir-input': Input;
    }
}
