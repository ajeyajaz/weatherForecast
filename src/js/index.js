// displaying overlay and recent-list dropdown.
const searchField = document.querySelector('#search-city');
const dropdown = document.getElementById('recent-list');
const form = document.querySelector('form');
let recentList = [];
const defaultCity = 'London';


searchField.addEventListener('focus', ()=>{
  
  document.getElementById('overlay').classList.remove('hidden');
  dropdown.classList.remove('hidden');

  //preapre dropdown Item
  dropdown.innerHTML = 
    recentList.map((city)=>
        `<li class="p-2 hover:bg-gray-300/50 overflow-hidden flex justify-between items-center">${city}
          <button class="hover:bg-amber-200">
            <img src="https://www.svgrepo.com/show/505220/cross.svg" alt="" class="w-5 h-5">
          </button>
        </li>`).join('');
});


function hideOverlayDropdown(){
  document.getElementById('overlay').classList.add('hidden');
  dropdown.classList.add('hidden');
}


document.addEventListener('click', e=>{
  // if clicked elem not searchIput or dropdown items hide overlay and dropdown.
  const clickedElem = searchField.contains(e.target) || dropdown.contains(e.target);
  if(!clickedElem){
    hideOverlayDropdown();
  };
});


dropdown.addEventListener('click', e =>{
  e.stopPropagation(); // prevent innvoking hideOverlayDropdown
  const item = e.target
  if(item.tagName === 'LI')displayWeather(e.target.innerText); // click happens on dropdown item, get data.
  
  if(item.parentElement.tagName === 'BUTTON'){
    const value = item.parentElement.parentElement.innerText;
    const parent = item.parentElement.parentElement;
    parent.remove();
    recentList.splice(recentList.indexOf(value),1);
  }
});


