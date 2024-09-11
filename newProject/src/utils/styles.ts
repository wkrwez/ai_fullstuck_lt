
export function styles(...args: any[]) {
    return args.reduce((res, item) => {
        if (item) {
            return { ...res, ...item }
        }
        return res
    }, {})
}