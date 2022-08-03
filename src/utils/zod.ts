import type { ZodTypeAny } from 'zod'
import { z, ZodError } from 'zod'

export const schemaForType =
  <T>() =>
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg
  }

export const toLiteFormValidationSchema = <T>(schema: Record<keyof T, ZodTypeAny>) => {
  return Object.keys(schema).reduce((pre, cur) => {
    pre[cur] = (value: string | number) => {
      let errorMessage = ''
      try {
        // @ts-ignore
        schema[cur].parse(value)
      } catch (error: any) {
        if (error instanceof ZodError) {
          errorMessage = error.issues[0].message
        }
      }
      return errorMessage || undefined
    }
    return pre
  }, {} as { [key: string]: (value: string | number) => string | undefined })
}
