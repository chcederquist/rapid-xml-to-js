# rapid-xml-to-js

**rapid-xml-to-js** is a fast, lightweight XML parser designed for simple hierarchical XML data.

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

## Installation

You can install the library via npm:

```bash
npm install rapid-xml-to-js
```

## Usage

Here’s how you can use **rapid-xml-to-jsn**:

```typescript
import { xlmToJs } from 'rapid-xml-to-js';

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

const parsed = xmlToJs(xml);

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

rapid-xml-to-js is optimized for speed and low memory usage, skipping some XML features to avoid overhead.

## API

### `xmlToJs(xml: string): object`

Parses a well-formed XML string into a JavaScript object.

#### Parameters
- `xml` *(string)*: The well-formed XML string to parse.

#### Returns
- A nested JavaScript object representing the XML structure.

## Benchmarks

Navigate to benchmarks folder. Credits to fast-xml-parser for the xml docs and benchmark code

Run command `npm install`

Comment in the XML document path to use

Run command `npm run test`

### Results
CPU: AMD Ryzen 9 9900X @ 4.4 GHz
RAM: 2x32GB DDR5-6000MHz
OS: Windows 11 Home 64-bit
Runtime: Node.js
Benchmark tool: Benchmark.js

#### ptest.xml
Tiny XML file with attributes, CDATA and nesting
| Library                            | Requests/second |
|------------------------------------|-----------------|
| fast-xml-parser                    | 76 833          |
| fast-xml-parser - preserve order   | 81 940          |
| xmlbuilder2                        | 33 847          |
| xml2js                             | 36 126          |
| txml                               | 456 226         |
| rapid-xml-to-js                    | 593 815         |

#### sample.xml
Small sample XML file at 1.5KB
| Library                            | Requests/second |
|------------------------------------|-----------------|
| fast-xml-parser                    | 20 676          |
| fast-xml-parser - preserve order   | 22 492          |
| xmlbuilder2                        | 15 123          |
| xml2js                             | 16 361          |
| txml                               | 158 576         |
| rapid-xml-to-js                    | 201 213         |

#### large.xml
Large 98MB XML file
| Library                            | Requests/second |
|------------------------------------|-----------------|
| fast-xml-parser                    | 0.2789          |
| fast-xml-parser - preserve order   | 0.3115          |
| xmlbuilder2                        | 0.1648          |
| xml2js                             | 0.2233          |
| txml                               | 1.3508          |
| rapid-xml-to-js                    | 1.8392          |

### Missing a library?
Create an issue or submit a PR adding the library to the benchmark-project.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvement, feel free to open an issue or a pull request.

## License

This library is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.