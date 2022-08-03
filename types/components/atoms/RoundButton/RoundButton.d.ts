import { LitElement } from 'lit';
export declare class RoundButton extends LitElement {
    static styles: import("lit").CSSResult;
    modifier: string;
    static get properties(): {
        modifier: {
            type: StringConstructor;
        };
    };
    constructor();
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ir-round-button': RoundButton;
    }
}
