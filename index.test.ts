import { parse } from "./index";
// TODO: Benchmark tests
describe('Test of quickXmlParse', () => {
  it('Correctly parses an XML structure', () => {
    const xml = `<root><a></a><b></b></root>`
    const json = parse(xml);
    expect(json.root).toHaveProperty('a');
    expect(json.root).toHaveProperty('b');
  });

  it('Correctly parses CDATA', () => {
    const aData = '<Data from CDATA>'
    const xml = `<root><a><![CDATA[${aData}]]></a><b>Test</b>`
    const json = parse(xml);
    expect(json.root.a).toBe("<Data from CDATA>");
    expect(json.root.b).toBe("Test");
  });

  it('Correctly ignores comments, DOCTYPE, stylesheets', () => {
    const xml = `<root><a><!--Test comment--><c></c></a><b></b></root>`
    const json = parse(xml);
    expect(json.root).toHaveProperty('a');
    expect(json.root).toHaveProperty('b');
    expect(json.root.a).toHaveProperty('c');
  });

  it('Correctly parses lists of elements', () => {
    const xml = `<root><a></a><a></a><a/><b></b></root>`
    const json = parse(xml);
    expect(json.root).toHaveProperty('b');
    expect(json.root.a.length).toBe(3);
  });

  test('parses deeply nested structures', () => {
    const xml = `
      <root>
        <level1>
          <level2>
            <level3>
              <level4>Deep content</level4>
            </level3>
          </level2>
        </level1>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        level1: {
          __parent: expect.any(Object),
          level2: {
            __parent: expect.any(Object),
            level3: {
              __parent: expect.any(Object),
              level4: 'Deep content',
            },
          },
        },
      },
    };

    expect(parse(xml)).toEqual(expected);
  });

  test('handles CDATA-heavy XML', () => {
    const xml = `
      <root>
        <data><![CDATA[Some CDATA content]]></data>
        <data><![CDATA[<tag>Inside CDATA</tag>]]></data>
        <data><![CDATA[]]></data>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        data: [
          'Some CDATA content',
          '<tag>Inside CDATA</tag>',
          '',
        ],
      },
    };

    expect(parse(xml)).toEqual(expected);
  });

  test('parses XML with variations in whitespace formatting', () => {
    const xml = `
      <root>
        <item> Content with leading and trailing spaces </item>
        <item>
          Content with
          line breaks
        </item>
        <item>   </item>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        item: [
          ' Content with leading and trailing spaces ',
          `
          Content with
          line breaks
        `,
          {__parent: expect.any(Object)}
        ],
      },
    };

    expect(parse(xml)).toEqual(expected);
  });

  test('handles empty tags and self-closing tags', () => {
    const xml = `
      <root>
        <empty></empty>
        <selfClosing />
        <nestedSelfClosing>
          <child />
        </nestedSelfClosing>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        empty: {__parent: expect.any(Object)},
        selfClosing: {__parent: expect.any(Object)},
        nestedSelfClosing: {
          __parent: expect.any(Object),
          child: {__parent: expect.any(Object)},
        },
      },
    };
    const actual = parse(xml)
    expect(actual).toEqual(expected);
  });

  test('skips comments, processing instructions, and DOCTYPE declarations', () => {
    const xml = `
      <?xml version="1.0"?>
      <!DOCTYPE note SYSTEM "Note.dtd">
      <root>
        <!-- This is a comment -->
        <item>Valid content</item>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        item: 'Valid content',
      },
    };

    expect(parse(xml)).toEqual(expected);
  });

  test('handles mixed CDATA and regular content in a single document', () => {
    const xml = `
      <root>
        <data><![CDATA[CDATA content]]></data>
        <data>Regular content</data>
        <data><![CDATA[More CDATA]]></data>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        data: [
          'CDATA content',
          'Regular content',
          'More CDATA',
        ],
      },
    };

    expect(parse(xml)).toEqual(expected);
  });
});
