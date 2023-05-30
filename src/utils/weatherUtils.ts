import { WeatherResponseType } from '@/types/weatherResponse.js';

export async function getCurrentWeatherByLatLong (latitude: number, longitude:number) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_KEY}&q=${latitude},${longitude}`
    const res = await fetch(url);
    return res.json();
}

export const parseWeather = (weather: WeatherResponseType) => {
    const condition: string = weather.current.condition.text.toLowerCase();
    if (condition.includes('sunny')){
      return 'Sunny';
    }
    if(condition.includes('cloudy') || condition.includes('overcast')){        
        return 'Cloudy';
      }      
    if(condition.includes('rain') || condition.includes('drizzle')){
      return 'Rainy';
    }
    if(condition.includes('clear')){
      return 'Clear' 
    }
    return 'Snowy';
  }

export const backgroundFromWeather = (weather: string) => {
    if(weather === 'Cloudy'){
     return '/clouds.jpeg';
    }
    if(weather === 'Rainy'){
     return '/rain.jpeg';
    }
    if(weather === 'Sunny'){
     return '/sunny.jpeg';
    }
    if(weather === 'Snowy'){
     return '/snow.jpeg';
    }
    return '/clear.jpeg';
  }