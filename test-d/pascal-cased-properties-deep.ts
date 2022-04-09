import {expectType} from 'tsd';
import type {PascalCasedPropertiesDeep} from '../index';

declare const foo: PascalCasedPropertiesDeep<{helloWorld: {fooBar: string}}>;
expectType<{HelloWorld: {FooBar: string}}>(foo);

declare const fooBar: PascalCasedPropertiesDeep<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const bar: PascalCasedPropertiesDeep<Set<{fooBar: string}>>;
expectType<Set<{FooBar: string}>>(bar);

// Verify example
interface User {
	userId: number;
	userName: string;
	date: Date;
	regExp: RegExp;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: PascalCasedPropertiesDeep<UserWithFriends> = {
	UserInfo: {
		UserId: 1,
		UserName: 'Tom',
		Date: new Date(),
		RegExp: new RegExp(/.*/),
	},
	UserFriends: [
		{
			UserId: 2,
			UserName: 'Jerry',
			Date: new Date(),
			RegExp: new RegExp(/.*/),
		},
		{
			UserId: 3,
			UserName: 'Spike',
			Date: new Date(),
			RegExp: new RegExp(/.*/),
		},
	],
};
expectType<PascalCasedPropertiesDeep<UserWithFriends>>(result);
