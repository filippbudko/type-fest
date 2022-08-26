import {expectAssignable, expectNotType, expectType} from 'tsd';
import type {TupleToUnion} from '../index';

const options = ['a', 'b', 'c'] as const;
type Options = TupleToUnion<typeof options>;

const a: Options = 'a';
expectAssignable<Options>(a);
expectType<'a'>(a);
expectNotType<'b'>(a);
expectNotType<'c'>(a);

const b: Options = 'b';
expectAssignable<Options>(b);
expectNotType<'a'>(b);
expectType<'b'>(b);
expectNotType<'c'>(b);

const c: Options = 'c';
expectAssignable<Options>(c);
expectNotType<'a'>(c);
expectNotType<'b'>(c);
expectType<'c'>(c);

declare const notAnArray: TupleToUnion<[]>;
expectType<never>(notAnArray);
