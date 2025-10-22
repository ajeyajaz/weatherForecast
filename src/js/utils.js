export function getWeatherColor(weatherType){

    if(weatherType === 'Clear')return'bg-sky-400';
    if(weatherType === 'Clouds')return'bg-blue-300';
    if(weatherType === 'Rain')return'bg-slate-500';
    if(weatherType === 'Thunderstorm')return'bg-gray-500';
    if(weatherType === 'Snow')return'bg-cyan-100';
    if (['Mist', 'Haze'].includes(weatherType))return'bg-gray-300';
    return 'bg-amber-400';
}
