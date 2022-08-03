import { LitElement } from 'lit';
import 'lit-toast/lit-toast.js';
export declare class Toast extends LitElement {
    showToast: (message: string, duration: number) => void;
    modifier: string;
    static styles: import("lit").CSSResult;
    private toastRef;
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
        'ir-toast': Toast;
    }
}
