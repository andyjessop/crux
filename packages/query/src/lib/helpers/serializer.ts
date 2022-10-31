export const serialize = (prop: unknown) => JSON.stringify(prop);

export const deserialize = (str: string) => JSON.parse(str);
