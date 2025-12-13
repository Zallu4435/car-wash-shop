import { useEffect, useState } from 'react';

interface CountUpProps {
    end: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    separator?: string;
    className?: string;
}

export function CountUp({
    end,
    duration = 2000,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    className,
}: CountUpProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function (easeOutExpo)
            const easeOut = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

            const currentCount = easeOut(percentage) * end;
            setCount(currentCount);

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    const formattedCount = count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return (
        <span className={className}>
            {prefix}{formattedCount}{suffix}
        </span>
    );
}
