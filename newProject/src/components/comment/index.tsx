import React from 'react';
import { LayoutChangeEvent, View, ViewProps } from 'react-native';
import { CommentInput } from './Input';
import { CommentList } from './List';

export const Comment = ({ detailId }: { detailId: string }) => {
  return (
    <View style={{ paddingTop: 8 }}>
      <CommentInput detailId={detailId} />
      <CommentList
        detailId={detailId}
        emptycontainerStyle={{ height: 250 }}
        containerStyle={{ marginRight: 16, marginLeft: 16, marginTop: 10 }}
      />
    </View>
  );
};
