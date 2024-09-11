import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ProfilerProps, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Clipboard,
  ImageStyle,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { InView } from 'react-native-intersection-observer';
import { profileClient } from '@/src/api';
import { CommentClient } from '@/src/api/comment';
import { useAuthState, useSafeAreaInsetsStyle } from '@/src/hooks';
import { useAppStore } from '@/src/store/app';
import { useDetailStore } from '@/src/store/detail';
import { useHistoryStore } from '@/src/store/histroy';
import { reportClick, reportExpo } from '@/src/utils/report';
import { EmptyPlaceHolder } from '@Components/Empty';
import { Avatar } from '@Components/avatar';
import { showConfirm } from '@Components/confirm';
import { Image } from '@Components/image';
import { hideLoading, showLoading } from '@Components/loading';
import { SheetModal } from '@Components/sheet';
import { ConfirmSheetModal } from '@Components/sheet/confirm';
import { showToast } from '@Components/toast';
import { StyleSheet } from '@Utils/StyleSheet';
import * as svg from '@Assets/image/comment/svg';
import { DetailEventBus } from '@/app/detail/eventbus';
import { CommentItem } from '@/proto-registry/src/web/raccoon/comment/comment_pb';
import { UserProfile } from '@/proto-registry/src/web/raccoon/common/profile_pb';
import { PartialMessage } from '@bufbuild/protobuf';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

const ReportIcon = require('@Assets/image/comment/report.png');
const DeleteIcon = require('@Assets/image/comment/delete.png');
const EditIcon = require('@Assets/image/comment/edit.png');

export const FeedbackSheet = (props: {
  userId: string;
  onClose: () => void;
  isVisible: boolean;
}) => {
  const navigation = useNavigation();

  return (
    <SheetModal
      isVisible={props.isVisible}
      onClose={props.onClose}
      remainHeight={0}
      maskShown={true}
      maskOpacity={0.4}
      closeBtn={false}
      dragable={false}
    >
      <View
        style={{
          ...menuStyle.menuContainer
        }}
      >
        <TouchableWithoutFeedback onPress={props.onClose}>
          <View style={menuStyle.menuHeader}>
            <View style={menuStyle.menuHeaderBar}></View>
          </View>
        </TouchableWithoutFeedback>
        <Pressable
          style={[menuStyle.menuItem]}
          onPress={() => {
            showToast('处理成功，对方将无法查看您的作品，也无法与你互动~');
            reportClick('feedback_notsee', { uid: props.userId });
            useHistoryStore.getState().addBlacklist(props.userId);
            router.push('/feed/');

            profileClient.blockUser({
              uid: props.userId
            });
          }}
        >
          <Text>拉黑</Text>
        </Pressable>
        <Pressable
          style={[menuStyle.menuItem]}
          onPress={() => {
            showToast('感谢您的热心反馈，我们将尽快进行举报确认');
            reportClick('feedback_user_report', { uid: props.userId });
            profileClient.reportUser({
              uid: props.userId
            });
          }}
        >
          <Text>举报</Text>
        </Pressable>
        <Pressable
          style={[menuStyle.menuItem, menuStyle.lastMenuItem]}
          onPress={() => {
            showToast('处理成功，您将不会收到此作者的内容推荐');
            reportClick('feedback_user_report', { uid: props.userId });
            useHistoryStore.getState().addBlacklist(props.userId);
            profileClient.blockUserWorks({
              uid: props.userId
            });
            router.push('/feed/');
          }}
        >
          <Text>不喜欢该作者</Text>
        </Pressable>
      </View>
    </SheetModal>
  );
};

// styles
const listStyle = StyleSheet.create({
  container: {
    paddingTop: 20
  },
  loadingContainer: {
    width: '100%',
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyContainer: {
    width: '100%',
    height: 250,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyIcon: {
    width: 120,
    height: 120
  },
  emptyTextRow: {
    marginTop: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.4)'
  },
  emptyHighlight: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(246, 135, 20, 1)'
  }
});

const itemStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 17
  },
  avatarContainer: {
    flex: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    // backgroundColor: '#ccc',
    marginRight: 10
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 16,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderBottomWidth: 0.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  left: {
    flex: 1
  },
  right: {
    width: 45,
    flex: 0
  },
  likeContainer: {
    width: 45,
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 16
  },
  likeText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: 2
  },
  exposureTrigger: {
    height: 1,
    backgroundColor: 'transparent'
  }
});

const contentStyle = StyleSheet.create({
  left: {
    flex: 1
  },
  right: {
    flex: 0,
    width: 45
  },

  // 标题区域
  titleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  authorName: {
    width: 'auto'
  },
  authorNameText: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: 'rgba(0, 0, 0, 0.4)'
  },
  titleIsAuthor: {
    flex: 0,
    height: 16,
    borderRadius: 100,
    backgroundColor: '#FFD8CB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 6,
    alignSelf: 'flex-start'
  },
  titleIsAuthorText: {
    color: '#FF6A3B',
    fontSize: 9,
    fontWeight: '500'
  },
  titleIsAuthorLiked: {
    height: 16,
    borderRadius: 100,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 6,
    paddingRight: 6,
    marginTop: 6,
    alignSelf: 'flex-start'
  },
  titleIsAuthorLikedText: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 9,
    lineHeight: 15,
    fontWeight: '500'
  },

  // 内容区域
  mainContainer: {},
  content: {},
  contentText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(0, 0, 0, 0.87)'
  },
  footerContainer: {},
  createTime: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: 6
  }
});

const menuStyle = StyleSheet.create({
  menuContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: 'auto',
    zIndex: 100
  },
  menuHeader: {
    width: '100%',
    height: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuHeaderBar: {
    width: 30,
    height: 4,
    borderRadius: 100,
    backgroundColor: '#EAEAEA'
  },
  menuItem: {
    width: '100%',
    height: 60,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lastMenuItem: {
    borderBottomWidth: 0
  },
  menuItemInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60
  },
  iconSize: {
    width: 20,
    height: 20
  }
});
