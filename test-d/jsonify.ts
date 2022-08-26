import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {Jsonify, JsonValue, NegativeInfinity, PositiveInfinity} from '..';

interface A {
	a: number;
}

class B {
	a!: number;
}

interface V {
	a?: number;
}

interface X {
	a: Date;
}

interface Y {
	a?: Date;
}

interface Z {
	a: number | undefined;
}

interface W {
	a?: () => any;
}

declare const a: Jsonify<A>;
declare const b: Jsonify<B>;

declare const v: V; // Not assignable to JsonValue because it is defined as interface

declare const x: X; // Not assignable to JsonValue because it contains Date value
declare const y: Y; // Not assignable to JsonValue because it contains Date value

declare const z: Z; // Not assignable to JsonValue because undefined is not valid Json value
declare const w: W; // Not assignable to JsonValue because a function is not valid Json value

expectAssignable<JsonValue>(null);
expectAssignable<JsonValue>(false);
expectAssignable<JsonValue>(0);
expectAssignable<JsonValue>('');
expectAssignable<JsonValue>([]);
expectAssignable<JsonValue>({});
expectAssignable<JsonValue>([0]);
expectAssignable<JsonValue>({a: 0});
expectAssignable<JsonValue>(a);
expectAssignable<JsonValue>(b);
expectAssignable<JsonValue>({a: {b: true, c: {}}, d: [{}, 2, 'hi']});
expectAssignable<JsonValue>([{}, {a: 'hi'}, null, 3]);

expectNotAssignable<JsonValue>(new Date());
expectNotAssignable<JsonValue>([new Date()]);
expectNotAssignable<JsonValue>({a: new Date()});
expectNotAssignable<JsonValue>(v);
expectNotAssignable<JsonValue>(x);
expectNotAssignable<JsonValue>(y);
expectNotAssignable<JsonValue>(z);
expectNotAssignable<JsonValue>(w);
expectNotAssignable<JsonValue>(undefined);
expectNotAssignable<JsonValue>(5 as number | undefined);

interface Geometry {
	type: 'Point' | 'Polygon';
	coordinates: [number, number];
}

const point: Geometry = {
	type: 'Point',
	coordinates: [1, 1],
};

expectNotAssignable<JsonValue>(point);
expectAssignable<Jsonify<Geometry>>(point);

// The following const values are examples of values `v` that are not JSON, but are *jsonable* using
// `v.toJSON()` or `JSON.parse(JSON.stringify(v))`
declare const dateToJSON: Jsonify<Date>;
expectAssignable<string>(dateToJSON);
expectAssignable<JsonValue>(dateToJSON);

// The following commented `= JSON.parse(JSON.stringify(x))` is an example of how `parsedStringifiedX` could be created.
// * Note that this would be an unsafe assignment because `JSON.parse()` returns type `any`.
//   But by inspection `JSON.stringify(x)` will use `x.a.toJSON()`. So the `JSON.parse()` result can be
//   assigned to `Jsonify<X>` if the `@typescript-eslint/no-unsafe-assignment` ESLint rule is ignored
//   or an `as Jsonify<X>` is added.
// * This test is not about how `parsedStringifiedX` is created, but about its type, so the `const` value is declared.
declare const parsedStringifiedX: Jsonify<X>; // = JSON.parse(JSON.stringify(x));
expectAssignable<JsonValue>(parsedStringifiedX);
expectAssignable<string>(parsedStringifiedX.a);

class NonJsonWithToJSON {
	public fixture: Map<string, number> = new Map([['a', 1], ['b', 2]]);

	public toJSON(): {fixture: Array<[string, number]>} {
		return {
			fixture: [...this.fixture.entries()],
		};
	}
}
const nonJsonWithToJSON = new NonJsonWithToJSON();
expectNotAssignable<JsonValue>(nonJsonWithToJSON);
expectAssignable<JsonValue>(nonJsonWithToJSON.toJSON());
expectAssignable<Jsonify<NonJsonWithToJSON>>(nonJsonWithToJSON.toJSON());

class NonJsonWithInvalidToJSON {
	public fixture: Map<string, number> = new Map([['a', 1], ['b', 2]]);

	// This is intentionally invalid `.toJSON()`.
	// It is invalid because the result is not assignable to `JsonValue`.
	public toJSON(): {fixture: Map<string, number>} {
		return {
			fixture: this.fixture,
		};
	}
}

const nonJsonWithInvalidToJSON = new NonJsonWithInvalidToJSON();
expectNotAssignable<JsonValue>(nonJsonWithInvalidToJSON);
expectNotAssignable<JsonValue>(nonJsonWithInvalidToJSON.toJSON());

// Not jsonable types; these types behave differently when used as plain values, as members of arrays and as values of objects
declare const undefined: undefined;
expectNotAssignable<JsonValue>(undefined);

declare const fn: (_: any) => void;
expectNotAssignable<JsonValue>(fn);

declare const symbol: symbol;
expectNotAssignable<JsonValue>(symbol);

