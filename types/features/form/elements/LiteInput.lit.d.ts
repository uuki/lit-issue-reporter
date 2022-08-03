import { LitElement } from 'lit-element';
import '@/components/atoms/Input/Input';
export default class LiteInput extends LitElement {
    type: string;
    name: string;
    value: string;
    placeholder: string;
    error: string;
    static get properties(): {
        type: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        value: {
            type: StringConstructor;
            reflect: boolean;
        };
        placeholder: {
            type: StringConstructor;
        };
        error: {
            type: StringConstructor;
        };
    };
    constructor();
    createRenderRoot(): this;
    render(): import("lit-element").TemplateResult;
}
