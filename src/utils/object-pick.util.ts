export function objectPick(value: object, keys: string[]) {
    return keys.reduce((acc, key) => {
        if (key in value) {
            // @ts-ignore: index access
            acc[key] = value[key];
        }
        return acc;
    }, {} as Record<string, unknown>);
}
