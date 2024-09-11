// 异步任务
import { create } from 'zustand';
import { GameTypes, TaskItem, TaskState } from '../types';
import { GetPhotoTask } from '@/src/api/makephoto' // 生图
import { PhotoTaskState, GetPhotoTaskRequest, PhotoProgress, PhotoTask } from '@step.ai/proto-gen/raccoon/makephoto/makephoto_pb';

type States = {
    makePhoto: TaskItem<PhotoTask> | null
};

type Actions = {
    init: () => void
    cleanUp: () => void
    changeTaskState: (taskName: GameTypes, state: TaskState) => void
    getTaskState: () => void
    getPhotoTask: () => void // 生图任务
};

const resetState = (): States => {
    return {
        makePhoto: {
            state: TaskState.initial,
        }
    };
};

export const useTaskStore = create<States & Actions>()((set, get) => ({
    // const gotoLogin = () => {
    // get().cleanUp();
    // router.replace('/login/login');
    // };
    ...resetState(),
    cleanUp() {
        set({
            ...resetState(),
        });
    },
    // setUser(user) {
    //   set({ user });
    // },
    changeTaskState(taskName, state) {
        const currentTask = get()[taskName]
        set({
            [taskName]: {
                ...(currentTask || {}),
                state
            }
        })
    },
    async getTaskState() {
        // const updateInfo = await appInfoClient.checkUpdate({});
        // if (updateInfo) {
        //   get().setUpdateInfo(updateInfo);
        // }
        // return updateInfo;
    },
    init() {
        get().getPhotoTask();
    },
    getPhotoTask() { // 获取生图任务
        GetPhotoTask(new GetPhotoTaskRequest({}), (res) => {
            console.log('GetPhotoTask', res)
            if (!res) {
                set({
                    makePhoto: {
                        state: TaskState.initial,
                    }
                })
                return
            }

            const { error, state, data } = res;
            if (error) {
                set({
                    makePhoto: {
                        state: TaskState.initial,
                        error
                    }
                })
                return
            }


            if (state === TaskState.completed) {
                // todo:特殊兼容
                const hasProgress = data?.progess?.length;
                console.log('hasProgress----', hasProgress)
                if (!hasProgress) {
                    set({
                        makePhoto: {
                            state: TaskState.initial
                        }
                    })
                    return;
                } else {
                    set({
                        makePhoto: {
                            state: TaskState.completed,
                            data: data
                        }
                    })
                }
            }
        })
    }
}));
