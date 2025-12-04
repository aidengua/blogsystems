import { useState, useEffect } from 'react';

const BatteryWidget = () => {
    const [battery, setBattery] = useState({ level: 0.89, charging: true });
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        let batteryManager = null;

        const updateBattery = (batt) => {
            setBattery({
                level: batt.level,
                charging: batt.charging
            });
        };

        const initBattery = async () => {
            if ('getBattery' in navigator) {
                try {
                    batteryManager = await navigator.getBattery();
                    updateBattery(batteryManager);

                    batteryManager.addEventListener('levelchange', () => updateBattery(batteryManager));
                    batteryManager.addEventListener('chargingchange', () => updateBattery(batteryManager));
                } catch (e) {
                    console.error("Battery API error:", e);
                    setSupported(false);
                }
            } else {
                setSupported(false);
            }
        };

        initBattery();

        return () => {
            if (batteryManager) {
                batteryManager.removeEventListener('levelchange', () => updateBattery(batteryManager));
                batteryManager.removeEventListener('chargingchange', () => updateBattery(batteryManager));
            }
        };
    }, []);

    const percentage = Math.round(battery.level * 100);
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (battery.level * circumference);

    return (
        <div className="relative w-28 h-28 md:w-32 md:h-32 bg-black/20 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-xl flex flex-col items-center justify-center p-3 overflow-hidden group hover:bg-white/20 transition-all duration-300">

            {/* Progress Ring */}
            <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                {/* Background Ring */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="5"
                        fill="transparent"
                    />
                    {/* Foreground Ring */}
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="#22c55e" // Green-500
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Icon in Center */}
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <i className="fas fa-laptop text-xl"></i>
                </div>

                {/* Charging Bolt */}
                {battery.charging && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-yellow-400 text-xs animate-pulse">
                        <i className="fas fa-bolt"></i>
                    </div>
                )}
            </div>

            {/* Percentage Text */}
            <div className="text-2xl font-bold text-white font-mono tracking-tighter">
                {percentage}%
            </div>
        </div>
    );
};

export default BatteryWidget;
