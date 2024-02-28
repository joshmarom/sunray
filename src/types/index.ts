import weatherIconsList from '@/types/weatherIconsList';
import weatherConditions from '@/types/weatherConditions';

export interface Forecast {
  forecastday: ForecastDay[];
}

export interface WithForecast {
  forecast: Forecast;
}

export interface WeatherData extends WithForecast {
  location: Location;
  current: CurrentWeather;
}

export interface Condition {
  text: ConditionText;
  icon: string;
  code: number;
}

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface CurrentWeather {
  time_epoch: number;
  time: string;
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    condition: Condition;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
  };
  hour: Array<CurrentWeather>;
}

export type ConditionText = string & typeof weatherConditions[number];

export type WeatherIcon = typeof weatherIconsList[number];
