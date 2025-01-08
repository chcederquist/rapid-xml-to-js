import { xmlToJson } from "./index";
// TODO: Benchmark tests
describe('Test of parse', () => {

  test('parses a single attribute', () => {
    const xml = `<root attr="value">Content</root>`;
    const expected = {
      root: {
        __parent: expect.any(Object),
        $attrs: { attr: "value" },
        "#text": "Content",
      },
    };
    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('parses attributes in a self-closing tag', () => {
    const xml = `<root attr="value"/>`;
    const expected = {
      root: {
        __parent: expect.any(Object),
        $attrs: { attr: "value" },
      },
    };
    let actual = xmlToJson(xml)
    expect(actual).toEqual(expected);
  });

  test('parses multiple attributes', () => {
    const xml = `<root attr1="value1" attr2="value2">Content</root>`;
    const expected = {
      root: {
        __parent: expect.any(Object),
        $attrs: { attr1: "value1", attr2: "value2" },
        "#text": "Content",
      },
    };
    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('parses attributes in nested elements', () => {
    const xml = `<root><child attr="value">Content</child></root>`;
    const expected = {
      root: {
        __parent: expect.any(Object),
        child: {
          __parent: expect.any(Object),
          $attrs: { attr: "value" },
          "#text": "Content",
        },
      },
    };
    let actual = xmlToJson(xml)
    expect(actual).toEqual(expected);
  });

  it('Correctly parses an XML structure', () => {
    const xml = `<root><a></a><b></b></root>`
    const json = xmlToJson(xml);
    expect(json.root).toHaveProperty('a');
    expect(json.root).toHaveProperty('b');
  });

  it('Correctly parses CDATA', () => {
    const aData = '<Data from CDATA>'
    const xml = `<root><a><![CDATA[${aData}]]></a><b>Test</b>`
    const json = xmlToJson(xml);
    expect(json.root.a).toEqual({__parent: expect.any(Object), '#text': "<Data from CDATA>"});
    expect(json.root.b).toEqual({__parent: expect.any(Object), '#text': "Test"});
  });

  it('Correctly ignores comments, DOCTYPE, stylesheets', () => {
    const xml = `<root><a><!--Test comment--><c></c></a><b></b></root>`
    const json = xmlToJson(xml);
    expect(json.root).toHaveProperty('a');
    expect(json.root).toHaveProperty('b');
    expect(json.root.a).toHaveProperty('c');
  });

  it('Correctly parses lists of elements', () => {
    const xml = `<root><a></a><a></a><a/><b></b></root>`
    const json = xmlToJson(xml);
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
              level4: {__parent: expect.any(Object),'#text': 'Deep content'},
            },
          },
        },
      },
    };
    const actual = xmlToJson(xml)
    expect(actual).toEqual(expected);
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
          {__parent: expect.any(Object), '#text':'Some CDATA content'},
          {__parent: expect.any(Object), '#text':'<tag>Inside CDATA</tag>'},
          {__parent: expect.any(Object), '#text':''},
        ],
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
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
          {__parent: expect.any(Object), '#text':' Content with leading and trailing spaces '},
          {__parent: expect.any(Object), '#text':`
          Content with
          line breaks
        `},
          {__parent: expect.any(Object)}
        ],
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
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
    const actual = xmlToJson(xml)
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
        item: {__parent: expect.any(Object), '#text': 'Valid content'},
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
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
          {__parent: expect.any(Object), '#text': 'CDATA content'},
          {__parent: expect.any(Object), '#text': 'Regular content'},
          {__parent: expect.any(Object), '#text': 'More CDATA'},
        ],
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('handles multiple sibling elements with the same name', () => {
    const xml = `
      <root>
        <item>First</item>
        <item>Second</item>
        <item>Third</item>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        item: [{__parent: expect.any(Object), '#text':'First'}, {__parent: expect.any(Object), '#text': 'Second'}, {__parent: expect.any(Object), '#text':'Third'}],
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('handles deeply nested structures with mixed empty and populated elements', () => {
    const xml = `
      <root>
        <level1>
          <level2>
            <level3>
              <empty />
              <populated>Content</populated>
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
              empty: {__parent: expect.any(Object)},
              populated: {__parent: expect.any(Object), '#text': 'Content'},
            },
          },
        },
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('handles XML with no content inside tags', () => {
    const xml = `
      <root>
        <empty1></empty1>
        <empty2 />
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        empty1: {__parent: expect.any(Object)},
        empty2: {__parent: expect.any(Object)},
      },
    };
    const actual = xmlToJson(xml)
    expect(actual).toEqual(expected);
  });

  test('parses CDATA with special characters', () => {
    const xml = `
      <root>
        <data><![CDATA[<special>&characters</special>]]></data>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        data: {__parent: expect.any(Object), '#text': '<special>&characters</special>'},
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('handles documents with leading and trailing whitespace', () => {
    const xml = `
      
      <root>
        <item>Content</item>
      </root>
      
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        item: {__parent: expect.any(Object), '#text': 'Content'},
      },
    };
    const actual = xmlToJson(xml)
    expect(actual).toEqual(expected);
  });

  test('handles empty root element', () => {
    const xml = `
      <root></root>
    `;

    const expected = {
      root: {__parent: expect.any(Object)},
    };

    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('handles large documents', () => {
    const xml = `
      <root>
        ${'<item>Content</item>'.repeat(10000)}
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        item: Array(10000).fill({__parent: expect.any(Object), '#text':'Content'}),
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('handles multiple levels of CDATA', () => {
    const xml = `
      <root>
        <data><![CDATA[Level 1]]><![CDATA[ and Level 2]]></data>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        data: {__parent: expect.any(Object), '#text': 'Level 1 and Level 2'},
      },
    };
    const actual = xmlToJson(xml);
    expect(actual).toEqual(expected);
  });

  test('handles mixed test and CDATA', () => {
    const xml = `
      <root>
        <data>Test <![CDATA[Level 1]]>here<![CDATA[ and Level 2]]>there</data>
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        data: {__parent: expect.any(Object), '#text': 'Test Level 1here and Level 2there'},
      },
    };
    const actual = xmlToJson(xml);
    expect(actual).toEqual(expected);
  });


  test('ignores extraneous characters outside root element', () => {
    const xml = `
      <!-- Comment -->
      <root>
        <item>Valid content</item>
      </root>
      <!-- Another comment -->
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        item: {__parent: expect.any(Object), '#text': 'Valid content'},
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
  });


  test('handles XML with unconventional spacing and line breaks', () => {
    const xml = `
      <root> 
        <item 
          >Content</item 
        >
        <item>Another</item  >
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        item: [{__parent: expect.any(Object), '#text': 'Content'}, {__parent: expect.any(Object), '#text':'Another'}],
      },
    };

    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('ignores invalid comments and CDATA-like content outside valid constructs', () => {
    const xml = `
      <root>
        <item>Valid content</item>
        <!-- This is not <![CDATA[valid]] -->
        <!-- This is also not valid CDATA ]]> -->
      </root>
    `;

    const expected = {
      root: {
        __parent: expect.any(Object),
        item: {__parent: expect.any(Object), '#text': 'Valid content'},
      },
    };
    const actual = xmlToJson(xml)
    expect(actual).toEqual(expected);
  });
  test('parses attributes with special characters', () => {
    const xml = `<root attr="value with spaces" another-attr="value&chars!">Content</root>`;
    const expected = {
      root: {
        __parent: expect.any(Object),
        $attrs: { 
          attr: "value with spaces",
          "another-attr": "value&chars!",
        },
        "#text": "Content",
      },
    };
    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('parses attributes with empty values', () => {
    const xml = `<root attr1="" attr2="non-empty">Content</root>`;
    const expected = {
      root: {
        __parent: expect.any(Object),
        $attrs: { 
          attr1: "",
          attr2: "non-empty",
        },
        "#text": "Content",
      },
    };
    const actual = xmlToJson(xml)
    expect(actual).toEqual(expected);
  });


  test('parses element with only attributes and no text content', () => {
    const xml = `<root attr1="value1" attr2="value2"></root>`;
    const expected = {
      root: {
        __parent: expect.any(Object),
        $attrs: { 
          attr1: "value1",
          attr2: "value2",
        },
      },
    };
    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('parses attributes with mixed whitespace formatting', () => {
    const xml = `<root  attr1="value1"  attr2="  value2  ">Content</root>`;
    const expected = {
      root: {
        __parent: expect.any(Object),
        $attrs: {
          attr1: "value1",
          attr2: "  value2  ", // Preserves the spaces
        },
        "#text": "Content",
      },
    };
    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('parses attributes with quotes inside the value', () => {
    const xml = `<root attr="value with \\"quotes\\" inside">Content</root>`;
    const expected = {
      root: {
        __parent: expect.any(Object),
        $attrs: {
          attr: 'value with \\"quotes\\" inside', // Preserves internal quotes
        },
        "#text": "Content",
      },
    };
    const actual = xmlToJson(xml)
    expect(actual).toEqual(expected);
  });

  test('parses attributes with multiple equal signs in the value', () => {
    const xml = `<root attr="value=with=equals">Content</root>`;
    const expected = {
      root: {
        __parent: expect.any(Object),

        $attrs: {
          attr: "value=with=equals",
        },
        "#text": "Content",
      },
    };
    expect(xmlToJson(xml)).toEqual(expected);
  });

  test('Handles array of self-closing elements', () => {
    const xml = `<Stemmer>
<Parti Id="5891" Bogstav="A" Navn="A. Socialdemokratiet" StemmerAntal="86226" StemmerPct="19"/>
<Parti Id="5893" Bogstav="B" Navn="B. Radikale Venstre" StemmerAntal="34031" StemmerPct="7.5"/>
<Parti Id="5895" Bogstav="C" Navn="C. Det Konservative Folkeparti" StemmerAntal="22797" StemmerPct="5"/>
</Stemmer>`
    const expected = {
      Stemmer: {
        __parent: expect.any(Object),
        Parti: [
          {
            __parent: expect.any(Object),
            $attrs: {
              Id: "5891",
              Bogstav: "A",
              Navn: "A. Socialdemokratiet",
              StemmerAntal: "86226",
              StemmerPct: "19",
            },
          },
          {
            __parent: expect.any(Object),
            $attrs: {
              Id: "5893",
              Bogstav: "B",
              Navn: "B. Radikale Venstre",
              StemmerAntal: "34031",
              StemmerPct: "7.5",
            },
          },
          {
            __parent: expect.any(Object),
            $attrs: {
              Id: "5895",
              Bogstav: "C",
              Navn: "C. Det Konservative Folkeparti",
              StemmerAntal: "22797",
              StemmerPct: "5",
            },
          },
        ],
      }
    }
    expect(xmlToJson(xml)).toEqual(expected);
  })
});
