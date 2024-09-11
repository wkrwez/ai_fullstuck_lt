export const PAGE_TOP = 200;
export const PANNEL_TOP = 140;
export const ANIMATE_TIME = 300;
export const ELE_ANIMATE_TIME = 500;

export type ConfigItemType = {
  icon: number;
  text: string;
  id: string;
  double?: boolean; // 是否双人
  doubleLast?: boolean; // 双人最后一个
  doubleFirst?: boolean; // 双人第一个
};
export type ConfigType = {
  [key in string]: ConfigItemType;
};

export type Options = {};

export enum PromptType {
  expression = 'expression',
  action = 'action',
  scene = 'scene',
  cloth = 'cloth',
  addition = 'addition'
}

export const config: ConfigType = {
  // actions
  banshen: {
    icon: require('@Assets/icon/makephoto/action/banshen.png'),
    text: '半身',
    id: 'banshen'
  },
  beiying: {
    icon: require('@Assets/icon/makephoto/action/beiying.png'),
    text: '背影回眸',
    id: 'beiying'
  },
  guixia: {
    icon: require('@Assets/icon/makephoto/action/guixia.png'),
    text: '跪下',
    id: 'guixia'
  },
  pingtang: {
    icon: require('@Assets/icon/makephoto/action/pingtang.png'),
    text: '平躺',
    id: 'pingtang'
  },
  waitou: {
    icon: require('@Assets/icon/makephoto/action/waitou.png'),
    text: '歪头',
    id: 'waitou'
  },
  zhandou: {
    icon: require('@Assets/icon/makephoto/action/zhandou.png'),
    text: '战斗',
    id: 'zhandou'
  },
  zhanli: {
    icon: require('@Assets/icon/makephoto/action/zhanli.png'),
    text: '站立',
    id: 'zhanli'
  },
  zuozhe: {
    icon: require('@Assets/icon/makephoto/action/zuozhe.png'),
    text: '坐着',
    id: 'zuozhe'
  },
  // cloth
  jiehun: {
    icon: require('@Assets/icon/makephoto/cloth/jiehun.png'),
    text: '结婚',
    id: 'jiehun'
  },
  niuzai: {
    icon: require('@Assets/icon/makephoto/cloth/niuzai.png'),
    text: '牛仔',
    id: 'niuzai'
  },
  renshe: {
    icon: require('@Assets/icon/makephoto/cloth/renshe.png'),
    text: '人设',
    id: 'renshe'
  },
  xizhuang: {
    icon: require('@Assets/icon/makephoto/cloth/xizhuang.png'),
    text: '西装',
    id: 'xizhuang'
  },
  xingzhuan: {
    icon: require('@Assets/icon/makephoto/cloth/xingzhuan.png'),
    text: '性转',
    id: 'xingzhuan'
  },
  yuyi: {
    icon: require('@Assets/icon/makephoto/cloth/yuyi.png'),
    text: '浴衣',
    id: 'yuyi'
  },
  zhuangjia: {
    icon: require('@Assets/icon/makephoto/cloth/zhuangjia.png'),
    text: '装甲',
    id: 'zhuangjia'
  },
  // exp
  angry: {
    icon: require('@Assets/icon/makephoto/exp/angry.png'),
    text: '愤怒',
    id: 'angry'
  },
  cry: {
    icon: require('@Assets/icon/makephoto/exp/cry.png'),
    text: '爆哭',
    id: 'cry'
  },
  cute: {
    icon: require('@Assets/icon/makephoto/exp/cute.png'),
    text: '可爱',
    id: 'cute'
  },
  sad: {
    icon: require('@Assets/icon/makephoto/exp/sad.png'),
    text: '悲伤',
    id: 'sad'
  },
  serious: {
    icon: require('@Assets/icon/makephoto/exp/serious.png'),
    text: '严肃',
    id: 'serious'
  },
  shy: {
    icon: require('@Assets/icon/makephoto/exp/shy.png'),
    text: '害羞',
    id: 'shy'
  },
  sleep: {
    icon: require('@Assets/icon/makephoto/exp/sleep.png'),
    text: '瞌睡',
    id: 'sleep'
  },
  smile: {
    icon: require('@Assets/icon/makephoto/exp/smile.png'),
    text: '微笑',
    id: 'smile'
  },
  // 场景
  huahuo: {
    icon: require('@Assets/icon/makephoto/scene/huahuo.png'),
    text: '花火大会',
    id: 'huahuo'
  },
  jietou: {
    icon: require('@Assets/icon/makephoto/scene/jietou.png'),
    text: '街头',
    id: 'jietou'
  },
  lieche: {
    icon: require('@Assets/icon/makephoto/scene/lieche.png'),
    text: '列车',
    id: 'lieche'
  },
  lvye: {
    icon: require('@Assets/icon/makephoto/scene/lvye.png'),
    text: '绿野',
    id: 'lvye'
  },
  xiaoyan: {
    icon: require('@Assets/icon/makephoto/scene/xiaoyan.png'),
    text: '硝烟',
    id: 'xiaoyan'
  },
  custom: {
    icon: require('@Assets/icon/makephoto/icon-edit.png'),
    text: '自由发挥',
    id: 'custom'
  },
  yongbao: {
    icon: require('@Assets/icon/makephoto/action/yongbao.png'),
    text: '拥抱',
    id: 'yongbao',
    double: true,
    doubleFirst: true
  },
  bingjian: {
    icon: require('@Assets/icon/makephoto/action/bingjian.png'),
    text: '并肩',
    id: 'bingjian',
    double: true
  },
  qinwen: {
    icon: require('@Assets/icon/makephoto/action/qinwen.png'),
    text: '亲吻',
    id: 'qinwen',
    double: true
  },
  bingpaizuo: {
    icon: require('@Assets/icon/makephoto/action/bingpaizuo.png'),
    text: '并排坐',
    id: 'bingpaizuo',
    double: true
  },
  gongzhubao: {
    icon: require('@Assets/icon/makephoto/action/gongzhubao.png'),
    text: '公主抱',
    id: 'gongzhubao',
    double: true,
    doubleLast: true
  },
  dazuo: {
    icon: require('@Assets/icon/makephoto/action/dazuo.png'),
    text: '打坐',
    id: 'dazuo'
  },
  qiuhun: {
    icon: require('@Assets/icon/makephoto/action/qiuhun.png'),
    text: '求婚',
    id: 'qiuhun'
  }
};

