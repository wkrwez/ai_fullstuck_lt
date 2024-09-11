import React from 'react';
import { Text, View } from 'react-native';
import { Icon, SheetModal } from '@/src/components';
import ParallelWorldButton from '@/app/parallel-world/_components/others/parallel-world-button';

export default function AddConfirm({
  isVisible,
  onClose
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <SheetModal
      isVisible={isVisible}
      remainHeight={0}
      maskShown={true}
      style={{ paddingBottom: 44 }}
      onClose={onClose}
    >
      <View
        style={{
          // height: 330,
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 40,
          alignItems: 'center',
          gap: 16
        }}
      >
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: 'rgba(0, 0, 0, 0.87)'
            }}
          >
            表情包已达上限999
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              color: 'rgba(52, 52, 52, 0.87)'
            }}
          >
            删除旧表情，以继续添加新表情
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#F5F6F8',
            // width: 280,
            paddingHorizontal: 26,
            // height: 152,
            paddingTop: 20,
            paddingBottom: 24,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 14
          }}
        >
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#FF7E46' }}>
              新
            </Text>
            <View
              style={{ backgroundColor: 'blue', height: 86, width: 86 }}
            ></View>
          </View>
          <View style={{ height: 86, justifyContent: 'center' }}>
            <Icon icon="switch" size={20} />
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>旧</Text>
            <View
              style={{ backgroundColor: 'blue', height: 86, width: 86 }}
            ></View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <ParallelWorldButton title="暂不添加" style={{ width: 158 }} />
          <ParallelWorldButton
            title="确认添加"
            style={{ width: 158, backgroundColor: '#FF6A3B' }}
          />
        </View>
      </View>
    </SheetModal>
  );
}
