import { MethodKind } from '@bufbuild/protobuf';
import { Empty } from '@bufbuild/protobuf';
import {
  AuthBindReq,
  AuthBindRes,
  ErrorRes,
  HeartbeatReq,
  HeartbeatRes,
  LogoutReq,
  StreamMsg
} from '@step.ai/proto-gen/raccoon/gateway/stream_pb';

/**
 * @generated from service step.raccoon.gateway.Stream
 */
export const Stream = {
  typeName: 'step.raccoon.gateway.Stream',
  methods: {
    auth: {
      name: 'Auth',
      I: AuthBindReq,
      O: AuthBindRes,
      kind: MethodKind.Unary
    },
    logout: {
      name: 'Logout',
      I: LogoutReq,
      O: Empty,
      kind: MethodKind.Unary
    },
    heartbeat: {
      name: 'Heartbeat',
      I: HeartbeatReq,
      O: HeartbeatRes,
      kind: MethodKind.Unary
    },
    /**
     * @generated from rpc step.raccoon.gateway.Stream.Process
     */
    process: {
      name: 'Process',
      I: StreamMsg,
      O: StreamMsg,
      kind: MethodKind.BiDiStreaming
    }
  }
};

export {
  ErrorRes,
  StreamMsg,
  AuthBindReq,
  AuthBindRes,
  HeartbeatReq,
  HeartbeatRes,
  LogoutReq
};
