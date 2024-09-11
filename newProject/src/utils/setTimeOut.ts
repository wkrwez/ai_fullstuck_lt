export function setCustomTimeout(callback: () => void, delay: number) {
    const startTime = Date.now();
    function tick() {
        const currentTime = Date.now();
        if (currentTime - startTime >= delay) {
            callback();
        } else {
            requestAnimationFrame(tick);
        }
    }
    requestAnimationFrame(tick);
}