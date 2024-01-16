<template>
    <SimpleHeader title="新增地址"/>

    <van-address-edit
        :area-list="areaList"
        show-delete
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
        @change-detail="onChangeDetail"
        />

</template>

<script setup>
import SimpleHeader from '@/components/SimpleHeader.vue';
import { areaList } from '@vant/area-data';
import { addAddress } from '@/api/address.js'
import { showToast } from 'vant';
import { useRouter } from 'vue-router'

const router = useRouter()

const onSave = async(info) => {
    // console.log(info);
    const params = {
        userName: info.name,
        userPhone: info.tel,
        provinceName: info.province,
        cityName: info.city,
        regionName: info.county,
        detailAddress: info.addressDetail,
        defaultFlag: info.isDefault ? 1 : 0
    }
    const res = await addAddress(params)
    console.log(res);
    if (res.resultCode === 200) {
        showToast('保存成功')
        setTimeout(() => {
            router.back()
        }, 1500)
    }
}

</script>

<style lang="less" scoped>

</style>