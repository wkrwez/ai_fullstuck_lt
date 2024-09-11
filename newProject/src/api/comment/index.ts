import { createSocketConnect } from '../websocket/connect';
import { Comment } from '@/proto-registry/src/web/raccoon/comment/comment_connect';

export const CommentClient = createSocketConnect('Comment', Comment);
