import AnimatedLottieView from 'lottie-react-native';

type LottieSources = {
  [key in string]: number;
};

export enum PlayStatus {
  init = 'init',
  playing = 'playing'
}

export class LottieMannager {
  _sources: LottieSources = {};
  _playStatus: PlayStatus = PlayStatus.init;
  _waitPlay: string | null = null;
  // _waitStop:
  _ref: React.MutableRefObject<AnimatedLottieView | null>;
  _setSource: (v: number) => void;
  constructor(
    ref: React.MutableRefObject<AnimatedLottieView | null>,
    sources: LottieSources,
    setSource: (source: number) => void
  ) {
    this._ref = ref;
    this._sources = sources;
    this._setSource = setSource;
  }

  play(key: string) {
    if (this._playStatus === PlayStatus.playing) {
      this._waitPlay = key;
    } else {
      this._setSource(this._sources[key]);
      this._ref.current?.play();
    }
    // if (!this._sources[key]) return;
    // if (this._current) this._sources[key].play();
  }
  changePlayStatus(status: PlayStatus) {
    this._playStatus = status;
  }
  stop() {}
  stopImmediately() {
    if (this._ref.current) {
      this._ref.current.pause();
    }
  }
}
