import { createSocketConnect } from '../websocket/connect';
import { Login } from '@/proto-registry/src/web/raccoon/points/login_connect';
import { Points } from '@/proto-registry/src/web/raccoon/points/points_connect';

export const pointsClient = createSocketConnect('Points', Points);
export const pointsLoginClient = createSocketConnect('Login', Login);

export const getTotalPoints = async () => {
  const res = await pointsClient.getTotalPoints({});
  return res.points;
};

export const getCreditByCrossDay = async () => {
  const res = pointsLoginClient.acquireLoginPoints();
  return res.points;
};
