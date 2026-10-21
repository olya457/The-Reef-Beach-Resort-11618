import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BeachStackParams } from '../navigation/types';
import {
  Back,
  Button,
  Detail,
  Heading,
  Screen,
  ResortImage,
} from '../components/UI';
import { DatePicker } from '../components/DatePicker';
import { seating } from '../data/catalog';
import { useResort } from '../store/ResortStore';
import { colors, styles as s } from '../theme';
import { dateKey, displayDate, money, uid } from '../utils/date';
export function ReservationsScreen({
  navigation,
}: NativeStackScreenProps<BeachStackParams, 'Reservations'>) {
  const { state, update } = useResort();
  return (
    <Screen>
      <Heading kicker="Choose your place" title="Beach Reservations" />
      {state.reservations
        .filter(r => r.date >= dateKey(new Date()))
        .map(r => (
          <View key={r.id} style={[s.card, { backgroundColor: colors.raised }]}>
            <Pressable
              onPress={() =>
                navigation.navigate('ReservationConfirmed', { id: r.id })
              }
            >
              <Text style={s.eyebrow}>YOUR SAVED RESERVATION</Text>
              <Text style={s.label}>
                {seating.find(x => x.id === r.type)?.name} · Place {r.place}
              </Text>
              <Text style={s.muted}>{displayDate(r.date)}</Text>
            </Pressable>
            <Button
              title="Cancel reservation"
              secondary
              onPress={() =>
                Alert.alert(
                  'Cancel reservation?',
                  'This removes your saved place.',
                  [
                    { text: 'Keep', style: 'cancel' },
                    {
                      text: 'Cancel reservation',
                      style: 'destructive',
                      onPress: () =>
                        update(st => ({
                          ...st,
                          reservations: st.reservations.filter(
                            x => x.id !== r.id,
                          ),
                        })),
                    },
                  ],
                )
              }
            />
          </View>
        ))}
      {seating.map(item => (
        <View key={item.id} style={s.card}>
          <ResortImage source={item.image} />
          <View style={s.between}>
            <Text style={[s.label, { flex: 1 }]}>{item.name}</Text>
            <Text style={s.text}>
              {money(item.price)}
              <Text style={s.muted}> / day</Text>
            </Text>
          </View>
          <Text style={s.muted}>{item.short}</Text>
          <Text style={[s.eyebrow, { color: colors.accent }]}>
            {item.capacity === 1 ? '1 GUEST' : `UP TO ${item.capacity} GUESTS`}
          </Text>
          <Button
            title="View & Book"
            onPress={() => navigation.navigate('Booking', { id: item.id })}
          />
        </View>
      ))}
      <Text style={s.muted}>Reservations are saved on this device.</Text>
    </Screen>
  );
}
export function BookingScreen({
  navigation,
  route,
}: NativeStackScreenProps<BeachStackParams, 'Booking'>) {
  const item = seating.find(x => x.id === route.params.id)!;
  const { state, update } = useResort();
  const [date, setDate] = useState(dateKey(new Date()));
  const [place, setPlace] = useState<number>();
  const occupied = state.reservations
    .filter(r => r.date === date)
    .map(r => r.place);
  const confirm = () => {
    if (!place || occupied.includes(place) || date < dateKey(new Date())) {
      Alert.alert('Choose an available place');
      return;
    }
    const id = uid();
    update(st => ({
      ...st,
      reservations: [...st.reservations, { id, type: item.id, place, date }],
    }));
    navigation.replace('ReservationConfirmed', { id });
  };
  return (
    <Screen>
      <Back onPress={() => navigation.goBack()} />
      <Heading title={item.name} kicker="Reservation" />
      <ResortImage source={item.image} aspectRatio={1.4} />
      <View style={s.between}>
        <Text style={s.eyebrow}>
          {item.capacity} {item.capacity === 1 ? 'GUEST' : 'GUESTS'}
        </Text>
        <Text style={s.label}>{money(item.price)} / day</Text>
      </View>
      <Text style={s.muted}>{item.description}</Text>
      <Text style={s.muted}>
        {item.included} Food and drinks can be added to your local order for
        this place.
      </Text>
      <Text style={s.eyebrow}>Date</Text>
      <DatePicker
        value={date}
        onChange={d => {
          setDate(d);
          setPlace(undefined);
        }}
      />
      <View style={s.between}>
        <Text style={s.eyebrow}>Choose your place</Text>
        <Text style={s.muted}>
          {item.places.filter(p => !occupied.includes(p)).length} of{' '}
          {item.places.length} available
        </Text>
      </View>
      <View style={[s.card, { padding: 8 }]}>
        <Text
          style={[
            s.eyebrow,
            {
              textAlign: 'center',
              backgroundColor: colors.raised,
              padding: 14,
            },
          ]}
        >
          SEA
        </Text>
        {seating.map(zone => (
          <View
            key={zone.id}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: zone.id === item.id ? colors.accent : colors.border,
              opacity: zone.id === item.id ? 1 : 0.35,
              gap: 12,
            }}
          >
            <Text style={[s.eyebrow, { fontSize: 9, letterSpacing: 0 }]}>
              ZONE {zone.zone}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {zone.places.map(n => (
                <Pressable
                  key={n}
                  accessibilityRole="button"
                  accessibilityLabel={`Place ${n}${
                    occupied.includes(n) ? ', booked' : ''
                  }`}
                  accessibilityState={{
                    selected: place === n,
                    disabled: zone.id !== item.id || occupied.includes(n),
                  }}
                  disabled={zone.id !== item.id || occupied.includes(n)}
                  onPress={() => setPlace(n)}
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: zone.id === 'single' ? 24 : 3,
                    borderWidth: place === n ? 2 : 1,
                    borderStyle: occupied.includes(n) ? 'dashed' : 'solid',
                    borderColor: place === n ? colors.text : colors.accent,
                    backgroundColor:
                      place === n
                        ? colors.selected
                        : occupied.includes(n)
                        ? colors.raised
                        : colors.card,
                  }}
                >
                  <Text
                    style={[
                      s.text,
                      {
                        textDecorationLine: occupied.includes(n)
                          ? 'line-through'
                          : 'none',
                        color: occupied.includes(n)
                          ? colors.muted
                          : colors.text,
                      },
                    ]}
                  >
                    {n}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <Text style={[s.eyebrow, { textAlign: 'center', padding: 12 }]}>
          CAFÉ AND BOARDWALK
        </Text>
      </View>
      <Text style={s.muted}>
        Outlined · Available Orange · Selected Dashed · Booked
      </Text>
      <View style={s.card}>
        <Detail label="Date" value={displayDate(date)} />
        <Detail label="Category" value={item.name} />
        <Detail label="Place" value={place ? `No. ${place}` : 'Not selected'} />
        <Detail label="Total" value={money(item.price)} />
        <Button
          disabled={!place}
          title={place ? 'Confirm Reservation' : 'Select a Place to Continue'}
          onPress={confirm}
        />
      </View>
    </Screen>
  );
}
export function ReservationConfirmedScreen({
  navigation,
  route,
}: NativeStackScreenProps<BeachStackParams, 'ReservationConfirmed'>) {
  const { state } = useResort();
  const reservation = state.reservations.find(x => x.id === route.params.id);
  if (!reservation) {
    return (
      <Screen>
        <Heading title="Reservation removed" />
        <Button
          title="Back to Reservations"
          onPress={() => navigation.popToTop()}
        />
      </Screen>
    );
  }
  const item = seating.find(x => x.id === reservation.type)!;
  return (
    <Screen>
      <Back onPress={() => navigation.popToTop()} />
      <Heading kicker="Shore Day Planner" title="Reservation Confirmed" />
      <View
        style={[
          s.card,
          {
            backgroundColor: colors.raised,
            borderColor: colors.accent,
            padding: 22,
          },
        ]}
      >
        <Text style={[s.eyebrow, { color: colors.green }]}>
          ✓ SAVED RESERVATION
        </Text>
        <Text style={[s.title, { fontSize: 42, marginVertical: 14 }]}>
          Place {reservation.place}
        </Text>
        <Detail label="Date" value={displayDate(reservation.date)} />
        <Detail label="Seating" value={item.name} />
        <Detail label="Place number" value={String(reservation.place)} />
        <Detail
          label="Capacity"
          value={`${item.capacity} guest${item.capacity > 1 ? 's' : ''}`}
        />
        <Detail label="Total" value={money(item.price)} />
      </View>
      <Text style={s.muted}>
        Your place number is saved and will be prefilled when you create an
        order or a reception request. This is a local reservation on your
        device.
      </Text>
      <Button
        title="Back to Reservations"
        onPress={() => navigation.popToTop()}
      />
    </Screen>
  );
}
