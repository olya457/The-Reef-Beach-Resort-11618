import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DiningStackParams } from '../navigation/types';
import {
  Back,
  Button,
  Detail,
  Field,
  Heading,
  Icon,
  Screen,
  ResortImage,
} from '../components/UI';
import { useResponsive } from '../hooks/useResponsive';
import { menu } from '../data/catalog';
import { cartTotal, useResort } from '../store/ResortStore';
import { colors, styles as s } from '../theme';
import { dateKey, money, uid, validPlace } from '../utils/date';
export function MenuScreen({
  navigation,
}: NativeStackScreenProps<DiningStackParams, 'Menu'>) {
  const layout = useResponsive();
  const [category, setCategory] = useState<'Food' | 'Bar'>('Food');
  const { state, add } = useResort();
  const count = state.cart.reduce((sum, x) => sum + x.quantity, 0);
  return (
    <Screen>
      <View style={s.between}>
        <Heading title="Food and Bar" kicker="Beachside dining" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Cart, ${count} items`}
          style={s.card}
          onPress={() => navigation.navigate('Cart')}
        >
          <Icon name="cart" />
          {count > 0 && (
            <Text
              style={[s.eyebrow, { color: colors.accent, textAlign: 'center' }]}
            >
              {count}
            </Text>
          )}
        </Pressable>
      </View>
      <View style={s.row}>
        {(['Food', 'Bar'] as const).map(tab => (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: category === tab }}
            onPress={() => setCategory(tab)}
            style={{
              flex: 1,
              padding: 14,
              borderBottomWidth: 2,
              borderColor: category === tab ? colors.accent : colors.border,
            }}
          >
            <Text style={[s.text, { textAlign: 'center' }]}>{tab}</Text>
          </Pressable>
        ))}
      </View>
      {menu
        .filter(x => x.category === category)
        .map(item => (
          <View key={item.id} style={[s.card, { padding: 12 }]}>
            <View
              style={[
                s.row,
                { alignItems: 'flex-start' },
                layout.stacked && {
                  flexDirection: 'column',
                  alignItems: 'stretch',
                },
              ]}
            >
              <Pressable
                accessibilityLabel={`View ${item.name}`}
                onPress={() =>
                  navigation.navigate('MenuDetail', { id: item.id })
                }
              >
                {layout.stacked ? (
                  <ResortImage source={item.image} aspectRatio={2} />
                ) : (
                  <Image
                    source={item.image}
                    style={{ width: 78, height: 88 }}
                  />
                )}
              </Pressable>
              <View style={{ flex: 1, gap: 6 }}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('MenuDetail', { id: item.id })
                  }
                >
                  <Text style={s.label}>{item.name}</Text>
                </Pressable>
                <Text style={[s.muted, { fontSize: 12, lineHeight: 18 }]}>
                  {item.description}
                </Text>
                <Text style={[s.muted, { fontSize: 11 }]}>
                  ◷ {item.minutes} min{item.type ? ` · ${item.type}` : ''}
                </Text>
                <View style={[s.between, { flexWrap: 'wrap' }]}>
                  <Text style={s.text}>{money(item.price)}</Text>
                  <Button
                    title={
                      state.cart.find(x => x.itemId === item.id)
                        ? `+ Add (${
                            state.cart.find(x => x.itemId === item.id)?.quantity
                          })`
                        : '+ Add'
                    }
                    onPress={() => add(item.id)}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      <Button
        title="Order history"
        secondary
        onPress={() => navigation.navigate('OrderHistory')}
      />
    </Screen>
  );
}
export function MenuDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<DiningStackParams, 'MenuDetail'>) {
  const item = menu.find(x => x.id === route.params.id)!;
  const { add, state } = useResort();
  return (
    <Screen>
      <Back onPress={() => navigation.goBack()} />
      <Heading title={item.name} kicker={item.category} />
      <ResortImage source={item.image} aspectRatio={1} />
      <Text style={s.text}>{item.description}</Text>
      <Text style={s.eyebrow}>Ingredients</Text>
      <Text style={s.muted}>{item.ingredients}</Text>
      <Detail label="Preparation time" value={`${item.minutes} min`} />
      {item.type && <Detail label="Type" value={item.type} />}
      <Detail label="Price" value={money(item.price)} />
      <Button
        title={`Add to order · ${money(item.price)}`}
        onPress={() => add(item.id)}
      />
      <Button
        title={`View cart (${state.cart.reduce(
          (sum, x) => sum + x.quantity,
          0,
        )})`}
        secondary
        onPress={() => navigation.navigate('Cart')}
      />
    </Screen>
  );
}
export function CartScreen({
  navigation,
}: NativeStackScreenProps<DiningStackParams, 'Cart'>) {
  const { state, update, add } = useResort();
  const [location, setLocation] = useState<'cafe' | 'beach'>();
  const saved =
    state.reservations.find(x => x.date === dateKey(new Date())) ||
    state.reservations.find(x => x.date >= dateKey(new Date()));
  const [place, setPlace] = useState(saved ? String(saved.place) : '');
  const [busy, setBusy] = useState(false);
  const total = cartTotal(state.cart);
  const confirm = () => {
    if (
      busy ||
      !location ||
      !state.cart.length ||
      (location === 'beach' && !validPlace(place))
    ) {
      return;
    }
    setBusy(true);
    const id = uid();
    update(st => ({
      ...st,
      orders: [
        {
          id,
          lines: st.cart.map(x => ({ ...x })),
          location,
          place: location === 'beach' ? place.trim() : '',
          date: new Date().toISOString(),
          total: cartTotal(st.cart),
        },
        ...st.orders,
      ],
      cart: [],
    }));
    navigation.replace('OrderConfirmed', { id });
  };
  return (
    <Screen>
      <Back onPress={() => navigation.goBack()} />
      <Heading title="Your Order" kicker="Cart" />
      {!state.cart.length ? (
        <View style={[s.card, { alignItems: 'center', paddingVertical: 36 }]}>
          <Icon name="cart" size={32} />
          <Text style={s.label}>Your cart is empty</Text>
          <Text style={[s.muted, { textAlign: 'center' }]}>
            Add dishes and drinks from the menu to create an order.
          </Text>
          <Button
            title="Browse the Menu"
            onPress={() => navigation.popToTop()}
          />
        </View>
      ) : (
        <>
          {state.cart.map(line => {
            const item = menu.find(x => x.id === line.itemId)!;
            return (
              <View key={line.itemId} style={s.card}>
                <View style={s.between}>
                  <Text style={[s.label, { flex: 1 }]}>{item.name}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${item.name}`}
                    hitSlop={12}
                    onPress={() => add(item.id, -line.quantity)}
                  >
                    <Icon name="trash" size={20} />
                  </Pressable>
                </View>
                <View style={s.between}>
                  <View
                    style={[
                      s.row,
                      {
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 3,
                      },
                    ]}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Decrease ${item.name}`}
                      onPress={() => add(item.id, -1)}
                      style={{ padding: 12 }}
                    >
                      <Text style={s.text}>−</Text>
                    </Pressable>
                    <Text style={s.text}>{line.quantity}</Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Increase ${item.name}`}
                      onPress={() => add(item.id)}
                      style={{ padding: 12 }}
                    >
                      <Text style={s.text}>+</Text>
                    </Pressable>
                  </View>
                  <Text style={s.text}>
                    {money(item.price * line.quantity)}
                  </Text>
                </View>
              </View>
            );
          })}
          <Detail label="Total" value={money(total)} />
          <Text style={s.eyebrow}>Serving location</Text>
          {(['cafe', 'beach'] as const).map(option => (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: location === option }}
              key={option}
              onPress={() => setLocation(option)}
              style={[s.card, s.row, location === option && s.selected]}
            >
              <Text style={s.text}>{location === option ? '◉' : '○'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>
                  {option === 'cafe'
                    ? 'Eat at the Café'
                    : 'Deliver to the Beach'}
                </Text>
                <Text style={s.muted}>
                  {option === 'cafe'
                    ? 'Collect or dine at the beachside café.'
                    : 'Your numbered beach place.'}
                </Text>
              </View>
            </Pressable>
          ))}
          {location === 'beach' && (
            <>
              <Text style={s.muted}>Lounger number</Text>
              <Field
                accessibilityLabel="Lounger number"
                keyboardType="number-pad"
                value={place}
                onChangeText={setPlace}
                maxLength={2}
                placeholder="Enter your place number"
              />
              {place && !validPlace(place) ? (
                <Text style={{ color: colors.gold }}>
                  Enter a place shown on the beach plan.
                </Text>
              ) : null}
            </>
          )}
          <Text style={s.muted}>
            Your order is saved on this device. No order is sent to the café.
          </Text>
          <Button
            disabled={
              busy || !location || (location === 'beach' && !validPlace(place))
            }
            title={
              location
                ? `Confirm Order · ${money(total)}`
                : 'Choose a Serving Location'
            }
            onPress={confirm}
          />
        </>
      )}
    </Screen>
  );
}
export function OrderConfirmedScreen({
  route,
  navigation,
}: NativeStackScreenProps<DiningStackParams, 'OrderConfirmed'>) {
  const { state } = useResort();
  const order = state.orders.find(x => x.id === route.params.id);
  if (!order) {
    return (
      <Screen>
        <Button title="Back to Menu" onPress={() => navigation.popToTop()} />
      </Screen>
    );
  }
  return (
    <Screen>
      <Back onPress={() => navigation.popToTop()} />
      <Heading title="Order Confirmed" kicker="Thank you" />
      <View
        style={[
          s.card,
          { backgroundColor: colors.raised, borderColor: colors.accent },
        ]}
      >
        <Text style={[s.eyebrow, { color: colors.green }]}>✓ ORDER SAVED</Text>
        {order.lines.map(line => (
          <Detail
            key={line.itemId}
            label={`${line.quantity} × ${
              menu.find(x => x.id === line.itemId)?.name
            }`}
            value={money(
              (menu.find(x => x.id === line.itemId)?.price || 0) *
                line.quantity,
            )}
          />
        ))}
        <Detail label="Total" value={money(order.total)} />
        <Detail
          label="Serving location"
          value={
            order.location === 'cafe'
              ? 'Eat at the Café'
              : `Deliver to Place ${order.place}`
          }
        />
        <Detail
          label="Preparation estimate"
          value={`About ${Math.max(
            ...order.lines.map(
              x => menu.find(item => item.id === x.itemId)?.minutes || 0,
            ),
          )} min`}
        />
      </View>
      <Text style={s.muted}>
        Saved locally. Show this order to the café when you are ready.
      </Text>
      <Button title="Back to Menu" onPress={() => navigation.popToTop()} />
    </Screen>
  );
}
export function OrderHistoryScreen({
  navigation,
}: NativeStackScreenProps<DiningStackParams, 'OrderHistory'>) {
  const { state, update } = useResort();
  return (
    <Screen>
      <Back onPress={() => navigation.goBack()} />
      <Heading title="Your Orders" />
      {state.orders.length ? (
        state.orders.map(order => (
          <Pressable
            key={order.id}
            onPress={() =>
              navigation.navigate('OrderConfirmed', { id: order.id })
            }
            style={s.card}
          >
            <Text style={s.label}>
              {money(order.total)} ·{' '}
              {order.lines.reduce((sum, x) => sum + x.quantity, 0)} items
            </Text>
            <Text style={s.muted}>{new Date(order.date).toLocaleString()}</Text>
            <Text style={s.text}>
              {order.location === 'cafe' ? 'Café' : `Place ${order.place}`} ›
            </Text>
          </Pressable>
        ))
      ) : (
        <Text style={s.muted}>Your saved orders will appear here.</Text>
      )}
      {state.orders.length > 0 && (
        <Button
          title="Clear order history"
          secondary
          onPress={() =>
            Alert.alert(
              'Clear history?',
              'Saved orders will be removed from this device.',
              [
                { text: 'Keep', style: 'cancel' },
                {
                  text: 'Clear',
                  style: 'destructive',
                  onPress: () => update(st => ({ ...st, orders: [] })),
                },
              ],
            )
          }
        />
      )}
    </Screen>
  );
}
