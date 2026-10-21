import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles as s } from '../theme';
import { nextDays } from '../utils/date';
export function DatePicker({
  value,
  onChange,
  days = 30,
  dates,
}: {
  value: string;
  onChange: (date: string) => void;
  days?: number;
  dates?: string[];
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {(dates || nextDays(days)).map(day => {
        const d = new Date(`${day}T12:00:00`);
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: day === value }}
            accessibilityLabel={d.toDateString()}
            key={day}
            onPress={() => onChange(day)}
            style={[
              s.card,
              { minWidth: 65, alignItems: 'center', padding: 12, gap: 5 },
              day === value && s.selected,
            ]}
          >
            <Text style={s.muted}>
              {d.toLocaleDateString('en', { weekday: 'short' })}
            </Text>
            <Text style={[s.label, { fontSize: 22 }]}>{d.getDate()}</Text>
            <View>
              <Text style={s.muted}>
                {d.toLocaleDateString('en', { month: 'short' })}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
