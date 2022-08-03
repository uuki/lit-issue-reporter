import { LitElement } from 'lit';
export declare type ScreenShotProps = {
    quality?: number;
    onCaptureStart?: () => Promise<void>;
    onCaptureEnd?: () => Promise<void>;
    type?: 'image/jpeg' | 'image/png';
};
export declare class ScreenShot extends LitElement {
    options: ScreenShotProps;
    private app;
    private browserSupported;
    private screenShot;
    static get properties(): {
        options: {
            type: ObjectConstructor;
        };
    };
    constructor();
    firstUpdated(): void;
    beforeCapture(): void;
    afterCapture(): void;
    handleCapture(): Promise<void>;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ir-screenshot': ScreenShot;
    }
}
