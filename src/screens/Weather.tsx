import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Button, Field, Heading, Icon, Screen } from '../components/UI';
import { DatePicker } from '../components/DatePicker';
import { useResort } from '../store/ResortStore';
import {
  condition,
  ForecastDay,
  getForecast,
  windDirection,
} from '../services/weather';
import { useResponsive } from '../hooks/useResponsive';
import { colors, styles as s } from '../theme';
import { dateKey, displayDate } from '../utils/date';
const value = (n: number | null | undefined, suffix = '') =>
  n == null ? 'Unavailable' : `${Math.round(n * 10) / 10}${suffix}`;
export function WeatherScreen() {
  const layout = useResponsive();
  const { state, update } = useResort();
  const [editing, setEditing] = useState(!state.location.latitude);
  const [name, setName] = useState(state.location.name);
  const [latitude, setLatitude] = useState(state.location.latitude);
  const [longitude, setLongitude] = useState(state.location.longitude);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [date, setDate] = useState(dateKey(new Date()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (!state.location.latitude || !state.location.longitude) {
      return;
    }
    const controller = new AbortController();
    let active = true;
    const timer = setTimeout(() => controller.abort(), 20000);
    setLoading(true);
    setError('');
    setForecast([]);
    getForecast(
      Number(state.location.latitude),
      Number(state.location.longitude),
      controller.signal,
    )
      .then(data => {
        if (active) {
          setForecast(data);
          if (data[0]) {
            setDate(data[0].date);
          }
        }
      })
      .catch(() => {
        if (active) {
          setError(
            'Forecast could not be loaded. Check your connection and beach coordinates.',
          );
        }
      })
      .finally(() => {
        clearTimeout(timer);
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [state.location.latitude, state.location.longitude, refresh]);
  const day = forecast.find(x => x.date === date);
  const hour = day?.hours.find(x => x.time === '12:00') || day?.hours[0];
  const valid =
    latitude.trim() !== '' &&
    longitude.trim() !== '' &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude)) &&
    Math.abs(Number(latitude)) <= 90 &&
    Math.abs(Number(longitude)) <= 180;
  const save = () => {
    if (!valid) {
      return;
    }
    update(st => ({
      ...st,
      location: {
        name: name.trim(),
        latitude: latitude.trim(),
        longitude: longitude.trim(),
      },
    }));
    setEditing(false);
    setRefresh(x => x + 1);
  };
  return (
    <Screen>
      <Heading
        title="Weather"
        kicker={state.location.name || 'Beach forecast'}
      />
      {editing ? (
        <View style={s.card}>
          <Text style={s.label}>Your beach location</Text>
          <Text style={s.muted}>
            Enter the beach coordinates to load its live forecast.
          </Text>
          <Field
            accessibilityLabel="Beach name"
            placeholder="Beach name (optional)"
            value={name}
            onChangeText={setName}
          />
          <Field
            accessibilityLabel="Latitude"
            placeholder="Latitude (−90 to 90)"
            value={latitude}
            onChangeText={setLatitude}
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
          />
          <Field
            accessibilityLabel="Longitude"
            placeholder="Longitude (−180 to 180)"
            value={longitude}
            onChangeText={setLongitude}
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
          />
          <Button
            title="Save & Load Forecast"
            disabled={!valid}
            onPress={save}
          />
        </View>
      ) : (
        <View style={s.row}>
          <Button
            style={{ flex: 1 }}
            title="Change Beach"
            secondary
            onPress={() => setEditing(true)}
          />
          <Button
            style={{ flex: 1 }}
            title="Refresh"
            disabled={loading}
            secondary
            onPress={() => setRefresh(x => x + 1)}
          />
        </View>
      )}
      {loading && <ActivityIndicator color={colors.blue} size="large" />}
      {!!error && (
        <View style={s.card}>
          <Text style={s.muted}>{error}</Text>
          <Button title="Try Again" onPress={() => setRefresh(x => x + 1)} />
        </View>
      )}
      {forecast.length > 0 && (
        <>
          <DatePicker
            value={date}
            onChange={setDate}
            dates={forecast.map(x => x.date)}
          />
          {hour ? (
            <>
              <View
                style={[
                  s.card,
                  { backgroundColor: colors.raised, padding: 24 },
                ]}
              >
                <Text style={s.muted}>{displayDate(date)} · 12:00</Text>
                <View style={s.between}>
                  <View>
                    <Text style={s.title}>{condition(hour.code)}</Text>
                    <Text
                      style={[
                        s.text,
                        { fontSize: 42, lineHeight: 55, marginTop: 12 },
                      ]}
                    >
                      {value(hour.temperature, '°C')}
                    </Text>
                  </View>
                  <Icon
                    name={hour.code === 0 ? 'sun' : 'weather'}
                    color={colors.blue}
                    size={56}
                  />
                </View>
              </View>
              <View style={s.grid}>
                {[
                  ['Air', value(hour.temperature, '°C')],
                  ['Water', value(hour.water, '°C')],
                  [
                    'Wind',
                    `${value(hour.wind, ' km/h')} ${windDirection(
                      hour.direction,
                    )}`,
                  ],
                  ['Cloud cover', value(hour.clouds, '%')],
                  ['Chance of rain', value(hour.rain, '%')],
                  ['UV index', value(hour.uv)],
                  ['Sunrise', day?.sunrise || 'Unavailable'],
                  ['Sunset', day?.sunset || 'Unavailable'],
                ].map(([label, reading]) => (
                  <View
                    key={label}
                    style={[
                      s.card,
                      s.cell,
                      layout.stacked && { flexBasis: '100%' },
                      { minHeight: 115 },
                    ]}
                  >
                    <Text style={{ color: colors.blue }}>◇</Text>
                    <Text style={s.muted}>{label}</Text>
                    <Text style={s.label}>{reading}</Text>
                  </View>
                ))}
              </View>
              <Text style={s.eyebrow}>Hourly · Local beach time</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {day?.hours.map(h => (
                  <View
                    key={h.time}
                    style={[s.card, { alignItems: 'center', minWidth: 76 }]}
                  >
                    <Text style={s.muted}>{h.time}</Text>
                    <Icon name={h.code === 0 ? 'sun' : 'weather'} />
                    <Text style={s.text}>{value(h.temperature, '°')}</Text>
                    <Text style={s.muted}>{value(h.rain, '%')}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <Text style={s.muted}>
              Forecast data is not available for this date yet.
            </Text>
          )}
        </>
      )}
      <Text
        style={s.muted}
        onPress={() => Linking.openURL('https://open-meteo.com/')}
      >
        Weather data by Open-Meteo · CC BY 4.0
      </Text>
    </Screen>
  );
}
