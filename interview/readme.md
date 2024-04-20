# vuex

## mutations为什么放同步?
1. vuex允许开发者追踪mutations的状态，mutations的前后状态会被devtool记录，如果是异步函数，devtool不知道这个函数实际上什么时候被调用。
2. Vuex 通过单一状态树来管理应用中的所有状态。这意味着 Vuex 中的状态是响应式的，并且任何状态的变化都将触发视图更新。由于 Vue 的响应式系统要求状态的变化是同步的，因此 mutation 必须是同步函数，以确保状态的变化能够被 Vue 监听到，并触发视图的更新。

## actions可以直接修改状态不告诉mutations吗？
可以
但是这样会让mutations无法追踪其前后的状态。不过一些网络请求和定时器任务可以直接在actions修改不通过mutations。
    