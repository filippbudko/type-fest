import {expectType} from 'tsd';
import {LiteralToPrimitive} from '../index';

// Simple usage
declare const numberPrimitive: LiteralToPrimitive<123>;
expectType<number>(numberPrimitive);

const symbol = Symbol('foo');

// Union
declare const kitchenSink: LiteralToPrimitive<123 | 123n | 'hello' | true | undefined | typeof symbol | null | {key: string}>;
expectType<number | bigint | string | boolean | undefined | symbol | null>(kitchenSink);
