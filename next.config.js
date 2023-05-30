/** @type {import('next').NextConfig} */
const nextConfig = {
    env: { 
        MAPS_API_KEY: process.env.MAPS_API_KEY,
        WEATHER_KEY: process.env.WEATHER_KEY
     }

}

module.exports = nextConfig
