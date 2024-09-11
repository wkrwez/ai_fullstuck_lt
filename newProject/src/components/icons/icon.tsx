import * as React from 'react';
import {
  ColorValue,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native';
import { colorsUI } from '@/src/theme';
import { Image, ImageStyle } from '@Components/image';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

export type IconTypes = keyof typeof iconRegistry;

const sizeMap: Record<string, { containerSize: number; size: number }> = {
  xs: {
    size: 16,
    containerSize: 24
  },
  sm: {
    size: 20,
    containerSize: 32
  },
  md: {
    size: 24,
    containerSize: 40
  },
  lg: {
    size: 32,
    containerSize: 52
  }
};

export type sizeKeys = keyof typeof sizeMap;

export interface IconProps extends TouchableOpacityProps {
  icon: IconTypes;

  preset?: 'circle' | 'default';

  color?: ColorValue;

  size?: number | sizeKeys;

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>;

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>;

  onPress?: TouchableOpacityProps['onPress'];
}
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size = 24,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    preset = 'default',
    ...WrapperProps
  } = props;

  const isPressable = !!WrapperProps.onPress;
  const Wrapper = WrapperProps.onPress
    ? TouchableOpacity
    : (View as React.ComponentType<TouchableOpacityProps>);

  let iconSize = 24;
  let containerSize = 0;
  if (typeof size !== 'number') {
    iconSize = sizeMap[size].size;
    containerSize = sizeMap[size].containerSize;
  } else {
    iconSize = size;
    containerSize =
      iconSize + (typeof props.hitSlop === 'number' ? props.hitSlop : 16);
  }

  return (
    <Wrapper
      accessibilityRole={isPressable ? 'imagebutton' : undefined}
      {...WrapperProps}
      style={[
        preset === 'circle' && {
          backgroundColor: color || colorsUI.Text.brand.brand,
          width: containerSize,
          height: containerSize,
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: containerSize / 2
        },
        $containerStyleOverride
      ]}
    >
      <Image
        transition={null}
        style={[
          $imageStyle,
          { tintColor: preset === 'circle' ? '#fff' : color },
          iconSize ? { width: iconSize, height: iconSize } : {},
          $imageStyleOverride
        ]}
        source={iconRegistry[icon]}
      />
    </Wrapper>
  );
}

