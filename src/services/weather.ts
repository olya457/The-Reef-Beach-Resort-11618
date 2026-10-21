export type Hour = {
  time: string;
  temperature: number | null;
  clouds: number | null;
  wind: number | null;
  direction: number | null;
  rain: number | null;
  uv: number | null;
  code: number | null;
  water: number | null;
};
export type ForecastDay = {
  date: string;
  sunrise: string;
  sunset: string;
  hours: Hour[];
};
async function getJSON(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('Weather service is unavailable. Please try again.');
  }
  return response.json();
}
export async function getForecast(
  latitude: number,
  longitude: number,
  signal: AbortSignal,
): Promise<ForecastDay[]> {
  const query = `latitude=${latitude}&longitude=${longitude}&timezone=auto&forecast_days=7`;
  const [weather, marine] = await Promise.all([
    getJSON(
      `https://api.open-meteo.com/v1/forecast?${query}&hourly=temperature_2m,cloud_cover,wind_speed_10m,wind_direction_10m,precipitation_probability,uv_index,weather_code&daily=sunrise,sunset`,
      signal,
    ),
    getJSON(
      `https://marine-api.open-meteo.com/v1/marine?${query}&hourly=sea_surface_temperature`,
      signal,
    ).catch(() => null),
  ]);
  if (!weather?.daily?.time || !weather?.hourly?.time) {
    throw new Error('Forecast data is unavailable for this location.');
  }
  return weather.daily.time.map((date: string, i: number) => ({
    date,
    sunrise: weather.daily.sunrise?.[i]?.slice(11, 16) || 'Unavailable',
    sunset: weather.daily.sunset?.[i]?.slice(11, 16) || 'Unavailable',
    hours: weather.hourly.time.flatMap((time: string, h: number) => {
      if (!time.startsWith(date)) {
        return [];
      }
      const waterIndex = marine?.hourly?.time?.indexOf(time) ?? -1;
      return [
        {
          time: time.slice(11, 16),
          temperature: weather.hourly.temperature_2m?.[h] ?? null,
          clouds: weather.hourly.cloud_cover?.[h] ?? null,
          wind: weather.hourly.wind_speed_10m?.[h] ?? null,
          direction: weather.hourly.wind_direction_10m?.[h] ?? null,
          rain: weather.hourly.precipitation_probability?.[h] ?? null,
          uv: weather.hourly.uv_index?.[h] ?? null,
          code: weather.hourly.weather_code?.[h] ?? null,
          water:
            waterIndex >= 0
              ? marine.hourly.sea_surface_temperature?.[waterIndex] ?? null
              : null,
        },
      ];
    }),
  }));
}
export function condition(code: number | null) {
  if (code === null) {
    return 'Unavailable';
  }
  if (code === 0) {
    return 'Sunny';
  }
  if (code <= 3) {
    return 'Cloudy';
  }
  if (code <= 48) {
    return 'Foggy';
  }
  if (code <= 67) {
    return 'Rainy';
  }
  if (code <= 77) {
    return 'Snowy';
  }
  if (code <= 82) {
    return 'Showers';
  }
  if (code <= 86) {
    return 'Snow showers';
  }
  return 'Thunderstorm';
}
export function windDirection(value: number | null) {
  return value === null
    ? ''
    : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(value / 45) % 8];
}
