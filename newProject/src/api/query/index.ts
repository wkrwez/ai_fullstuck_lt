import { createSocketConnect } from '../websocket/connect';
import type { PartialMessage } from '@bufbuild/protobuf';
import { Query } from '@step.ai/proto-gen/raccoon/query/query_connect';
import {
  CardSocialInfoRequest,
  DeleteCardReq,
  UserCreatedCardsRequest,
  UserLikedCardsRequest,
  UserSocialInfoRequest,
  UserSocialInfoResponse
} from '@step.ai/proto-gen/raccoon/query/query_pb';

const queryClient = createSocketConnect('Query', Query);

export const GetPageCommonInfo = (
  payload: PartialMessage<CardSocialInfoRequest>
) => {
  return queryClient.cardSocialInfo(payload);
};

export const GetUserCommonInfo = (
  payload: PartialMessage<UserSocialInfoRequest>
) => {
  return queryClient.userSocialInfo(payload);
};

export const GetUserCreatedCards = (
  payload: PartialMessage<UserCreatedCardsRequest>
) => {
  return queryClient.userCreatedCards(payload);
};

export const GetUserLikesCards = (
  payload: PartialMessage<UserLikedCardsRequest>
) => {
  return queryClient.userLikesCards(payload);
};

export const DeleteDetail = (payload: PartialMessage<DeleteCardReq>) => {
  return queryClient.deleteCard(payload);
};
