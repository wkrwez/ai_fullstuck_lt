// import { setCustomTimeout } from './setTimeOut'

export function sleep(ms: number) {
    return new Promise<undefined>((r) => {
        setTimeout(() => {
            r(undefined);
        }, ms);
    });
}
