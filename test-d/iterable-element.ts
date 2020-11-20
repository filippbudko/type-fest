import {IterableElement} from '../source/iterable-element';
import {expectType} from 'tsd';

declare const iterableElement: IterableElement<ReturnType<typeof secretGenerator>>;
expectType<1 | 'two'>(iterableElement);

declare const iterableElementAsync: IterableElement<ReturnType<typeof secretGeneratorAsync>>;
expectType<true | Date>(iterableElementAsync);

function * secretGenerator() {
	yield 1;
	yield 'two';
}

async function * secretGeneratorAsync() {
	yield true;
	yield new Date();
}
