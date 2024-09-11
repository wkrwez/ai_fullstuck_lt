import { useEffect, useRef, useState } from 'react';

// 避免Android的定时器停止
export function useTimeout(maxDuration = 60) {
    const [time, setTime] = useState<number>(0);
    const timer = useRef<{
        startTime: number;
        ref: NodeJS.Timeout;
    } | null>(null); // 脏了，后面改>
    // 清除
    useEffect(() => {
        return () => {
            if (timer.current) {
                clearInterval(timer.current.ref);
            }
            timer.current = null;
        };
    }, []);

    useEffect(() => {
        if (time === maxDuration) {
            timer.current = {
                ref: setInterval(() => {
                    setTime(() => {
                        return Math.max(
                            maxDuration -
                            Math.round(
                                (Date.now() - (timer.current?.startTime || 0)) / 1000,
                            ),
                            0,
                        );
                    });
                }, 1000),
                startTime: +Date.now(),
            };
        } else if (time <= 0) {
            clearInterval(timer.current?.ref);
            timer.current = null;
        }
    }, [time]);

    return { time, setTime };
}

