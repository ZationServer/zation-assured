/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Channel, Client, Databox, Response} from "zation-client";

export type ClientAPI<T extends Client<any,any>> = T extends Client<infer API,any> ? API : never;
export type ClientTokenPayload<T extends Client<any,any>> = T extends Client<any,infer TP> ? TP : never;

export type ResponseData<T extends Response<any>> = T extends Response<infer D> ? D : never;

export type DataboxData<T extends Databox<any,any,any,any>> = T extends Databox<infer D,any,any,any> ? D : never;
export type DataboxMember<T extends Databox<any,any,any,any>> = T extends Databox<any,infer M,any,any> ? M : never;
export type DataboxFetchData<T extends Databox<any,any,any,any>> = T extends Databox<any,any,any,infer F> ? F : never;

export type ChannelMember<T extends Channel<any,any>> = T extends Channel<infer M,any> ? M : never;
export type ChannelEvents<T extends Channel<any,any>> = T extends Channel<any,infer E> ? E : never;

export type Primitive = undefined | null | boolean | string | number | Function;

export declare type DeepReadonly<T> = T extends Primitive ? T : T extends Array<infer U> ? DeepReadonlyArray<U> : T extends Map<infer K, infer V> ? DeepReadonlyMap<K, V> : DeepReadonlyObject<T>;
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}
interface DeepReadonlyMap<K, V> extends ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> {
}
declare type DeepReadonlyObject<T> = {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
};

export type Default<T,D> = T extends undefined ? D : T;