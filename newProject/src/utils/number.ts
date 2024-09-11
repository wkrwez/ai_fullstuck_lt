export const limit = (current: number, min: number, max: number) => {
    if (!current) return 0
    if (min === -1) { // 无最小值
        return Math.min(current, max)
    }
    if (max === -1) { // 无最大值
        return Math.max(current, min)
    }

    return Math.max(Math.min(current, max), min)
}