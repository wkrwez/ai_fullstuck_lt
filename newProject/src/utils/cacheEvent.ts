type CacheStatusType = {
    [key in string]: unknown
}
type WatchListType = {
    [key in string]: ((() => void))[]
}
export class CacheEvent {
    eventList = []
    eventKeys: CacheStatusType = {}
    watchList: WatchListType = {}

    cacheStatus: CacheStatusType = {}

    once(key: string) {
        if (!this.cacheStatus[key]) {
            this.cacheStatus[key] = 1
            return true
        }
        return false
    }

    set(key: string, data: unknown) {
        this.cacheStatus[key] = data
    }

    get(key: string) {
        return this.cacheStatus[key]
    }

    do(cb: () => void, cond: string[], cache: boolean = true) {
        const canDo = (cond && cond.every(i => this.eventKeys[i])) || (!cond)
        if (!canDo) {
            if (cache) {
                cond.forEach(key => {
                    if (!this.watchList[key]) {
                        this.watchList[key] = []
                    }
                    this.watchList[key].push(() => this.do(cb, cond, false))
                })
            }
        } else {
            cb()
        }
    }
    complete(key: string) {
        this.eventKeys[key] = 1
        if (this.watchList[key]) {
            this.watchList[key].forEach(e => e())
            this.watchList[key] = []
        }
    }
}