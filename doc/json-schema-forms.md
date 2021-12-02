# JSONForms
In this project we communitcate backend (Odoo servers) and our maps with [json-schema](http://json-schema.org/).
Backend send a schema that represent how data has to be captured in a form and the our frontend use [jsonforms](https://jsonforms.io/docs/integrations/react) to display the
right inputs.


### Format validation
JSONForms use under the hook [this library (ajv.js)](). You can validate all these formats
using the extension [ajv-formats](https://ajv.js.org/packages/ajv-formats.html).
To make a field validate agains one of these formats for example `email` you send this in your json schema:
``` json
{
  "type":"object",
  "properties":{
    "email":{
      "type":"string",
      "format": "email"
    }
  }
}
```
This will make that our UI validate that field as an email. If the user doesn't introduce a valid email an error will be shown.
