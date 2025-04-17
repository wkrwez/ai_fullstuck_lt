export default {
    //el : DOM元素,binging
    mounted(el, binding) {
        console.log(el, binding);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    //这里是为了等待图片完全加载完成成功
                    const img = new Image();
                    img.src = binding.value;
                    // 加载成功会调用
                    img.onload = () => {
                        el.src = binding.value;
                    }

                    observer.unobserve(el);
                    el._lazy_observer = observer;
                }
            });
        });
    },
    beforeUnmount(el) {
        //如果切换路由。如果观察者还没取消监听就会造成性能开销
        if (el._lazy_observer) {
            observer.unobserve(el);
        }
    },
}