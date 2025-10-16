// Adding overlay
const overlay = document.getElementById('overlay');
const searchInput = document.getElementById('search-city');


searchInput.addEventListener('focus', addOverlay);

searchInput.addEventListener('blur', removeOverlay);


function addOverlay(){
    overlay.classList.remove('hidden');
}

function removeOverlay(){
    overlay.classList.add('hidden');
}


const apiKey = "5614665fe82de178e15334d554e30c97";

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
          {label: 'wind speed', value: windSpeed},
      ]
    };
      
    }
  }
  catch(err){
    console.log('something went wrong...')
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

async function  callCurrentWeather(city) {

 try{
    const currentweather = await getCurrentWeather(city);  
    displayCurrentWeather(currentweather);
 }
  catch (err) {
    console.log('Something went wrong:', err.message);
 }

}

callCurrentWeather('landon');



const form = document.querySelector('form');
console.log(form)

form.addEventListener('submit',(event)=>{
  event.preventDefault()
  const cityName = form.querySelector('#search-city').value.trim();
  
  if (!cityName){
    // implement later
  }
  callCurrentWeather(cityName)

  


})
