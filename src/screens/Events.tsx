import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParams } from '../navigation/types';
import { Back, Detail, Heading, Screen, ResortImage } from '../components/UI';
import { useResponsive } from '../hooks/useResponsive';
import { events } from '../data/catalog';
import { styles as s } from '../theme';
import { displayDate } from '../utils/date';
export function EventsScreen({
  navigation,
}: NativeStackScreenProps<EventsStackParams, 'Events'>) {
  const layout = useResponsive();
  return (
    <Screen>
      <Heading title="Beach Events" kicker="By the water" />
      {events.map(event => (
        <Pressable
          accessibilityRole="button"
          key={event.id}
          onPress={() => navigation.navigate('EventDetail', { id: event.id })}
          style={s.card}
        >
          <ResortImage source={event.image} aspectRatio={1.95} />
          <View
            style={[
              s.between,
              { alignItems: 'flex-start' },
              layout.stacked && { flexDirection: 'column' },
            ]}
          >
            <Text style={[s.title, { fontSize: 25, lineHeight: 31, flex: 1 }]}>
              {event.name}
            </Text>
            <Text style={s.badge}>FREE ENTRY</Text>
          </View>
          <Text style={s.muted}>{event.description}</Text>
          <Text style={s.text}>
            {event.date ? displayDate(event.date) : 'Date to be announced'}
            {event.time ? `   ◷ ${event.time}` : ''}
          </Text>
        </Pressable>
      ))}
    </Screen>
  );
}
export function EventDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<EventsStackParams, 'EventDetail'>) {
  const event = events.find(x => x.id === route.params.id)!;
  return (
    <Screen>
      <Back onPress={() => navigation.goBack()} />
      <Heading title={event.name} kicker="Beach event" />
      <ResortImage source={event.image} />
      <View>
        <Detail
          label="Date"
          value={event.date ? displayDate(event.date) : 'To be announced'}
        />
        <Detail label="Start time" value={event.time || 'To be announced'} />
        <Detail label="Location" value={event.location || 'To be announced'} />
        <Detail label="Entry" value="Free Entry" />
      </View>
      <Text style={s.muted}>{event.description}</Text>
      <Text style={s.eyebrow}>Programme</Text>
      {event.programme ? (
        event.programme.map(([time, description]) => (
          <Detail key={time} label={time} value={description} />
        ))
      ) : (
        <View style={s.card}>
          <Text style={s.muted}>
            The detailed programme, date and location have not been provided
            yet. Check with reception before planning your visit.
          </Text>
        </View>
      )}
    </Screen>
  );
}
