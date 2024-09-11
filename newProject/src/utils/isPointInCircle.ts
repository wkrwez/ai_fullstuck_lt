export interface Point {
    x: number,
    y: number
}

export function isPointInCircle(point: Point, center: Point, radius: number) {
    const distanceSquared = (point.x - center.x) ** 2 + (point.y - center.y) ** 2;
    return distanceSquared <= radius ** 2
}