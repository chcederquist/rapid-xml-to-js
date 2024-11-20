# rapid-xml-to-json

**rapid-xml-to-json** is a blazing-fast, lightweight XML parser designed for simple hierarchical XML data.

## Features

This library is built for performance and simplicity. Below is a summary of what it can and cannot do:

### ✅ Features
- Parses well-formed XML into a nested JavaScript object.
- Handles basic XML structures with child elements.
- Sets attributes on elements ($attrs)
- Supports CDATA sections.
- Skips comments, processing instructions (`<?...?>`), and `<!DOCTYPE>` declarations.

### ❌ Limitations
- Does not handle mixed content (text between and around child elements). (To be implemented)
- Does not validate XML (assumes input is well-formed).
- Does not support namespaces or advanced XML features.

## Installation

You can install the library via npm:

```bash
npm install rapid-xml-to-json
```

## Usage

Here’s how you can use **rapid-xml-to-json**:

```typescript
import { xlmToJson } from 'rapid-xml-to-json';

const xml = `
<root>
  <item>
    <![CDATA[Some content here]]>
  </item>
  <item>
    <subitem>Another piece of content</subitem>
  </item>
</root>
`;

const parsed = xmlToJson(xml);

console.log(parsed);
// Output:
// {
//   root: {
//     item: [
//       "Some content here",
//       { subitem: "Another piece of content" }
//     ]
//   }
// }
```

## Performance

rapid-xml-to-json is optimized for speed and low memory usage, skipping some XML features to avoid overhead.

## API

### `xmlToJson(xml: string): object`

Parses a well-formed XML string into a JavaScript object.

#### Parameters
- `xml` *(string)*: The well-formed XML string to parse.

#### Returns
- A nested JavaScript object representing the XML structure.

## Benchmarks

Soon(tm)

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvement, feel free to open an issue or a pull request.

## License

This library is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.