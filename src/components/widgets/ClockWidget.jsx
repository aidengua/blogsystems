import { useState, useEffect } from 'react';
import SpotlightCard from '../SpotlightCard';

const ClockWidget = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDegrees = ((seconds / 60) * 360);
    const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6);
    const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30);

    return (
        <SpotlightCard className="w-28 h-28 md:w-32 md:h-32 rounded-[1.5rem] shadow-xl group" spotlightColor="rgba(255, 255, 255, 0.2)">
            <div className="w-full h-full flex items-center justify-center">
                {/* Clock Face */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 bg-white rounded-full shadow-inner flex items-center justify-center">

                    {/* Ticks */}
                    {[...Array(60)].map((_, i) => {
                        const isHour = i % 5 === 0;
                        return (
                            <div
                                key={i}
                                className="absolute inset-0 flex justify-center pt-[3%]"
                                style={{ transform: `rotate(${i * 6}deg)` }}
                            >
                                <div
                                    className={`rounded-full ${isHour ? 'bg-black w-[1.5px] h-[8%]' : 'bg-gray-300 w-[1px] h-[5%]'}`}
                                ></div>
                            </div>
                        );
                    })}

                    {/* Numbers */}
                    <div className="absolute inset-0">
                        {[...Array(12)].map((_, i) => {
                            const num = i === 0 ? 12 : i;
                            const rotation = i * 30;
                            // Radius for numbers (distance from center)
                            const radius = '34px';

                            return (
                                <div
                                    key={i}
                                    className="absolute left-1/2 top-1/2 flex items-center justify-center w-4 h-4"
                                    style={{
                                        transform: `translate(-50%, -50%) rotate(${rotation}deg) translate(0, -${radius}) rotate(-${rotation}deg)`
                                    }}
                                >
                                    <span className="text-black font-medium text-[0.85rem] font-sans leading-none">
                                        {num}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Hands */}
                    {/* Hour Hand */}
                    <div
                        className="absolute w-1.5 h-[25%] bg-black rounded-full origin-bottom z-10"
                        style={{
                            bottom: '50%',
                            left: 'calc(50% - 0.75px)',
                            transform: `rotate(${hourDegrees}deg)`,
                        }}
                    ></div>

                    {/* Minute Hand */}
                    <div
                        className="absolute w-1 h-[38%] bg-black rounded-full origin-bottom z-10"
                        style={{
                            bottom: '50%',
                            left: 'calc(50% - 0.5px)',
                            transform: `rotate(${minuteDegrees}deg)`,
                        }}
                    ></div>

                    {/* Second Hand */}
                    <div
                        className="absolute w-0.5 h-[45%] bg-orange-500 rounded-full origin-bottom z-20"
                        style={{
                            bottom: '50%',
                            left: 'calc(50% - 0.25px)',
                            transform: `rotate(${secondDegrees}deg)`,
                        }}
                    >
                        {/* Tail */}
                        <div className="absolute top-full left-0 w-full h-3 bg-orange-500 rounded-full"></div>
                    </div>

                    {/* Center Cap */}
                    <div className="absolute w-2 h-2 bg-black rounded-full z-30 flex items-center justify-center">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
};

export default ClockWidget;
