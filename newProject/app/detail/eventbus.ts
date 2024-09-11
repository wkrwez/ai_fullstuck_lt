import { Event } from '@/src/utils/event';

// todo 临时先挪到这儿，不然会循环依赖 后面换其它方式
export const DetailEventBus = new Event();
