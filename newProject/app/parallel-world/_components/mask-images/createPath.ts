import { Path, PathProps, Svg } from 'react-native-svg';

/**
 * x1  x2
 * x4  x3
 */
export interface IPoint {
  x: number;
  y: number;
}
export function Point(x: number, y: number): IPoint {
  return { x, y };
}

export function stringifyPoint(point: IPoint) {
  return `${point.x} ${point.y}`;
}

const createStartPoint = (p: IPoint) => `M ${stringifyPoint(p)}`;
const createAnchorPoint = (p: IPoint) => `L ${stringifyPoint(p)}`;
const createEndPoint = () => 'Z';

export function createPath(startPoint: IPoint, ...others: IPoint[]) {
  return [createStartPoint(startPoint)]
    .concat(others.map(p => createAnchorPoint(p)))
    .concat(createEndPoint())
    .join(' ');
}
