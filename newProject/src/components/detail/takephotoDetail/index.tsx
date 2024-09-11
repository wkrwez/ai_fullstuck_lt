import React from 'react';
import { Text, View } from 'react-native';
import { type ProtoInfo } from '@/src/store/detail';
import { StyleSheet } from '@Utils/StyleSheet';
import { EmptyPlaceHolder } from '../../Empty';
import { TakePhotoDetailItem } from '../takephotoDetailItem';

type TakePhotoDetailProps = {
  detailId: string;
  data: ProtoInfo[];
};

export function TakePhotoDetail(props: TakePhotoDetailProps) {
  return props.data.length ? (
    <View style={st.container}>
      {props.data.map(item => (
        <TakePhotoDetailItem
          detailId={props.detailId}
          style={
            item !== props.data[props.data.length - 1] && { marginBottom: 12 }
          }
          key={item.protoId}
          data={item}
        />
      ))}
    </View>
  ) : (
    <EmptyPlaceHolder style={st.emptyContainer}>
      <Text style={st.emptyText}>小狸走丢了</Text>
    </EmptyPlaceHolder>
  );
  // return <TakePhotoDetailItem />;
}

const st = StyleSheet.create({
  container: {
    minHeight: 250,
    marginLeft: 16,
    marginRight: 16,
    height: 'auto'
  },
  emptyContainer: {
    minHeight: 250,
    height: 'auto'
  },
  emptyText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.4)'
  }
});
