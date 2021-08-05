import {expectType, expectAssignable} from 'tsd';
import {CamelCase, Split} from '../index';

// Split
const prefixSplit: Split<'--very-prefixed', '-'> = ['', '', 'very', 'prefixed'];
expectType<['', '', 'very', 'prefixed']>(prefixSplit);

// CamelCase
const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectType<'fooBar'>(camelFromPascal);

const camelFromKebab: CamelCase<'foo-bar'> = 'fooBar';
expectType<'fooBar'>(camelFromKebab);

const camelFromComplexKebab: CamelCase<'foo-bar-abc-123'> = 'fooBarAbc123';
expectType<'fooBarAbc123'>(camelFromComplexKebab);

const camelFromSpace: CamelCase<'foo bar'> = 'fooBar';
expectType<'fooBar'>(camelFromSpace);

const camelFromSnake: CamelCase<'foo_bar'> = 'fooBar';
expectType<'fooBar'>(camelFromSnake);

const noDelimiterFromMono: CamelCase<'foobar'> = 'foobar';
expectType<'foobar'>(noDelimiterFromMono);

const camelFromMixed: CamelCase<'foo-bar_abc xyzBarFoo'> = 'fooBarAbcXyzBarFoo';
expectType<'fooBarAbcXyzBarFoo'>(camelFromMixed);

const camelFromVendorPrefixedCssProperty: CamelCase<'-webkit-animation'> = 'webkitAnimation';
expectType<'webkitAnimation'>(camelFromVendorPrefixedCssProperty);

const camelFromDoublePrefixedKebab: CamelCase<'--very-prefixed'> = 'veryPrefixed';
expectType<'veryPrefixed'>(camelFromDoublePrefixedKebab);

const camelFromRepeatedSeparators: CamelCase<'foo____bar'> = 'fooBar';
expectType<'fooBar'>(camelFromRepeatedSeparators);

const camelFromUppercase: CamelCase<'FOO'> = 'foo';
expectType<'foo'>(camelFromUppercase);

const camelFromLowercase: CamelCase<'foo'> = 'foo';
expectType<'foo'>(camelFromLowercase);

const camelFromScreamingSnakeCase: CamelCase<'FOO_BAR'> = 'fooBar';
expectType<'fooBar'>(camelFromScreamingSnakeCase);

const camelFromScreamingKebabCase: CamelCase<'FOO-BAR'> = 'fooBar';
expectType<'fooBar'>(camelFromScreamingKebabCase);

// Verifying example
type CamelCasedProperties<T> = {
	[K in keyof T as CamelCase<K>]: T[K]
};

interface RawOptions {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
	BAR: string;
	QUZ_QUX: number;
	'OTHER-FIELD': boolean;
}

expectAssignable<CamelCasedProperties<RawOptions>>({
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123,
	bar: 'foo',
	quzQux: 6,
	otherField: false,
});
