import type { ZodTypeAny } from 'zod';
import { z } from 'zod';
export declare const schemaForType: <T>() => <S extends z.ZodType<T, any, any>>(arg: S) => S;
export declare const toLiteFormValidationSchema: <T>(schema: Record<keyof T, ZodTypeAny>) => {
    [key: string]: (value: string | number) => string | undefined;
};