// Plain values fail JSON.stringify()
declare const plainUndefined: Jsonify<typeof undefined>;
expectType<never>(plainUndefined);

declare const plainFn: Jsonify<typeof fn>;
expectType<never>(plainFn);

declare const plainSymbol: Jsonify<typeof symbol>;
expectType<never>(plainSymbol);

// Array members become null
declare const arrayMemberUndefined: Jsonify<Array<typeof undefined>>;
expectType<null[]>(arrayMemberUndefined);

declare const arrayMemberFn: Jsonify<Array<typeof fn>>;
expectType<null[]>(arrayMemberFn);

declare const arrayMemberSymbol: Jsonify<Array<typeof symbol>>;
expectType<null[]>(arrayMemberSymbol);

// When used in object values, these keys are filtered
declare const objectValueUndefined: Jsonify<{keep: string; undefined: typeof undefined}>;
expectType<{keep: string}>(objectValueUndefined);

declare const objectValueFn: Jsonify<{keep: string; fn: typeof fn}>;
expectType<{keep: string}>(objectValueFn);

declare const objectValueSymbol: Jsonify<{keep: string; symbol: typeof symbol}>;
expectType<{keep: string}>(objectValueSymbol);

// Symbol keys are filtered
declare const objectKeySymbol: Jsonify<{[key: typeof symbol]: number; keep: string}>;
expectType<{keep: string}>(objectKeySymbol);

// Number, String and Boolean values are turned into primitive counterparts
declare const number: Number;
expectNotAssignable<JsonValue>(number);

declare const string: String;
expectNotAssignable<JsonValue>(string);

declare const boolean: Boolean;
expectNotAssignable<JsonValue>(boolean);

declare const numberJson: Jsonify<typeof number>;
expectType<number>(numberJson);

declare const stringJson: Jsonify<typeof string>;
expectType<string>(stringJson);

declare const booleanJson: Jsonify<typeof boolean>;
expectType<boolean>(booleanJson);

declare const tupleJson: Jsonify<[string, Date]>;
expectType<[string, string]>(tupleJson);

declare const tupleRestJson: Jsonify<[string, ...Date[]]>;
expectType<[string, ...string[]]>(tupleRestJson);

// BigInt fails JSON.stringify
declare const bigInt: Jsonify<bigint>;
expectType<never>(bigInt);

declare const int8Array: Int8Array;
declare const int8ArrayJson: Jsonify<typeof int8Array>;
expectType<Record<string, number>>(int8ArrayJson);

declare const map: Map<string, number>;
declare const mapJson: Jsonify<typeof map>;
expectType<{}>(mapJson);

declare const set: Set<string>;
declare const setJson: Jsonify<typeof set>;
expectType<{}>(setJson);

// Positive and negative Infinity, NaN and null are turned into null
// NOTE: NaN is not detectable in TypeScript, so it is not tested; see https://github.com/sindresorhus/type-fest/issues/406
declare const positiveInfinity: PositiveInfinity;
declare const positiveInfJson: Jsonify<typeof positiveInfinity>;
expectType<null>(positiveInfJson);
declare const negativeInf: NegativeInfinity;
declare const negativeInfJson: Jsonify<typeof negativeInf>;
expectType<null>(negativeInfJson);

// Test that optional type members are not discarded wholesale.
interface OptionalPrimitive {
	a?: string;
}

interface OptionalTypeUnion {
	a?: string | (() => any);
}

interface NonOptionalTypeUnion {
	a: string | undefined;
}

declare const jsonifiedOptionalPrimitive: Jsonify<OptionalPrimitive>;
declare const jsonifiedOptionalTypeUnion: Jsonify<OptionalTypeUnion>;
declare const jsonifiedNonOptionalTypeUnion: Jsonify<NonOptionalTypeUnion>;

expectType<{a?: string}>(jsonifiedOptionalPrimitive);
expectType<{}>(jsonifiedOptionalTypeUnion);
expectType<{a?: string}>(jsonifiedNonOptionalTypeUnion);

// Test for 'Jsonify support for optional object keys, unserializable object values' #424
// See https://github.com/sindresorhus/type-fest/issues/424
type AppData = {
	// Should be kept
	requiredString: string;
	requiredUnion: number | boolean;

	// Should be kept and set to optional
	optionalString?: string;
	optionalUnion?: number | string;
	optionalStringUndefined: string | undefined;
	optionalUnionUndefined: number | string | undefined;

	// Should be omitted
	requiredFunction: () => any;
	optionalFunction?: () => any;
	requiredFunctionUnion: string | (() => any);
	optionalFunctionUnion?: string | (() => any);
	optionalFunctionUndefined: (() => any) | undefined;
	optionalFunctionUnionUndefined: string | (() => any) | undefined;
};

type ExpectedAppDataJson = {
	requiredString: string;
	requiredUnion: number | boolean;

	optionalString?: string;
	optionalUnion?: string | number;
	optionalStringUndefined?: string;
	optionalUnionUndefined?: string | number;
};

declare const response: Jsonify<AppData>;

expectType<ExpectedAppDataJson>(response);