export const iconRegistry = {
  back: require('@Assets/icon/back.png'),
  fail_fill: require('@Assets/icon/fail-fill.png'),
  choose_fill: require('@Assets/icon/choose-fill.png'),
  choose_unfill: require('@Assets/icon/choose-unfill.png'),
  // menu_outline: require("@Assets/icon/menu_outline.png"),
  close_outline: require('@Assets/icon/close_outline.png'),
  // addbubble_outline: require("@Assets/icon/addbubble_outline.png"),
  // arrow_right_light: require("@Assets/icon/arrow_right_light.png"),
  // chat: require("@Assets/icon/chat.png"),
  // more: require("@Assets/icon/more.png"),
  // fileupload_outline: require("@Assets/icon/fileupload-outline.png"),
  // image_outline: require("@Assets/icon/image-outline.png"),
  up_arrow: require('@Assets/icon/icon-uparrow.png'),
  delete: require('@Assets/icon/delete.png'),
  delete_image: require('@Assets/icon/icon-delete-image.png'),
  delete_historySearch: require('@Assets/image/search/search-delete-history.png'),
  credit_minus: require('@Assets/icon/credit/credit-minus.png'),
  credit_plus: require('@Assets/icon/credit/credit-plus.png'),
  gray_lightning: require('@Assets/icon/credit/gray-lightning.png'),
  green_lightning: require('@Assets/icon/credit/green-lightning.png'),
  lock: require('@Assets/icon/credit/lock.png'),
  setting_account: require('@Assets/icon/setting_account.png'),
  setting_feedback: require('@Assets/icon/setting_feedback.png'),
  setting_share: require('@Assets/icon/setting_share.png'),
  setting_about: require('@Assets/icon/setting_about.png'),
  setting_arrow_right: require('@Assets/icon/setting_arrow_right.png'),
  right_outline: require('@Assets/icon/right_outline.png'),
  share: require('@Assets/icon/icon-share.png'),
  drop: require('@Assets/icon/icon-drop.png'),
  takephoto: require('@Assets/icon/icon-takephoto.png'),
  takephoto_primary: require('@Assets/icon/icon-takephoto-primary.png'),
  close: require('@Assets/icon/icon-close.png'),
  close2: require('@Assets/icon/icon-close2.png'),
  close3: require('@Assets/image/search/search-close-history.png'),
  logo: require('@Assets/icon/icon-logo.png'),
  heart: require('@Assets/icon/icon-heart.png'),
  comment: require('@Assets/icon/icon-comment.png'),
  setting: require('@Assets/icon/icon-setting.png'),
  edit: require('@Assets/icon/icon-edit.png'),
  security: require('@Assets/icon/icon-security.png'),
  complain: require('@Assets/icon/icon-complain.png'),
  about: require('@Assets/icon/icon-about.png'),
  signoff: require('@Assets/icon/icon-signoff.png'),
  drop2: require('@Assets/icon/icon-drop2.png'),
  // report: require('@Assets/image/comment/report.png'),
  input_clear: require('@Assets/icon/icon-input_clear.png'),
  share_close: require('@Assets/icon/icon-share-close.png'),
  download_btn: require('@Assets/icon/icon-download.png'),
  publish: require('@Assets/icon/icon-publish.png'),
  reply_btn: require('@Assets/icon/message/icon-reply.png'),
  like_btn: require('@Assets/icon/message/icon-like-btn.png'),
  choose_like: require('@Assets/icon/message/icon-choose-like.png'),
  onclik_like: require('@Assets/icon/message/icon-on-like.png'),
  same_state: require('@Assets/icon/message/icon-same.png'),
  attention_state: require('@Assets/icon/message/icon-attention.png'),
  like_state: require('@Assets/icon/message/icon-like-btn.png'),
  arrow_icon: require('@Assets/icon/arrow-icon.png'),

  message_state: require('@Assets/icon/message/icon-message.png'),
  xl_hand: require('@Assets/icon/xl_hand.png'),
  load_point: require('@Assets/icon/icon-load.png'),
  makephoto_drop: require('@Assets/icon/makephoto/icon-drop.png'),
  makephoto_roll: require('@Assets/icon/makephoto/icon-roll.png'),
  makephoto_add: require('@Assets/icon/makephoto/icon-add.png'),
  makephoto_remove: require('@Assets/icon/makephoto/icon-remove.png'),
  makephoto_refresh: require('@Assets/icon/makephoto/icon-refresh.png'),
  makephoto_add_full: require('@Assets/icon/makephoto/icon-add-full.png'),
  makephoto_checked: require('@Assets/icon/makephoto/icon-checked.png'),
  makephoto_edit: require('@Assets/icon/makephoto/icon-tag-edit.png'),
  makephoto_retry: require('@Assets/icon/makephoto/icon-retry.png'),
  makephoto_preview_add: require('@Assets/icon/makephoto/icon-add.png'),
  makephoto_adduser: require('@Assets/icon/makephoto/icon-addrole.png'),
  makephoto_editred: require('@Assets/icon/makephoto/icon-edit-red.png'),
  makephoto_up: require('@Assets/icon/makephoto/icon-up.png'),
  makephoto_remove2: require('@Assets/icon/makephoto/icon-remove-dark.png'),
  makephoto_download: require('@Assets/icon/makephoto/icon-download.png'),
  makephoto_rolling: require('@Assets/icon/makephoto/icon-rolling.png'),
  makephoto_submit: require('@Assets/icon/makephoto/icon-submit.png'),
  makephoto_delete: require('@Assets/icon/makephoto/icon-delete.png'),
  // chevronup_outline: require("@Assets/icon/chevronup-outline.png"),
  // link_outline: require("@Assets/icon/link-outline.png"),
  // chevrondown_outline: require("@Assets/icon/chevrondown-outline.png"),
  // websearch_color: require("@Assets/icon/color/websearch-color.png"),
  // code_color: require("@Assets/icon/color/code-color.png"),
  // warn_fill: require("@Assets/icon/color/warn-fill.png"),
  // file_outline: require("@Assets/icon/file-outline.png"),
  // dot: require("@Assets/icon/dot.png"),
  // link_ref: require("@Assets/icon/color/link-ref.png"),
  // doc_ref: require("@Assets/icon/color/doc-ref.png"),
  // image_ref: require("@Assets/icon/color/image-ref.png"),

  // avatar
  image_pick: require('@Assets/icon/pick-image.png'),
  camera: require('@Assets/icon/camera.png'),
  download: require('@Assets/icon/download.png'),
  createChecked: require('@Assets/icon/icon-createCheck.png'),
  checked: require('@Assets/icon/icon-checked.png'),

  // parallel-world
  close_dark_fill: require('@Assets/icon/close-dark-fill.png'),
  share_outline_light: require('@Assets/icon/icon-share-light.png'),
  comment_light: require('@Assets/icon/icon-comment-light.png'),
  word_line: require('@Assets/icon/icon-word-line.png'),
  continue_current_word: require('@Assets/icon/icon-continue-current-world.png'),
  icon_edit_glow: require('@Assets/icon/icon-edit-glow.png'),
  icon_ai_glow: require('@Assets/icon/icon-ai-glow.png'),
  icon_ai: require('@Assets/icon/icon-ai.png'),
  ai_dark: require('@Assets/icon/icon-ai-dark.png'),
  icon_edit_pw: require('@Assets/icon/icon-edit-pw.png'),
  icon_edit_pw_dark: require('@Assets/icon/icon-edit-pw-dark.png'),
  icon_save_pw: require('@Assets/icon/icon-save-pw.png'),
  icon_ai_stroked: require('@Assets/icon/icon-ai-stroked.png'),
  icon_edit_pw_grey: require('@Assets/icon/icon-edit-pw-grey.png'),
  reload: require('@Assets/icon/icon-reload.png'),
  reload2: require('@Assets/icon/icon-reload2.png'),
  fold: require('@Assets/icon/icon-fold.png'),
  publish_pw: require('@Assets/icon/icon-publish-pw.png'),
  li_help: require('@Assets/icon/icon-li-help.png'),
  cancel: require('@Assets/icon/icon-cancel.png'),
  back_pw: require('@Assets/icon/icon-back-pw.png'),
  pw_black: require('@Assets/icon/icon-pw-black.png'),
  close_pw: require('@Assets/icon/icon-close-pw.png'),
  pw_icon_white: require('@Assets/image/parallel-world/parallel-react-white.png'),

  // emoji
  comment_keyboard: require('@Assets/icon/icon-keyboard.png'),
  comment_emoji: require('@Assets/icon/icon-emoji.png'),
  emoji_add: require('@Assets/icon/icon-emoji-add.png'),
  emoji_added: require('@Assets/icon/icon-emoji-added.png'),
  emoji_same: require('@Assets/icon/icon-emoji-same.png'),
  switch: require('@Assets/icon/icon-switch.png'),
  pause: require('@Assets/icon/icon-pause.png'),
  reload3: require('@Assets/icon/icon-reload3.png'),
  reload4: require('@Assets/icon/icon-reload4.png'),

  // entry
  world_entry_icon: require('@Assets/image/entry/world-entry-icon.png'),
  drawing_entry_icon: require('@Assets/image/entry/drawing-entry-icon.png'),
  fight_entry_icon: require('@Assets/image/entry/fight-entry-icon.png'),

  // topic
  goto_icon: require('@Assets/image/topic/topic-entry.png'),
  search: require('@Assets/image/search/search.png'),
  search_top1: require('@Assets/image/search/search-top1.png'),
  search_top2: require('@Assets/image/search/search-top2.png'),
  search_top3: require('@Assets/image/search/search-top3.png'),
  search_hot: require('@Assets/image/search/search-hot.png'),
  search_clear: require('@Assets/image/search/search-clear.png'),
  search_expand: require('@Assets/image/search/search-history-expand.png'),
  search_shrink: require('@Assets/image/search/search-history-shrink.png'),
  search_hot_icon: require('@Assets/icon/search/hot.png'),
  search_new_icon: require('@Assets/icon/search/new.png'),
  search_origin: require('@Assets/icon/search/search-origin.png'),
  search_gray: require('@Assets/icon/search/search-gray.png')
};

const $imageStyle: ImageStyle = {
  resizeMode: 'contain'
};
