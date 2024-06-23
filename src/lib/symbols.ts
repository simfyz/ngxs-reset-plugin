import { isDevMode } from '@angular/core';
import { ɵgetStoreMetadata as getStoreMetadata } from '@ngxs/store/internals';
import { MetaDataModel, StateClass } from './internals';

export type OverwriteTuple = [StateClass, any];
type MetaTuple = [MetaDataModel[], any[]];
type MetaListReducer = (
  acc: MetaDataModel[],
  state: StateClass,
) => MetaDataModel[];
type MetaTupleReducer = (
  acc: MetaTuple,
  [state, value]: OverwriteTuple,
) => MetaTuple;

/**
 * Action to clear all state except given state(s)
 */
export class StateClear {
  static readonly type = '@@CLEAR_STATE';
  public readonly statesToKeep: MetaDataModel[];

  // The duplication is necessary for TypeScript
  constructor(...statesToKeep: StateClass[]);
  constructor();
  constructor(...statesToKeep: StateClass[]) {
    const reducer = createMetaDataListReducer(isDevMode());
    this.statesToKeep = statesToKeep.reduce<MetaDataModel[]>(reducer, []);
  }
}

/**
 * Action to reset given state(s) to defaults
 */
export class StateReset {
  static readonly type = '@@RESET_STATE';
  public readonly statesToReset: MetaDataModel[];
  constructor(...statesToReset: StateClass[]) {
    const reducer = createMetaDataListReducer(isDevMode());
    this.statesToReset = statesToReset.reduce<MetaDataModel[]>(reducer, []);
  }
}

/**
 * Action to reset all states expect given state(s) to defaults
 */
export class StateResetAll {
  static readonly type = '@@RESET_STATE_ALL';
  public readonly statesToKeep: MetaDataModel[];

  // The duplication is necessary for TypeScript
  constructor(...statesToKeep: StateClass[]);
  constructor();
  constructor(...statesToKeep: StateClass[]) {
    const reducer = createMetaDataListReducer(isDevMode());
    this.statesToKeep = statesToKeep.reduce<MetaDataModel[]>(reducer, []);
  }
}

/**
 * Action to overwrite state(s) with given value(s)
 */
export class StateOverwrite {
  static readonly type = '@@OVERWRITE_STATE';
  public readonly statesToOverwrite: MetaDataModel[];
  public readonly values: any[];
  constructor(...overwriteConfigs: OverwriteTuple[]) {
    const reducer = createMetaTupleReducer(isDevMode());
    const [states, values] = overwriteConfigs.reduce<MetaTuple>(reducer, [
      [],
      [],
    ]);

    this.statesToOverwrite = states;
    this.values = values;
  }
}

export function getMetaData(
  state: StateClass,
  devMode: number,
): MetaDataModel | null {
  const meta = new Object(getStoreMetadata(state as any)) as MetaDataModel;
  const isNgxsMeta = meta.name && 'defaults' in meta;

  // Reusability Hack: devMode is number on purpose
  if (!isNgxsMeta && devMode === -2) {
    console.warn(`Reset Plugin Warning: ${meta.name} is not a state class.`);
    return null;
  }

  return meta;
}

function createMetaDataListReducer(devMode: boolean): MetaListReducer {
  return (acc: MetaDataModel[], state: StateClass): MetaDataModel[] => {
    // eslint-disable-next-line no-bitwise
    const meta = getMetaData(state, ~devMode);

    return meta ? acc.concat(meta) : acc;
  };
}

function createMetaTupleReducer(devMode: boolean): MetaTupleReducer {
  return (acc: MetaTuple, [state, value]: OverwriteTuple): MetaTuple => {
    // eslint-disable-next-line no-bitwise
    const meta = getMetaData(state, ~devMode);

    return meta ? [acc[0].concat(meta), acc[1].concat(value)] : acc;
  };
}
