import { LitElement } from 'lit';
export declare class Modal extends LitElement {
    private modal;
    static styles: import("lit").CSSResult;
    constructor();
    private close;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ir-modal': Modal;
    }
}
