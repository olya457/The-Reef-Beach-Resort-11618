import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Button, Field, Heading, Icon, Screen } from '../components/UI';
import { useResort } from '../store/ResortStore';
import { colors, styles as s } from '../theme';
import { ProgressBar } from '../components/Motion';
import { useResponsive } from '../hooks/useResponsive';
import { uid } from '../utils/date';
export function ChecklistScreen() {
  const { state, update } = useResort();
  const [name, setName] = useState('');
  const layout = useResponsive();
  const packed = state.checklist.filter(x => x.checked).length;
  const add = () => {
    if (!name.trim()) {
      return;
    }
    update(st => ({
      ...st,
      checklist: [
        ...st.checklist,
        { id: uid(), name: name.trim(), checked: false },
      ],
    }));
    setName('');
  };
  return (
    <Screen>
      <Heading title="Beach Checklist" kicker="Before you arrive" />
      <View style={[s.card, { backgroundColor: colors.raised, padding: 20 }]}>
        <View style={s.between}>
          <Text
            style={[s.label, { flex: 1, fontSize: layout.compact ? 18 : 21 }]}
          >
            {packed} of {state.checklist.length} packed
          </Text>
          <Button
            title="Reset"
            secondary
            onPress={() =>
              Alert.alert(
                'Reset checklist?',
                'Uncheck all items for your next visit. Your custom items will stay.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Reset',
                    onPress: () =>
                      update(st => ({
                        ...st,
                        checklist: st.checklist.map(x => ({
                          ...x,
                          checked: false,
                        })),
                      })),
                  },
                ],
              )
            }
          />
        </View>
        <ProgressBar
          value={state.checklist.length ? packed / state.checklist.length : 0}
        />
      </View>
      <View
        style={[
          s.row,
          layout.stacked && { flexDirection: 'column', alignItems: 'stretch' },
        ]}
      >
        <Field
          accessibilityLabel="New checklist item"
          placeholder="Add your own item"
          value={name}
          onChangeText={setName}
          maxLength={100}
          onSubmitEditing={add}
          returnKeyType="done"
          style={{ flex: 1 }}
        />
        <Button title="+ Add" onPress={add} disabled={!name.trim()} />
      </View>
      {state.checklist.length ? (
        <View style={[s.card, { padding: 0, gap: 0 }]}>
          {state.checklist.map(item => (
            <View
              key={item.id}
              style={[
                s.row,
                {
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.checked }}
                accessibilityLabel={item.name}
                onPress={() =>
                  update(st => ({
                    ...st,
                    checklist: st.checklist.map(x =>
                      x.id === item.id ? { ...x, checked: !x.checked } : x,
                    ),
                  }))
                }
                style={[s.row, { flex: 1, paddingVertical: 18 }]}
              >
                <View
                  style={{
                    height: 25,
                    width: 25,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: item.checked ? colors.green : colors.muted,
                    backgroundColor: item.checked
                      ? colors.green
                      : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.checked && <Text style={{ color: colors.bg }}>✓</Text>}
                </View>
                <Text
                  style={[
                    s.text,
                    {
                      flex: 1,
                      color: item.checked ? colors.muted : colors.text,
                      textDecorationLine: item.checked
                        ? 'line-through'
                        : 'none',
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Delete ${item.name}`}
                hitSlop={12}
                onPress={() =>
                  update(st => ({
                    ...st,
                    checklist: st.checklist.filter(x => x.id !== item.id),
                  }))
                }
              >
                <Icon name="trash" size={18} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={s.muted}>
          Your checklist is empty. Add what you want to bring.
        </Text>
      )}
    </Screen>
  );
}
