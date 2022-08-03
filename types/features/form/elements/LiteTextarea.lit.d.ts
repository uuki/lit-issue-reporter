import { LitElement } from 'lit-element';
import '@/components/atoms/Textarea/Textarea';
export default class LiteTextarea extends LitElement {
    name: string;
    value: string;
    placeholder: string;
    static get properties(): {
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
    };
    constructor();
    createRenderRoot(): this;
    render(): import("lit-element").TemplateResult;
}
