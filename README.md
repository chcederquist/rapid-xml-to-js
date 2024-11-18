# quick-xml-parser

**quick-xml-parser** is a blazing-fast, lightweight XML parser designed for simple hierarchical XML data.

## Features

This library is built for performance and simplicity. Below is a summary of what it can and cannot do:

### ✅ Features
- Parses well-formed XML into a nested JavaScript object.
- Handles basic XML structures with child elements.
- Supports CDATA sections.
- Skips comments, processing instructions (`<?...?>`), and `<!DOCTYPE>` declarations.

### ❌ Limitations
- Does not return attributes. (To be implemented)
- Does not handle mixed content (text between and around child elements). (To be implemented)
- Does not handle multiple CDATA or mixed text and CDATA (To be implemented)
- Does not validate XML (assumes input is well-formed).
- Does not support namespaces or advanced XML features.

## Installation

You can install the library via npm:

```bash
npm install quick-xml-parser
```

## Usage

Here’s how you can use **quick-xml-parser**:

```typescript
import { parse } from 'quick-xml-parser';

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

const parsed = parse(xml);

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

quick-xml-parser is optimized for speed and low memory usage, skipping some XML features to avoid overhead.

## API

### `parse(xml: string): object`

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