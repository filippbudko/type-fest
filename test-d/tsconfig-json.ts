import {expectType, expectAssignable} from 'tsd';
import type {TsConfigJson} from '../index';

const tsConfig: TsConfigJson = {};

expectType<boolean | undefined>(tsConfig.compileOnSave);
expectType<TsConfigJson.CompilerOptions | undefined>(tsConfig.compilerOptions);
expectType<string[] | undefined>(tsConfig.exclude);
expectType<string | undefined>(tsConfig.extends);
expectType<string[] | undefined>(tsConfig.files);
expectType<string[] | undefined>(tsConfig.include);
expectType<TsConfigJson.References[] | undefined>(tsConfig.references);
expectType<TsConfigJson.TypeAcquisition | undefined>(tsConfig.typeAcquisition);

// Undefined assigns
expectAssignable<NonNullable<typeof tsConfig['compilerOptions']>['paths']>({path: undefined});
