import { useState, useEffect } from 'react';
import SpotlightCard from '../SpotlightCard';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Taipei coordinates: 25.0330, 121.5654
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=25.0330&longitude=121.5654&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTaipei'
                );
                const data = await response.json();

                setWeather({
                    temp: Math.round(data.current.temperature_2m),
                    code: data.current.weather_code,
                    isDay: data.current.is_day,
                    max: Math.round(data.daily.temperature_2m_max[0]),
                    min: Math.round(data.daily.temperature_2m_min[0])
                });
            } catch (error) {
                console.error("Error fetching weather:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        // Refresh every 30 mins
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // WMO Weather interpretation codes (simplified)
    const getWeatherIcon = (code, isDay) => {
        if (code === 0) return isDay ? 'fa-sun' : 'fa-moon';
        if (code >= 1 && code <= 3) return isDay ? 'fa-cloud-sun' : 'fa-cloud-moon';
        if (code >= 45 && code <= 48) return 'fa-smog';
        if (code >= 51 && code <= 67) return 'fa-cloud-rain';
        if (code >= 71 && code <= 77) return 'fa-snowflake';
        if (code >= 80 && code <= 82) return 'fa-cloud-showers-heavy';
        if (code >= 95 && code <= 99) return 'fa-bolt';
        return 'fa-cloud';
    };

    const getWeatherText = (code) => {
        if (code === 0) return '晴朗';
        if (code >= 1 && code <= 3) return '局部多雲';
        if (code >= 45 && code <= 48) return '霧';
        if (code >= 51 && code <= 67) return '雨';
        if (code >= 80 && code <= 99) return '雷雨';
        return '多雲';
    };

    if (loading) {
        return (
            <div className="relative w-28 h-28 md:w-32 md:h-32 bg-[#1c1c1e]/80 backdrop-blur-md border border-white/10 rounded-[1.5rem] shadow-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-white"></div>
            </div>
        );
    }

    return (
        <SpotlightCard className="w-28 h-28 md:w-32 md:h-32 rounded-[1.5rem] shadow-xl group font-sans" spotlightColor="rgba(112, 156, 239, 0.2)">
            <div className="w-full h-full flex flex-col p-3 text-white">
                {/* Location */}
                <div className="text-sm font-medium flex items-center gap-1 mb-0.5 whitespace-nowrap">
                    台北市 <i className="fas fa-location-arrow text-[0.6rem]"></i>
                </div>

                {/* Main Temp */}
                <div className="text-4xl font-light tracking-tighter leading-none mb-1">
                    {weather?.temp}°
                </div>

                {/* Condition */}
                <div className="flex items-center gap-1.5 text-xs mb-auto whitespace-nowrap">
                    <i className={`fas ${getWeatherIcon(weather?.code, weather?.isDay)}`}></i>
                    <span>{getWeatherText(weather?.code)}</span>
                </div>

                {/* High/Low */}
                <div className="flex gap-3 text-xs mt-1 w-full">
                    <div className="flex flex-col items-start">
                        <span className="opacity-60 text-[0.6rem] leading-tight">最高</span>
                        <span className="font-medium leading-tight">{weather?.max}°</span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="opacity-60 text-[0.6rem] leading-tight">最低</span>
                        <span className="font-medium leading-tight">{weather?.min}°</span>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
};

export default WeatherWidget;
