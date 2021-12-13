import { createAjv } from '@jsonforms/core'

/**
 * AJV is the validator jsonforms use for their schema
 * More info:
 * https://github.com/ajv-validator/ajv
 *
 * We extend their formats with `markdown` to avoid warnings
 */
const customAjv = createAjv({
  useDefaults: true
}).addFormat('markdown', /^\[markdown\].*$/i)

export default customAjv
