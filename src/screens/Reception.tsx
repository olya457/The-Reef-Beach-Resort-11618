import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Button, Field, Heading, Screen } from '../components/UI';
import { quickRequests } from '../data/catalog';
import { makeRequest, RequestStatus, useResort } from '../store/ResortStore';
import { useResponsive } from '../hooks/useResponsive';
import { colors, styles as s } from '../theme';
import { dateKey, validPlace } from '../utils/date';
export function ReceptionScreen() {
  const layout = useResponsive();
  const { state, update } = useResort();
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState('');
  const saved =
    state.reservations.find(x => x.date === dateKey(new Date())) ||
    state.reservations.find(x => x.date >= dateKey(new Date()));
  const [place, setPlace] = useState(saved ? String(saved.place) : '');
  const [comment, setComment] = useState('');
  useEffect(() => {
    if (saved) {
      setPlace(String(saved.place));
    }
  }, [saved]);
  const send = (title: string, note: string) => {
    if (!validPlace(place) || !title.trim()) {
      return;
    }
    update(st => ({
      ...st,
      requests: [
        ...st.requests,
        makeRequest(title.trim(), note.trim(), place.trim()),
      ],
    }));
    setMessage('');
    setSelected('');
    setComment('');
  };
  const changeStatus = (id: string, status: RequestStatus) =>
    update(st => ({
      ...st,
      requests: st.requests.map(r => (r.id === id ? { ...r, status } : r)),
    }));
  return (
    <Screen>
      <Heading title="Reception" kicker="We are here to help" />
      <View style={s.card}>
        <View style={s.row}>
          <View style={[s.card, s.selected, { padding: 10 }]}>
            <Text style={s.text}>R</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Reception</Text>
            <Text style={s.muted}>Personal request log</Text>
          </View>
        </View>
        <Text style={s.muted}>
          Save what you need and show it to reception. Requests stay on your
          device; update their status when staff helps you.
        </Text>
        <View style={{ minHeight: 120, gap: 12 }}>
          {state.requests.length === 0 ? (
            <Text style={s.muted}>
              Your messages and requests will appear here.
            </Text>
          ) : (
            state.requests.map(request => (
              <View
                key={request.id}
                style={[s.card, { backgroundColor: colors.raised }]}
              >
                <View style={s.between}>
                  <Text style={[s.label, { flex: 1 }]}>{request.title}</Text>
                  <Pressable
                    accessibilityLabel="Remove request"
                    hitSlop={12}
                    onPress={() =>
                      Alert.alert(
                        'Remove request?',
                        'This removes the request from your history.',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Remove',
                            style: 'destructive',
                            onPress: () =>
                              update(st => ({
                                ...st,
                                requests: st.requests.filter(
                                  x => x.id !== request.id,
                                ),
                              })),
                          },
                        ],
                      )
                    }
                  >
                    <Text style={s.muted}>×</Text>
                  </Pressable>
                </View>
                {!!request.comment && (
                  <Text style={s.text}>{request.comment}</Text>
                )}
                <Text style={s.muted}>
                  Place {request.place} ·{' '}
                  {new Date(request.date).toLocaleString()}
                </Text>
                <Text
                  style={{
                    color:
                      request.status === 'Completed'
                        ? colors.green
                        : request.status === 'In progress'
                        ? colors.gold
                        : colors.accent,
                  }}
                >
                  {request.status === 'Sent' ? 'Saved · Sent' : request.status}
                </Text>
                {request.status !== 'Completed' && (
                  <Button
                    title={
                      request.status === 'Sent'
                        ? 'Mark In Progress'
                        : 'Mark Completed'
                    }
                    secondary
                    onPress={() =>
                      changeStatus(
                        request.id,
                        request.status === 'Sent' ? 'In progress' : 'Completed',
                      )
                    }
                  />
                )}
              </View>
            ))
          )}
        </View>
        <Text style={s.muted}>Confirm your lounger number</Text>
        <Field
          accessibilityLabel="Reception lounger number"
          placeholder="Place number"
          keyboardType="number-pad"
          maxLength={2}
          value={place}
          onChangeText={setPlace}
        />
        {!!place && !validPlace(place) && (
          <Text style={{ color: colors.gold }}>
            Use a valid place number from the beach plan.
          </Text>
        )}
        <Field
          accessibilityLabel="Message to reception"
          placeholder="Write a message"
          multiline
          maxLength={1000}
          value={message}
          onChangeText={setMessage}
        />
        <Button
          title="Save Message"
          disabled={!message.trim() || !validPlace(place)}
          onPress={() => send(message, '')}
        />
      </View>
      <Text style={s.eyebrow}>Quick requests</Text>
      <View style={s.grid}>
        {quickRequests.map(title => (
          <Pressable
            accessibilityRole="button"
            key={title}
            onPress={() => setSelected(title)}
            style={[
              s.card,
              s.cell,
              layout.stacked && { flexBasis: '100%' },
              selected === title && s.selected,
            ]}
          >
            <Text style={[s.label, { minHeight: 46 }]}>{title}</Text>
            <Text style={s.muted}>+ Tap to request</Text>
          </Pressable>
        ))}
      </View>
      {!!selected && (
        <View style={[s.card, { borderColor: colors.accent }]}>
          <Text style={s.label}>{selected}</Text>
          <Text style={s.muted}>
            Place {place || 'not selected'} · Saved locally
          </Text>
          <Field
            accessibilityLabel="Request comment"
            placeholder="Comment (optional)"
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={500}
          />
          <Button
            title="Save Request"
            disabled={!validPlace(place)}
            onPress={() => send(selected, comment)}
          />
          <Button title="Cancel" secondary onPress={() => setSelected('')} />
        </View>
      )}
    </Screen>
  );
}
