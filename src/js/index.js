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
 ShowLoader(); // show loader

 try{
    const currentweather = await getCurrentWeather(city);  
    displayCurrentWeather(currentweather);
 }
  catch (err) {
    console.log('Something went wrong:', err.message);
    showErrorPopup(err.message);
 }
 finally{
  stopLoader(); // hide loader;
 }

}

callCurrentWeather('landon');



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
  callCurrentWeather(cityName);

  // remove overlay when search is done
  document.querySelector('#overlay').classList.add('hidden');
  searchELement.value = '';

})