export type OptionType = {
  key: PromptType;
  label: string;
  options: string[];
  icon: number;
};

export type OptionsType = {
  [key in PromptType]: OptionType;
};

export const options: OptionsType = {
  expression: {
    key: PromptType.expression,
    label: '表情',
    options: [
      // 'custom',
      'shy',
      'serious',
      'sad',
      'cute',
      'smile',
      'angry',
      'sleep',
      'cry'
    ],
    icon: require('@Assets/icon/makephoto/icon-exp.png')
  },
  action: {
    key: PromptType.action,
    label: '动作',
    options: [
      // 'custom',
      'banshen',
      'beiying',
      'waitou',
      'zhandou',
      'pingtang',
      'zhanli',
      'zuozhe',
      'guixia'
    ],
    icon: require('@Assets/icon/makephoto/icon-action.png')
  },
  scene: {
    key: PromptType.scene,
    label: '场景',
    options: ['xiaoyan', 'jietou', 'lieche', 'lvye'],
    icon: require('@Assets/icon/makephoto/icon-scene.png')
  },
  cloth: {
    key: PromptType.cloth,
    label: '服饰',
    options: [
      // 'custom',
      'niuzai',
      'zhuangjia',
      'xizhuang',
      'yuyi',
      'renshe',
      'jiehun',
      'xingzhuan'
    ],
    icon: require('@Assets/icon/makephoto/icon-cloth.png')
  },
  addition: {
    // todo
    key: PromptType.addition,
    label: '',
    options: [],
    icon: require('@Assets/icon/makephoto/icon-exp.png')
  }
};

export const doubleOptions: OptionsType = {
  ...options,
  action: {
    key: PromptType.action,
    label: '动作',
    options: [
      // 'custom',
      'yongbao',
      'bingjian',
      'qinwen',
      'bingpaizuo',
      // 'gongzhubao',
      'zhanli',
      'dazuo',
      'qiuhun'
    ],
    icon: require('@Assets/icon/makephoto/icon-action.png')
  }
};

export enum MakePhotoEvents {
  enter_paint = 'enter_paint',
  ip_char = 'ip_char',
  ai_prompt_image_generate = 'ai_prompt_image_generate',
  prompt = 'prompt',
  prompt_ai_general_typein = 'prompt_ai_general_typein',
  prompt_user_general_typein = 'prompt_user_general_typein',
  prompt_ai_supplement_typein = 'prompt_ai_supplement_typein',
  prompt_user_supplement_typein = 'prompt_user_supplement_typein',
  image_generate = 'image_generate',
  char_decision = 'char_decision',
  image_info = 'image_info',
  image_generate_complete = 'image_generate_complete',
  prepare_publish = 'prepare_publish',
  regenerate = 'regenerate',
  add_image_click = 'add_image_click',
  image_generate_save = 'image_generate_save',
  album_click = 'album_click',
  choose_image = 'choose_image',
  delete_image = 'delete_image',
  go_to_publish = 'go_to_publish',
  add_image = 'add_image',
  save_image = 'save_image'
}

export enum ElementSuffix {
  page_view = 'page_view',
  char_choose = 'char_choose',
  ip_choose = 'ip_choose',
  ai_prompt = 'ai_prompt',
  prompt_typein = 'prompt_typein',
  paint_button = 'paint_button',
  char_add = 'char_add',
  image_paint = 'image_paint',
  image_generate = 'image_generate',
  prepublish = 'prepublish',
  save_image = 'save_image',
  album = 'album',
  choose_image = 'choose_image',
  delete_image = 'delete_image',
  go_to_publish = 'go_to_publish'
}
