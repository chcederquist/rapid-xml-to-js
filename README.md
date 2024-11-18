# QuickXMLParse

**QuickXMLParse** is a blazing-fast, lightweight XML parser designed for simple hierarchical XML data. By focusing on core functionality and avoiding unnecessary overhead, it outperforms existing libraries like `fast-xml-parser` in terms of speed and memory efficiency.

## Features

This library is built for performance and simplicity. Below is a summary of what it can and cannot do:

### ✅ Features
- Parses well-formed XML into a nested JavaScript object.
- Handles basic XML structures with child elements.
- Supports CDATA sections.
- Skips comments, processing instructions (`<?...?>`), and `<!DOCTYPE>` declarations.

### ❌ Limitations
- Does not parse attributes. (To be implemented)
- Does not handle mixed content (text between and around child elements). (To be implemented)
- Does not validate XML (assumes input is well-formed). (Will not be implemented)
- Does not support namespaces or advanced XML features. (Will not be implemented)

## Installation

You can install the library via npm:

```bash
npm install quick-xml-parse
```

## Usage

Here’s how you can use **QuickXMLParse**:

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

QuickXMLParse is optimized for speed and low memory usage. It avoids garbage collection by slicing strings directly from the input XML. In benchmarks, it outperforms `fast-xml-parser` for its supported functionality.

## API

### `quickXmlParse(xml: string): object`

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