// Current Weather
const API_KEY = "17d07533467ca9cf8b160bce8034bdc3";
const BASE_URL = "https://api.openweathermap.org/data/2.5";


export async function getCurrentWeather(city, lat=null, lon=null){
    
  const url = lat && lon
    ? `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    : `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try{
    const response = await fetch(url);
    const json = await response.json();

    if(!response.ok){
      throw new Error('city not found'); 
    }
    
      return {
        // for header
        headerInfo: {
           temprature: json.main.temp,
            realFeel: json.main.feels_like,
            location: json.name,
            icon: json.weather?.[0]?.icon || "01d",
            weatherType: json.weather?.[0]?.main,
        },

        //for  body
        bodyInfo:[
          {label: 'Humidity', value: `${json.main.humidity}%`},
          {label: 'wind', value: `${json.wind.speed}m/s`},
      ]
    }; 
  }
  catch(err){
    throw err;
  }

}

// 5-days WeatherForcast
export async function getExtendedForcast(city, lat=null, lon=null) {

  const url = lat && lon
    ? `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    : `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try{
    const response = await fetch(url);
    const json = await response.json();
    
  if (!response.ok){
    throw new Error('city not found');
    }
 
    const today = new Date().toISOString().split('T')[0]; //current date
    
    return json.list
    .filter(item => !item.dt_txt.startsWith(today)) //Skip today data
    .filter(item => item.dt_txt.includes("12:00:00")) // include only one weatherdata for a day
    .map(item =>{
       return {
        date: item.dt_txt.split(" ")[0],
        temp: item.main.temp,
        weatherType: item.weather[0]?.main || 'not available',
        weatherIcon: item.weather[0]?.icon || '01d',
        feelsLike: item.main.feels_like,
        humidity: `${item.main.humidity}%`,
        windSpeed: `${item.wind.speed}m/s`,
        windGust: `${item.wind.gust}m/s` || '-'
       } 
    });
  }
  catch(err){
    throw err
  }

}



