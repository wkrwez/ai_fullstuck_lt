import { useThrottleFn } from 'ahooks';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { pointsClient } from '@/src/api/points';
import { useCreditStore } from '@/src/store/credit';
import { typography } from '@/src/theme';
import { dp2px } from '@/src/utils';
import CreditCas, {
  CREDIT_TYPE,
  MINUS_BORDER_THEME1,
  MINUS_COLOR,
  MINUS_THEME1,
  PLUS_BORDER_THEME1,
  PLUS_COLOR,
  PLUS_THEME1
} from '../credit-cas';
import {
  InvoiceType,
  PointsInvoice
} from '@/proto-registry/src/web/raccoon/points/points_pb';

interface IRecordTabProps {
  currentTab: number;
  maxListHeight: number;
}

export default function RecordTab({
  currentTab,
  maxListHeight
}: IRecordTabProps) {
  const [recordList, setRecordList] = useState<PointsInvoice[]>([]);

  const getCreditHistory = async (cursor?: undefined | string) => {
    try {
      // 返回
      if (cursor === '') return;
      const res = await pointsClient.getPointsInvoices({
        invoiceType: InvoiceType.INVOICE_ALL,
        pagination: {
          size: 20,
          cursor: cursor
        }
      });
      console.log(res.pagination.nextCursor, 'nextCursor===');

      setNextCursor(res.pagination.nextCursor);
      setRecordList((list: PointsInvoice[]) => {
        return [...list, ...res.invoices];
      });
    } catch (error) {
      console.log(error, 'res1===');
    }
  };

  const [nextCursor, setNextCursor] = useState<undefined | string>('');

  const { run } = useThrottleFn(getCreditHistory, {
    wait: 500
  });

  const reqLastRecord = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // 获取内容的总高度
    const contentHeight = e.nativeEvent.contentSize.height;
    // 获取当前可见区域的高度
    const visibleHeight = e.nativeEvent.layoutMeasurement.height;
    // 获取当前滚动的偏移量
    const offsetY = e.nativeEvent.contentOffset.y;

    // 判断是否滚动到底部
    const isScrolledToBottom = visibleHeight + offsetY >= contentHeight - 60;
    if (isScrolledToBottom) {
      // 在这里处理滚动到底部的逻辑
      run(nextCursor);
    }
  };

  useEffect(() => {
    getCreditHistory();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[
        $insetWrapper,
        {
          height: maxListHeight,
          overflowX: 'hidden',
          marginBottom: currentTab === 0 ? dp2px(86) : dp2px(40)
        }
      ]}
      onScrollEndDrag={reqLastRecord}
    >
      {recordList?.map((record: PointsInvoice, recordIndex) => {
        const isPlus = record.changedPoints > 0;
        const theme =
          record.changedPoints <= 0 ? CREDIT_TYPE.MINUS : CREDIT_TYPE.PLUS;
        return (
          <View
            style={[
              $recordItem,
              {
                borderBottomWidth:
                  recordIndex === recordList.length - 1 ? 0 : 0.5
              }
            ]}
            key={recordIndex}
          >
            <View style={$left}>
              <Text style={$action}>{record.cause}</Text>
              <Text style={$time}>
                {dayjs(record.createdTimestamp * 1000).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}
              </Text>
            </View>
            <View style={$right}>
              <CreditCas
                theme={theme}
                text={`${isPlus ? '+' + record.changedPoints : record.changedPoints}`}
                borderColors={isPlus ? PLUS_BORDER_THEME1 : MINUS_BORDER_THEME1}
                insetsColors={isPlus ? PLUS_THEME1 : MINUS_THEME1}
                $customTextStyle={{
                  color: isPlus ? PLUS_COLOR : MINUS_COLOR
                }}
                hasPad
              ></CreditCas>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const $recordItem: ViewStyle = {
  height: dp2px(83),
  marginHorizontal: dp2px(20),
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  borderBottomWidth: 0.5
};

const $action: TextStyle = {
  color: 'rgba(255, 255, 255, 0.90)',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 15,
  fontWeight: '600',
  lineHeight: 20
};

const $left: ViewStyle = {};
const $right: ViewStyle = {};

const $time: TextStyle = {
  color: 'rgba(255, 255, 255, 0.40)',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 13,
  fontWeight: '400',
  lineHeight: 20,
  marginTop: 3
};

const $insetWrapper: ViewStyle = {
  marginBottom: dp2px(40)
};