function displayPopup(message){

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


function ShowLoader(){
  document.querySelector('#loading').classList.remove('hidden');
}

function stopLoader(){
  document.querySelector('#loading').classList.add('hidden');
}

const apiKey = "17d07533467ca9cf8b160bce8034bdc3"; //replace with your OpenWeatherMap apikey


// Current Weather
async function getCurrentWeather(city, lat=null, lon=null){
  const urlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const urlLatLon = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric
` 
  const url = lat && lon ? urlLatLon : urlCity

  try{
    const response = await fetch(url);
    const json = await response.json();

    if(!response.ok){
      throw new Error('city not found'); 
    }
    
    if(response.ok){

      // extract essential data
      const temp = json.main.temp;
      const humidity = `${json.main.humidity}%`;
      const windSpeed = `${json.wind.speed}m/s`;
      const realFeel = `${json.main.feels_like}`;
      const location = json.name;
      const icon = json.weather?.[0]?.icon || '01d'; //default icon if not available.
      const weatherType = json.weather[0]?.main;


      return {
        // for header
        headerInfo: {
          temprature: temp,
          realFeel: realFeel,
          location: location,
          icon: icon,
          weatherType: weatherType
        },
        //for  body
        bodyInfo:[
          {label: 'Temp', value:temp},
          {label: 'Humidity', value:humidity},
          {label: 'wind speed', value: `${windSpeed}`},
      ]
    };
      
    }
  }
  catch(err){
    throw err;
  }

}


function displayCurrentWeather(data){
  const alertTemprature = 40;
  const currWeatherContainer = document.getElementById('#current-weather-section');
  const locationElem = document.getElementById('weather-location');
  const iconElem = document.querySelector('.current-weather img');
  const tempElem = document.getElementById('curr-weather-temp');
  const realFeelElem = document.getElementById('curr-weather-realfeel');
  const container = document.getElementById('current-weather-body');

  // injecting headerinfo
  iconElem.setAttribute('src',`https://openweathermap.org/img/wn/${data.headerInfo.icon}@2x.png`);
  tempElem.innerHTML = `${data.headerInfo.temprature}&deg;<span class="text-[1rem]  tracking-tighter">c</span>`
  locationElem.innerHTML = `Current Weather(${data.headerInfo.location}) <span class='font-black'>${data.headerInfo.weatherType}</span>`;
  realFeelElem.innerHTML = `RealFeeL ${data.headerInfo.realFeel}&deg;`;
  
  // body element
  container.innerHTML = data.bodyInfo.map((item) => (
    `<div class="flex justify-between border-b border-gray-200">
        <span>${item.label}</span><span class="font-bold">${item.value}</span>
    </div>`
    )).join('');

  if(data.headerInfo.temprature > alertTemprature)
    displayPopup('The current temperature is above 40°C. Please take necessary precautions to stay safe and hydrated.');

  currWeatherContainer.setAttribute('class', `${getWeatherColor(data.headerInfo.weatherType)} max-w-[840px] mx-auto mt-4 rounded-sm shadow-sm p-6`)

  console.log(currWeatherContainer);
}


form.addEventListener('submit',(event)=>{
  event.preventDefault();

  const searchELement = form.querySelector('#search-city');
  const cityName = searchELement.value.trim().toLowerCase();
  
  if (!cityName){
    displayPopup('City cannot be empty.');
    return;
  }
  if(!recentList.includes(cityName)) recentList.push(cityName); // if new city search, add to history.
  displayWeather(cityName);

  // clean input field.
  searchELement.value = '';

});


function getWeatherColor(weatherType){

    if(weatherType === 'Clear')return'bg-sky-400';
    if(weatherType === 'Clouds')return'bg-blue-300';
    if(weatherType === 'Rain')return'bg-slate-500';
    if(weatherType === 'Thunderstorm')return'bg-gray-500';
    if(weatherType === 'Snow')return'bg-cyan-100';
    if (['Mist', 'Haze'].includes(weatherType))return'bg-gray-300';
    return 'bg-amber-400';
}


// 5-days WeatherForcast
async function getExtendedForcast(city, lat=null, lon=null) {

  const urlCity = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const urlLatLon = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

  const url = lat && lon ? urlLatLon : urlCity

  try{
    const response = await fetch(url);
    
    if (!response.ok){
      throw new Error('city not found');
    }
    const json = await response.json();

    const today = new Date().toISOString().split('T')[0]; 
    
    return json.list
    .filter(item => !item.dt_txt.startsWith(today)) //Skip today data
    .filter(item => item.dt_txt.includes("12:00:00")) // include only one weatherdata for a day
    .map(item =>{
       return {
          date: item.dt_txt.split(" ")[0],
          temp: item.main.temp,
          weather: item.weather[0]?.main || 'not available',
          weatherIcon: item.weather[0]?.icon || '01d',
          feelsLike: item.main.feels_like,
          humidity: `${item.main.humidity}%`,
          windSpeed: `${item.wind.speed}m/s`,
          windGust: `${item.wind.gust}m/s` || '-'
       } 
    }).map(item =>{
      item.bgColor = getWeatherColor(item.weather); // get color based on weatherType
      return item;
    });
  }
  catch(err){
    throw err
  }

}


function displayExtendedForcast(data){

  const extendedForcastElem = document.querySelector('#extendedForcast');
 
  extendedForcastElem.innerHTML = data.map((item)=>{
    // extended forcast card
    return `
      <div class="bg-white p-4 flex gap-x-4 shadow-md w-full mx-auto rounded-sm">

        <div class="${item.bgColor} w-[40%] h-full flex flex-col justify-center items-center p-2 shadow-md rounded-sm relative">
          <p class="absolute left-2 top-0 text-black/50">${item.date}</p>
          <img src="https://openweathermap.org/img/wn/${item.weatherIcon}@2x.png" alt="" class="w-30 h-20 object-contain">
          <h3 class="font-black text-xl">${item.temp}&deg;c</h3>
        </div>

        <div class="w-[60%]  space-y-3">
         
          <div class="flex justify-end tex-2xl font-black">
            <p>${item.weather}</p>
          </div>

          <div class="flex justify-between border-b border-gray-300/50">
            <p>Humidity</p>
            <p>${item.humidity}</p>
          </div>

          <div class="flex justify-between border-b border-gray-300/50">
            <p>Wind</p>
            <p>${item.windSpeed}</p>
          </div>

          <div class="flex justify-between border-b border-gray-300/50">
            <p>Wind gust</p>
            <p>${item.windGust}</p>
          </div>

        </div>
      </div>`
  }).join('');
}


async function  displayWeather(city,lat,lon) {
 ShowLoader(); // show loader

 try{
    const [currentWeather, extendWeather] = await Promise.all([
      getCurrentWeather(city,lat,lon),
      getExtendedForcast(city,lat,lon)
    ]);

    displayCurrentWeather(currentWeather);
    displayExtendedForcast(extendWeather);
 }
  catch (err) {
    displayPopup(err.message);
 }
 finally{
  stopLoader(); // hide loader;
  hideOverlayDropdown(); //hide overlay and dropdown
 }
}

displayWeather(defaultCity);


window.addEventListener('beforeunload', ()=> {
  localStorage.setItem('recentSearch', recentList); // save to local storage.
});

window.addEventListener('load',()=>{
  recentSearch = localStorage.getItem('recentSearch'); // get the recent-search if there.
  if(recentSearch)recentList = recentSearch.split(',');
})


document.getElementById('live-btn').addEventListener('click',()=>{
  ShowLoader()
  // Check if geolocation is supported
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        displayWeather(null, latitude, longitude)
      },
    );
  } else {
    displayPopup('Geolocation is not supported by your browser.')
  }
});

