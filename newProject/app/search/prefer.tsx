import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  GestureResponderEvent,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  ScrollView,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ESearchResourceType, getQuerySourceByType } from '@/src/api/search';
import SearchBar from '@/src/gums/search/search-bar';
import { useSearchStore } from '@/src/store/search';
import { $SEARCH_COLORS, $flex } from '@/src/theme/variable';
import { dp2px, isIos } from '@/src/utils';
import { logWarn } from '@/src/utils/error-log';
import { reportClick, reportDiy, reportExpo } from '@/src/utils/report';
import News from './parts/news';
import { useRoute } from '@react-navigation/native';

export default function SearchPrefer() {
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isFirstPress, setIsFirstPress] = useState(true);

  const route = useRoute();

  useEffect(() => {
    setSearchText((route.params as any)?.keywords);
    setSearchValue((route.params as any)?.result);
  }, [route.params]);

  const onSearch = (
    e:
      | GestureResponderEvent
      | NativeSyntheticEvent<TextInputSubmitEditingEventData>,
    keywords: string
  ) => {
    setIsFirstPress(true);

    reportClick('remind_inputconfirm', {
      words: keywords
    });

    router.push({
      pathname: '/search/result',
      params: {
        keywords: keywords
      }
    });

    clearWord();
  };

  const onFocus = (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
    keywords: string
  ) => {
    reportClick('begin_input');
  };

  const clearWord = () => {
    setSearchValue('');
  };

  const onChange = (v: string) => {
    setSearchValue(v);
    if (isFirstPress) {
      reportExpo('remind_input');
      setIsFirstPress(false);
    }
  };

  return (
    <SafeAreaView style={[$flex, { backgroundColor: $SEARCH_COLORS.white }]}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <KeyboardAvoidingView behavior={isIos ? 'height' : undefined}>
          <SearchBar
            value={searchValue}
            onSearch={onSearch}
            onChange={onChange}
            onFocus={onFocus}
            placeHolderContent={
              searchText || useSearchStore.getState().lastPlaceText
            }
            autoFocus={true}
            clearWord={clearWord}
            ellipseWidth={dp2px(210)}
          ></SearchBar>
        </KeyboardAvoidingView>
        {!searchValue ? <News hidden={!!searchValue}></News> : <></>}
      </ScrollView>
    </SafeAreaView>
  );
}
