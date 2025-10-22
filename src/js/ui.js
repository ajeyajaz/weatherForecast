import { getWeatherColor } from "./utils.js";

export function displayPopup(message){

  const popup = document.querySelector('#popup-msg');
  popup.innerText = message;
  popup.classList.remove('hidden','opacity-0');
  popup.classList.add('opacity-100');

  setTimeout(()=>
    {
      popup.classList.add('opacity-0');
      setTimeout(()=> popup.classList.add('hidden'),500);
    },3000);
  }

export function ShowLoader(){
  document.querySelector('#loading').classList.remove('hidden');
}

export function stopLoader(){
  document.querySelector('#loading').classList.add('hidden');
}

export function hideOverlay(){
  document.getElementById('overlay').classList.add('hidden');
}

export function showOverlay(){
  document.getElementById('overlay').classList.remove('hidden');
}


export function showDropdown(recentList){
  const dropdown = document.querySelector('#recent-list');
  dropdown.classList.remove('hidden');
  dropdown.innerHTML = recentList
  .map((city)=>
        `<li class="p-2 hover:bg-gray-300/50 overflow-hidden flex justify-between items-center">${city}
          <button class="hover:bg-amber-200">
            <img src="https://www.svgrepo.com/show/505220/cross.svg" alt="" class="w-5 h-5">
          </button>
        </li>`).join('');
}

export function hideDropdown(){
  document.querySelector('#recent-list').classList.add('hidden');
}


export function displayCurrentWeather(data, isCelsius){
  const alertTemp = 40;
  const currWeatherContainer = document.getElementById('current-weather-section');
  const locationElem = document.getElementById('weather-location');
  const iconElem = document.querySelector('.current-weather img');
  const tempElem = document.getElementById('curr-weather-temp');
  const realFeelElem = document.getElementById('curr-weather-realfeel');
  const container = document.getElementById('current-weather-body');
  const weatherTypeElem = document.getElementById('weather-type');

  // Convert if needed
  let displayTemp = data.headerInfo.temprature;
  let displayRealFeel = data.headerInfo.realFeel;

  if (!isCelsius) {
    displayTemp = (displayTemp * 9/5) + 32;
    displayRealFeel = (displayRealFeel * 9/5) + 32;
  }

  
  // injecting headerinfo
  iconElem.setAttribute('src',`https://openweathermap.org/img/wn/${data.headerInfo.icon}@2x.png`);
  tempElem.innerHTML = `${displayTemp.toFixed(1)}&deg;<span class="text-[1rem] tracking-tighter">${isCelsius ? 'C' : 'F'}</span>`;
  locationElem.innerText = `${data.headerInfo.location}`;
  weatherTypeElem.innerText =  `${data.headerInfo.weatherType}`
  realFeelElem.innerHTML = `RealFeel ${displayRealFeel.toFixed(1)}&deg;${isCelsius ? 'C' : 'F'}`;
  
  // body element
  container.innerHTML = data.bodyInfo.
    map((item) => (
        `<div class="flex justify-between border-b border-gray-200">
            <span>${item.label}</span><span class="font-bold">${item.value}</span>
        </div>`
        )).join('');

  if(data.headerInfo.temprature > alertTemp)
    displayPopup('The current temperature is above 40°C. Stay hydrated!');

  currWeatherContainer
  .setAttribute('class',
    `${getWeatherColor(data.headerInfo.weatherType)}
      max-w-[840px] mx-auto mt-4 rounded-sm shadow-sm p-6 transition-colors duration-1000`)
}


export function displayExtendedForcast(data){

  const forcastContainer = document.querySelector('#extendedForcast');
 
  forcastContainer.innerHTML = data.map((item)=>{
    // forcast card
    return `
      <div class="bg-white p-4 flex gap-x-4 shadow-md w-full mx-auto rounded-sm">

        <div class="${getWeatherColor(item.weatherType)} w-[40%] h-full flex flex-col justify-center items-center p-2 shadow-md rounded-sm relative">
          <p class="absolute left-2 top-0 text-black/50">${item.date}</p>
          <img src="https://openweathermap.org/img/wn/${item.weatherIcon}@2x.png" alt="" class="w-30 h-20 object-contain">
          <h3 class="font-black text-xl">${item.temp}&deg;c</h3>
        </div>

        <div class="w-[60%]  space-y-3">
          <div class="flex justify-end tex-2xl font-black"><p>${item.weatherType}</p> </div>
          <div class="flex justify-between border-b border-gray-300/50"><p>Humidity</p><p>${item.humidity}</p></div>
          <div class="flex justify-between border-b border-gray-300/50"><p>Wind</p><p>${item.windSpeed}</p></div>
          <div class="flex justify-between border-b border-gray-300/50"><p>Wind gust</p><p>${item.windGust}</p></div>
        </div>

      </div>`
  }).join('');
}
