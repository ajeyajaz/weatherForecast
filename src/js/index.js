function addOverlay(){
  document.getElementById('overlay').classList.remove('hidden');
}

function removeOverlay(){
  document.getElementById('overlay').classList.add('hidden');
} 

{
  // add overalay when search happens
const searchField = document.querySelector('#search-city');
searchField.addEventListener('focus', addOverlay);
searchField.addEventListener('blur', removeOverlay);
}

function showErrorPopup(message){

  const popup = document.querySelector('#error-msg');
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


const apiKey = "5614665fe82de178e15334d554e30c97";

// Current Weather

async function getCurrentWeather(city){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try{
    const response = await fetch(url);
    const json = await response.json();



    if(!response.ok){
      throw new Error('city not found');
    }

    if(response.ok){


      const temp = json.main.temp;
      const humidity = json.main.humidity;
      const windSpeed = json.wind.speed;
      const realFeel = json.main.feels_like;
      const location = json.name;
      const icon = json.weather?.[0]?.icon || '01d'; //default icon if not available.

      return {
        headInfo: {
          temprature: temp,
          realFeel: realFeel,
          location: location,
          icon: icon
        },

        bodyInfo:[
          {label: 'Temp', value:temp},
          {label: 'Humidity', value:humidity},
          {label: 'wind speed', value: `E ${windSpeed}km/h`},
      ]
    };
      
    }
  }
  catch(err){
    throw err;
  }

}


function displayCurrentWeather(data){
  
  const locationElem = document.getElementById('weather-location');
  const iconElem = document.querySelector('.current-weather img');
  const tempElem = document.getElementById('curr-weather-temp');
  const realFeelElem = document.getElementById('curr-weather-realfeel')
  const container = document.getElementById('current-weather-body');

  
  iconElem.setAttribute('src',`https://openweathermap.org/img/wn/${data.headInfo.icon}@2x.png`);
  tempElem.innerHTML = `${data.headInfo.temprature}&deg;<span class="text-[1rem]  tracking-tighter">c</span>`
  locationElem.innerText = `Current Weather(${data.headInfo.location})`;
  realFeelElem.innerHTML = `RealFeeL ${data.headInfo.realFeel}&deg;`;
  
  container.innerHTML = data.bodyInfo.map((item) => (
    `<div class="flex justify-between border-b border-gray-200">
        <span>${item.label}</span><span class="font-bold">${item.value}</span>
    </div>`
    )).join('');
}


const form = document.querySelector('form');
console.log(form)

form.addEventListener('submit',(event)=>{
  event.preventDefault();

  const searchELement = form.querySelector('#search-city');
  const cityName = searchELement.value.trim();
  
  if (!cityName){
    showErrorPopup('City cannot be empty.');
    return;
  }
  displayWeather(cityName);

  // remove overlay when search is done
  document.querySelector('#overlay').classList.add('hidden');
  searchELement.value = '';

});


function getWeatherColor(weatherType){

    if(weatherType === 'Clear')return'bg-sky-400';
    if(weatherType === 'Clouds')return'bg-blue-300';
    if(weatherType === 'Rain')return'bg-slate-600';
    if(weatherType === 'Thunderstorm')return'bg-gray-800';
    if(weatherType === 'Snow')return'bg-cyan-100';
    if (['Mist', 'Haze'].includes(weatherType))return'bg-gray-300';
    return 'bg-amber-400';
}


// 5-days WeatherForcast

async function getExtendedForcast(city) {

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
  try{
    const response = await fetch(url);
    
    if (!response.ok){
      // implement later;
      console.log('bad response in extend weather.')
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
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          windGust: item.wind.gust || '-'
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
  console.log(data);
  extendedForcastElem.innerHTML = data.map((item)=>{

    return `
      <div class="bg-white p-4 flex gap-x-4 shadow-md w-full mx-auto rounded-sm">

        <div class="${item.bgColor} w-[40%] h-full flex flex-col justify-center items-center p-2 shadow-md rounded-sm relative">
          <p class="absolute left-2 top-0 text-black/50">${item.date}</p>
          <img src="https://openweathermap.org/img/wn/${item.weatherIcon}@2x.png" alt="" class="w-30 h-20 object-contain">
          <h3 class="font-black text-xl">${item.temp}&deg;</h3>
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


async function  displayWeather(city) {
 ShowLoader(); // show loader

 try{
    const [currentweather, extendWeather] = await Promise.all([
      getCurrentWeather(city),
      getExtendedForcast(city)
    ]);

    displayCurrentWeather(currentweather);
    displayExtendedForcast(extendWeather);
 }
  catch (err) {
    console.log('Something went wrong:', err.message);
    showErrorPopup(err.message);
 }
 finally{
  stopLoader(); // hide loader;
 }
}

displayWeather('landon');