import {
  NumberAuthConfig,
  NumberAuthConfig_Style
} from '@step.ai/number-auth/src/proto/number_auth_config_pb';

export interface NumberAuthStoreType {
  config: NumberAuthConfig;
  updateConfig: <T extends keyof NumberAuthConfig>(
    newConfig: Pick<NumberAuthConfig, T>
  ) => NumberAuthConfig;
  resetConfig: () => NumberAuthConfig;
  callbacks: {
    [key in string]: () => void;
  };
}

export const NumberAuthStore: NumberAuthStoreType = {
  config: new NumberAuthConfig({
    navIsHidden: true,
    style: NumberAuthConfig_Style.SHEET,
    isLandscape: false,
    alertBarIsHidden: true,
    logoIsHidden: true,
    sloganIsHidden: true
    // privacyAlertIsNeedShow: true
  }),
  updateConfig: newConfig => {
    NumberAuthStore.config = new NumberAuthConfig({
      ...NumberAuthStore.config,
      ...newConfig
    });
    return NumberAuthStore.config;
  },
  resetConfig: () => {
    NumberAuthStore.config = new NumberAuthConfig({
      navIsHidden: true,
      style: NumberAuthConfig_Style.SHEET,
      isLandscape: false,
      alertBarIsHidden: true,
      logoIsHidden: true,
      sloganIsHidden: true,
    });
    return NumberAuthStore.config;
  },
  callbacks: {}
};
