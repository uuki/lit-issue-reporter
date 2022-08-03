import type { IssueTemplate } from '@/types/generated/graphql';
import type { SelectProps } from '@/components/atoms/Select/Select';
import { LitElement } from 'lit';
import { ReportFields } from '@/features/form';
import '@/features/form/elements';
import '@/components/functional/ScreenShot/ScreenShot';
import '@/components/atoms/RoundButton/RoundButton';
import '@/components/atoms/SquareButton/SquareButton';
import '@/components/atoms/Input/Input';
import '@/components/atoms/Select/Select';
import '@/components/atoms/Textarea/Textarea';
export declare class ReportForm extends LitElement {
    repositoryId: string;
    templates: IssueTemplate[];
    currentTemplate: IssueTemplate | null;
    selected: IssueTemplate['name'];
    options: SelectProps[];
    screenshot: string;
    initialValues: ReportFields;
    loading: boolean;
    reset: null | (() => void);
    private modal;
    private formRef;
    static styles: import("lit").CSSResult[];
    static get properties(): {
        repositoryId: {
            type: StringConstructor;
        };
        templates: {
            type: ArrayConstructor;
        };
        loading: {
            type: BooleanConstructor;
        };
    };
    get values(): any;
    get errors(): any;
    get isValid(): any;
    constructor();
    firstUpdated(): void;
    validate(): any;
    setValue(name: string, value: string): void;
    handleCancel(): void;
    handleSubmit(event: Event): Promise<void>;
    handleSelect(event: CustomEvent): void;
    handleScreenShot(event: CustomEvent): void;
    onBlur(event: Event): void;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ir-form': ReportForm;
    }
}
