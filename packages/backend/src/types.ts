// https://github.com/microsoft/TypeScript/issues/13923
export type Immutable<T> = T extends ImmutablePrimitive
  ? T
  : T extends Array<infer U>
  ? ImmutableArray<U>
  : T extends Map<infer K, infer V>
  ? ImmutableMap<K, V>
  : T extends Set<infer M>
  ? ImmutableSet<M>
  : ImmutableObject<T>;
type ImmutablePrimitive = undefined | null | boolean | string | number;
type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;
type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type SerializableBase = boolean | string | number | null | undefined;
export type SerializableArray = (SerializableBase | Serializable)[];
export type Serializable = {
  [k: string]: SerializableBase | Serializable | SerializableArray;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnwrapFunction<T> = T extends () => any ? ReturnType<T> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PossibleFunction<T> = T extends () => any
  ? T | UnwrapFunction<T>
  : T | (() => T);

export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  rateSymbol: string;
  address: string;
  chainId: number;
};
