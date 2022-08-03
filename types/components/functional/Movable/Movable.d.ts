import { LitElement } from 'lit';
export declare type MovableProps = {
    x: 0;
    y: 0;
};
export declare class Movable extends LitElement {
    private myRef;
    private child;
    state: MovableProps;
    private get slottedChildren();
    private onMouseDown;
    constructor();
    firstUpdated(): void;
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ir-movable': Movable;
    }
}
