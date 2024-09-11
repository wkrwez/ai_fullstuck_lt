import React from 'react';
import { View } from 'react-native';
import {
  Icon,
  IconProps,
  hideLoading,
  showConfirm,
  showLoading,
  showToast
} from '@/src/components';
import { selectState } from '@/src/store/_utils';
import { useAppStore } from '@/src/store/app';
import { useParallelWorldConsumerStore } from '@/src/store/parallel-world-consumer';
import { colors } from '@/src/theme';
import { CommonColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { $flexHCenter } from '@/src/theme/variable';
import { reportClick, reportExpo } from '@/src/utils/report';
import { Text } from '@Components/text';
import { BUTTON_HEIGHT } from '../../_constants';
import { REVIEW_ERR_ENUM, toastErr } from '../../_utils/error-msg';
import ParallelWorldButton from '../others/parallel-world-button';
import { WorldAct } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { useShallow } from 'zustand/react/shallow';

const editBtnText: {
  [key: string]: { text: '编辑' | '保存' | '撤销'; icon: IconProps['icon'] };
} = {
  edit: {
    text: '编辑',
    icon: 'icon_edit_pw'
  },
  save: {
    text: '保存',
    icon: 'icon_save_pw'
  },
  cancel: {
    text: '撤销',
    icon: 'cancel'
  }
};

export default function ConsumerHeaderRight() {
  const {
    isGenCardEditable,
    toggleIsGenCardEditable,
    isNextChapterModalVisible,
    acts,
    editableActs,
    changeActs,
    changeEditableActs,
    updateActs,
    newTimeLine,
    activeTimelineSectionIdx,
    newWorld
  } = useParallelWorldConsumerStore(
    useShallow(state =>
      selectState(state, [
        'isGenCardEditable',
        'toggleIsGenCardEditable',
        'isNextChapterModalVisible',
        'acts',
        'editableActs',
        'changeActs',
        'changeEditableActs',
        'updateActs',
        'newTimeLine',
        'activeTimelineSectionIdx',
        'newWorld'
      ])
    )
  );

  const { user } = useAppStore(
    useShallow(state => ({
      user: state.user
    }))
  );

  if (
    isNextChapterModalVisible ||
    user?.uid !== newTimeLine[activeTimelineSectionIdx]?.author?.uid
  ) {
    return null;
  }

  const handleEdit = () => {
    toggleIsGenCardEditable(!isGenCardEditable);
    changeEditableActs([...acts]);
    reportClick('new_content_preview', {
      contentid: newWorld?.cardId,
      new_content_button: 1
    });
    reportExpo('world_editing', { contentid: newWorld?.cardId });
  };

  const handleSave = async () => {
    let timer = null;
    try {
      showLoading('正在保存');
      let isFinished = false;
      // 暂时解决保存失败的问题
      timer = setTimeout(() => {
        if (!isFinished) {
          hideLoading();
          showToast('保存失败!');
        }
      }, 15000);
      const res = await updateActs({
        acts: editableActs as WorldAct[],
        plotId: newTimeLine[activeTimelineSectionIdx]?.plotId,
        cardId: newWorld?.cardId as string
      });
      if (res) {
        isFinished = true;
        showToast('保存成功');
        clearTimeout(timer);
        // 更新acts
        changeActs([...(editableActs as WorldAct[])]);
        // 清空编辑态
        toggleIsGenCardEditable(!isGenCardEditable);
        changeEditableActs([]);
      }

      reportClick('new_content_preview', {
        contentid: newWorld?.cardId,
        new_content_button: 4
      });
    } catch (e) {
      toastErr(e, REVIEW_ERR_ENUM.PLOT_CHANGE);
      timer && clearTimeout(timer);
    } finally {
      hideLoading();
      timer && clearTimeout(timer);
    }
  };

  const handleCancel = () => {
    showConfirm({
      theme: Theme.DARK,
      title: '当前创作未保存，\n是否自动保存？',
      confirmText: '保存',
      confirmTextStyle: { color: CommonColor.brand1 },
      cancelText: '暂不',
      onConfirm: async ({ close }) => {
        await handleSave();
        close();
      },
      onClose() {
        console.log('----------->onClose');
        // 清空编辑态
        toggleIsGenCardEditable(!isGenCardEditable);
        changeEditableActs([]);
      }
    });

    reportClick('new_content_preview', {
      contentid: newWorld?.cardId,
      new_content_button: 5
    });
  };

  return (
    <View style={{ ...$flexHCenter, gap: 14 }}>
      {isGenCardEditable ? (
        <>
          <ParallelWorldButton
            style={{
              backgroundColor: 'transparent',
              paddingHorizontal: 0
            }}
            onPress={handleCancel}
          >
            <Icon icon={editBtnText.cancel.icon} size={16}></Icon>
            <Text
              style={{
                lineHeight: BUTTON_HEIGHT,
                marginLeft: 4,
                fontWeight: '500',
                fontSize: 16,
                color: colors.white
              }}
            >
              {editBtnText.cancel.text}
            </Text>
          </ParallelWorldButton>
          <ParallelWorldButton
            style={{
              backgroundColor: 'transparent',
              paddingHorizontal: 0
            }}
            onPress={handleSave}
          >
            <Icon icon={editBtnText.save.icon} size={16}></Icon>
            <Text
              style={{
                lineHeight: BUTTON_HEIGHT,
                marginLeft: 4,
                fontWeight: '500',
                fontSize: 16,
                color: colors.white
              }}
            >
              {editBtnText.save.text}
            </Text>
          </ParallelWorldButton>
        </>
      ) : (
        <>
          <ParallelWorldButton
            style={{
              backgroundColor: 'transparent',
              paddingHorizontal: 0
            }}
            onPress={handleEdit}
          >
            <Icon icon={editBtnText.edit.icon} size={16}></Icon>
            <Text
              style={{
                lineHeight: BUTTON_HEIGHT,
                marginLeft: 4,
                fontWeight: '500',
                fontSize: 16,
                color: colors.white
              }}
            >
              {editBtnText.edit.text}
            </Text>
          </ParallelWorldButton>
        </>
      )}
    </View>
  );
}
