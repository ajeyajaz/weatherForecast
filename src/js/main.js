import {getCurrentWeather, getExtendedForcast } from "./api.js";
import {
  displayCurrentWeather,
  displayExtendedForcast,
  displayPopup,
  ShowLoader,
  stopLoader,
  showOverlay,
  hideOverlay,
  showDropdown,
  hideDropdown} from './ui.js'
import { saveRecentCities, loadRecentCities } from "./storage.js";

let isCelsius = true;
let recentList = loadRecentCities();
const defaultCity = "London";



document.querySelector('#search-city').addEventListener('focus',()=>{
  showOverlay();
  showDropdown(recentList);
});


document.addEventListener('click', e=>{
  // if clicked elem not searchIput or dropdown items hide overlay and dropdown.
  const clickedElem = document.querySelector('#search-city').contains(e.target) || document.querySelector('#recent-list').contains(e.target);
  if(!clickedElem){
    hideOverlay();
    hideDropdown(); 
  };
});


async function  displayWeather(city,lat,lon) {
 ShowLoader(); // show loader

 try{
    const [current, forecast] = await Promise.all([
      getCurrentWeather(city,lat,lon),
      getExtendedForcast(city,lat,lon)
    ]);

    displayCurrentWeather(current,isCelsius);
    displayExtendedForcast(forecast);
 }
  catch (err) {
    displayPopup(err.message);
 }
 finally{
  stopLoader(); // hide loader;
 }
}


document.querySelector('form').addEventListener('submit',(event)=>{
  event.preventDefault();

  const searchELement = document.querySelector('#search-city');
  const city = searchELement.value.trim().toLowerCase();
  
  if (!city){
    displayPopup('City cannot be empty.');
    return;
  }
  if(!recentList.includes(city)) recentList.push(city); // if new city search, add to history.
  displayWeather(city);

  // clean input field.
  searchELement.value = '';
  saveRecentCities(recentList);
});


//current location
document.getElementById("live-btn").addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
      displayWeather(null, pos.coords.latitude, pos.coords.longitude);
    });
  } else {
    displayPopup("Geolocation not supported.");
  }
});

document.querySelector('#recent-list').addEventListener('click', e =>{
  e.stopPropagation(); 
  const item = e.target
  if(item.tagName === 'LI'){
    displayWeather(e.target.innerText); // click happens on dropdown item, fetch weather.
    hideOverlay();
    hideDropdown();
  }; 
  
  if(item.parentElement.tagName === 'BUTTON'){
    const value = item.parentElement.parentElement.innerText;
    const parent = item.parentElement.parentElement;
    parent.remove();
    recentList.splice(recentList.indexOf(value),1);
    saveRecentCities(recentList);
  }
});


document.getElementById('unit-toggle').addEventListener('click', () => {

  isCelsius = !isCelsius;
  const toggleBtn = document.getElementById('unit-toggle');
  toggleBtn.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';

   // Re-render the current weather
  const location = document.getElementById('weather-location').innerText;
  displayWeather(location);

})

window.addEventListener("load", () => displayWeather(defaultCity));
