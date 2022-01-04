import { JsonSchema } from '@jsonforms/core'
type translatableJsonSchema = JsonSchema & { translations?: Record<string, string> }

type Props = { jsonSchema: null | JsonSchema }
export type TranslateFn = (id: string, defaultMessage: string) => string
export const useTranslate = ({ jsonSchema }: Props): TranslateFn => {
  return (id: string, defaultMessage: string) => {
    if (!jsonSchema) return defaultMessage

    const parts = id?.split('.')
    if (!parts) return defaultMessage

    const propertyKey = parts[0]

    if (!propertyKey) return defaultMessage

    const key = Object.keys(jsonSchema.properties).find(
      (propKey: string) => propKey === propertyKey
    )
    if (!key) return defaultMessage
    const translations = (jsonSchema.properties[key] as translatableJsonSchema)?.translations || {}

    return translations[parts[1]] || defaultMessage
  }
}
