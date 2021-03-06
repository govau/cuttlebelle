/***************************************************************************************************************************************************************
 *
 * parse.js unit tests
 *
 * @file - src/parse.js
 *
 * Testing methods:
 * ParseContent
 * ParseMD
 * ParseYaml
 **************************************************************************************************************************************************************/


import { ParseContent, ParseMD, ParseYaml } from '../../src/parse';
import { SETTINGS } from '../../src/settings';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ParseContent
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('ParseContent() - Non strings stay whatever they are', () => {
	expect( ParseContent( undefined, '' ) ).toBe( undefined );
	expect( ParseContent( [], '' ) ).toEqual( expect.arrayContaining( [] ) );
	expect( ParseContent( {}, '' ) ).toMatchObject( {} );
});


test('ParseContent() - Parse yaml content correctly', () => {
	const content1 = ``;
	const match1 = { frontmatter: {}, body: '' };
	expect( ParseContent( content1, 'index.yml' ) ).toMatchObject( match1 );


	const content2 = `
test: var
var: test
`;
	const match2 = { frontmatter: { test: 'var', var: 'test' }, body: '' };
	expect( ParseContent( content2, 'index.yml' ) ).toMatchObject( match2 );
});


test('ParseContent() - Parse md content correctly', () => {
	const content1 = ``;
	const match1 = { frontmatter: {}, body: '' };
	expect( ParseContent( content1, 'partial.md' ) ).toMatchObject( match1 );

	const content2 = `---
test: var
var: test
---

**yes**
`;
	const match2 = { frontmatter: { test: 'var', var: 'test' }, body: '<p><strong>yes</strong></p>\n' };
	expect( ParseContent( content2, 'partial.md' ) ).toMatchObject( match2 );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ParseMD
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('ParseMD() - Non strings stay whatever they are', () => {
	expect( ParseMD( undefined ) ).toBe( undefined );
	expect( ParseMD( [] ) ).toEqual( expect.arrayContaining( [] ) );
	expect( ParseMD( {} ) ).toMatchObject( {} );
});


test('ParseMD() - Markdown is parsed', () => {
	const content1 = ``;
	const match1 = '';
	expect( ParseMD( content1 ) ).toBe( match1 );

	const content2 = `**yes** _test_`;
	const match2 = '<p><strong>yes</strong> <em>test</em></p>\n';
	expect( ParseMD( content2 ) ).toBe( match2 );
});


test('ParseMD() - Markdown takes the custom renderer', () => {
	SETTINGS.defaults.site.markdownRenderer = 'tests/__unit__/mocks/customRenderer.js';
	const content2 = `
### testing

— no list
- list
`;
	const match2 = '<h3>!testing!</h3><p>&mdash; no list</p>\n<ul>\n<li>list</li>\n</ul>\n';
	expect( ParseMD( content2 ) ).toBe( match2 );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ParseYaml
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('ParseYaml() - Non strings stay whatever they are', () => {
	expect( ParseYaml( undefined ) ).toBe( undefined );
	expect( ParseYaml( [] ) ).toEqual( expect.arrayContaining( [] ) );
	expect( ParseYaml( {} ) ).toMatchObject( {} );
});


test('ParseYaml() - Yaml is parsed', () => {
	const content1 = ``;
	const match1 = {};
	expect( ParseYaml( content1 ) ).toMatchObject( match1 );

	const content2 = `var: value`;
	const match2 = { var: 'value' };
	expect( ParseYaml( content2 ) ).toMatchObject( match2 );
});
