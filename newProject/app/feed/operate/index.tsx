import { IP_MASK } from '@/src/constants';
import { BrandInfo } from '@/src/types';

const ICON1 = require('@Assets/image/feed/guimiezhiren.png');
const ICON2 = require('@Assets/image/feed/zhoushuhuizhan.png');
const ICON3 = require('@Assets/image/feed/huoyingrenzhe.png');
const ICON4 = require('@Assets/image/feed/jinjidejuren.png');
const ICON5 = require('@Assets/image/feed/haizeiwang.png');
const ICON6 = require('@Assets/image/feed/modaozushi.png');
const ICON7 = require('@Assets/image/feed/jojo.png');
const ICON8 = require('@Assets/image/feed/tianguancifu.png');
const ICON9 = require('@Assets/image/feed/sanguoyanyi.png');
const ICON10 = require('@Assets/image/feed/zhenhuanzhuan.png');
const ICON11 = require('@Assets/image/feed/huluxiongdi.png');

const ICON12 = require('@Assets/image/feed/wishcard.png');

type FakeIp = Pick<
  BrandInfo,
  | 'brand'
  | 'displayName'
  | 'bgColor'
  | 'iconUrl'
  | 'detailBgImgUrl'
  | 'description'
>;

export const FakeIps: FakeIp[] = [
  // hsla(126, 46%, 69%, 1)
  // hsla(126, 32%, 15%, 1)

  //
  //   {
  //     displayName: '鬼灭之刃',
  //     iconUrl: '', //鬼灭IP.png的线上链接
  //     bgColor: 'rgb(18, 48, 20)',
  //     detailBgImgUrl: '', //IP落地页背景-鬼灭之刃.png 的线上链接,
  //     description:
  //       '某天，小狸突发奇想cos缘一（咱这辈子也是帅过的TXT）“我超，缘！”小狸背后传来尖叫，话音未落，只见鬼王扭头就跑...'
  //   },
  //   {
  //     displayName: '咒术回战',
  //     iconUrl: '', //咒术回战IP.png的线上链接
  //     bgColor: 'rgb(69, 28, 55)',
  //     detailBgImgUrl: '', //IP落地页背景-咒术回战.png 的线上链接,
  //     description:
  //       '咒术高专里都上什么课呢，小狸好奇地去蹭了一节数学课，学会了5除以2等于2.5...'
  //   },
  // hsla(321, 33%, 19%, 1)
  // hsla(320, 42%, 75%, 1)
  //
  // {
  //   brand: -1,
  //   displayName: '火影忍者',
  //   iconUrl: ICON3,
  //   bgColor: 'hsla(22, 94%, 11%, 1)',
  //   detailBgImgUrl: IP_MASK,
  //   description: '火影忍者介绍'
  // },
  // {
  //   brand: -1,
  //   displayName: '海贼王',
  //   iconUrl: ICON5,
  //   bgColor: 'hsla(191, 66%, 16%, 1)',
  //   detailBgImgUrl: IP_MASK,
  //   description: '海贼王介绍'
  // },
  // {
  //   displayName: '进击的巨人',
  //   iconUrl: ICON4,
  //   bgColor: 'rgba(226, 200, 150, 1)',
  //   detailBgImgUrl: IP_MASK,
  //   description: '进击的巨人介绍'
  // },
  //   {
  //     displayName: '魔道祖师',
  //     iconUrl: ICON6,
  //     bgColor: 'rgba(139, 212, 146, 1)',
  //     detailBgImgUrl: IP_MASK,
  //     description: '魔道祖师介绍'
  //   },
  //   {
  //     displayName: 'JOJO',
  //     iconUrl: ICON7,
  //     bgColor: 'rgba(218, 165, 200, 1)',
  //     detailBgImgUrl: IP_MASK,
  //     description: 'JOJO介绍'
  //   },
  //   {
  //     displayName: '天官赐福',
  //     iconUrl: ICON8,
  //     bgColor: 'rgba(255, 129, 129, 1)',
  //     detailBgImgUrl: IP_MASK,
  //     description: '天官赐福介绍'
  //   },
  //   {
  //     displayName: '甄嬛传',
  //     iconUrl: ICON10,
  //     bgColor: 'rgba(226, 200, 150, 1)',
  //     detailBgImgUrl: IP_MASK,
  //     description: '甄嬛传介绍'
  //   },
  //   {
  //     displayName: '葫芦兄弟',
  //     iconUrl: ICON11,
  //     bgColor: 'rgba(139, 212, 146, 1)',
  //     detailBgImgUrl: IP_MASK,
  //     description: '葫芦兄弟介绍'
  //   },
  {
    brand: -1,
    displayName: '许愿卡',
    iconUrl: ICON12,
    bgColor: 'transparent',
    detailBgImgUrl: IP_MASK,
    description: '许愿卡介绍'
  }
];

export const XUYUAN_CARD = {
  brand: -1,
  displayName: '许愿卡',
  iconUrl: ICON12,
  bgColor: 'transparent',
  detailBgImgUrl: IP_MASK,
  description: '许愿卡介绍'
};
