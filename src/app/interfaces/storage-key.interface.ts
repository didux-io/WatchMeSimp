export interface IStorageKey {
    key: string;
    subKeys: (string | IStorageKey)[];
}
