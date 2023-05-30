'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { getCurrentWeatherByLatLong, parseWeather, backgroundFromWeather } from '@/utils/weatherUtils'
import { WeatherResponseType } from '@/types/weatherResponse.js';

export default function Home() {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [weatherBg, setWeatherBg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  // const ip = useUserIp();
  useEffect(()=> {
    const successCallback = async (position: GeolocationPosition) => {
      const {latitude, longitude} = position.coords
      const mapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.MAPS_API_KEY}`
      const mapsApiResponse = await fetch(mapsUrl, {
        method: 'POST',
        mode: 'cors',
      });
      const {results, errors} = await mapsApiResponse.json()

      if(mapsApiResponse.ok) {
        results[0].address_components.forEach(address => {
          if(address.types.includes('locality')){
            setCity(address.long_name);
          }
        });
        await getWeatherData(latitude, longitude);
      } else {
        const error = new Error(errors?.map(e => e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
      }
    };

    global.navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  useEffect(()=> {
    setWeatherBg(backgroundFromWeather(weather));
  }, [weather])

  const getWeatherData = async (latitude: number, longitude: number) =>{
    const weatherResponse: WeatherResponseType = await getCurrentWeatherByLatLong(latitude, longitude)
    setWeather(parseWeather(weatherResponse));
    setLoading(false);
  }

  const errorCallback = (error) => {
    console.error(error);
  };
  
  return (
    <main>
      {!loading &&
        <div className="flex relative items-center h-screen w-screen">
          {weatherBg && <Image
            className="flex dark:drop-shadow-[0_0_0.3rem_#ffffff70] h-full w-full blur"
            src={weatherBg}
            alt="background"
            width={2000}
            height={500}
          />}
          {city && 
            <div className="absolute top-1/2 left-1/3 self-center text-xl font-mono font-bold z-1000 bg-slate-950/[.3]"> 
              It is {weather} in {city}.
            </div>
          }
          {!city && 
            <div className="absolute top-1/2 left-1/3 self-center text-xl font-mono font-bold z-1000 bg-slate-950/[.3]"> 
              Hey! I don&apos;t know where you&apos;re from. Mind sharing location on the top left?
            </div>
          }
        </div>
      }
      {loading && 
        <div className="flex relative items-center h-screen w-screen">
          <div className="absolute top-1/2 left-1/3 self-center text-xl font-mono font-bold z-1000"> 
            Loading.
          </div>
        </div>
      }
    </main>
  )
};
