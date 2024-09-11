import { limit } from '@Utils/number'
export const findClosestNumber = (arr: number[], target: number, min: number, max: number) => {
    let closest = arr[0];
    let minDiff = Math.abs(closest - target);

    let index = 0
    for (let i = 1; i < arr.length; i++) {
        const currentDiff = Math.abs(arr[i] - target);
        if (currentDiff < minDiff) {
            closest = arr[i];
            index = i
            minDiff = currentDiff;
        }
    }

    return arr[limit(index, min, max)]
    // return closest;
}

export const radians = (degrees: number) => {
    return degrees * (Math.PI / 180);
}
