import { NextResponse } from "next/server"

const HANOI_LAT = 21.0285
const HANOI_LON = 105.8542

export async function GET() {
  const apiKey = process.env.WEATHER_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Weather API key not configured" }, { status: 500 })
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${HANOI_LAT}&lon=${HANOI_LON}&appid=${apiKey}&units=metric&lang=vi`

  const response = await fetch(url, {
    next: { revalidate: 600 },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
    console.error("Weather API error:", response.status, errorData)
    
    if (response.status === 401) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }
    
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: response.status })
  }

  const data = await response.json()

  const weatherData = {
    temp: data.main.temp,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind?.speed || 0,
    icon: data.weather[0].icon,
    feelsLike: data.main.feels_like,
  }

  return NextResponse.json(weatherData)
}

