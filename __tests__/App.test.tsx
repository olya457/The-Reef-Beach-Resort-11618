import React from 'react';
import { TextInput } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';
import { Button } from '../src/components/UI';
import {
  ResortProvider,
  useResort,
  freshState,
  cartTotal,
  changeQuantity,
} from '../src/store/ResortStore';
import { ChecklistScreen } from '../src/screens/Checklist';
import { validPlace } from '../src/utils/date';
import { menu } from '../src/data/catalog';
let renderer: TestRenderer.ReactTestRenderer;
beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(AsyncStorage.getItem).mockResolvedValue(null);
});
afterEach(async () => {
  if (renderer) {
    await act(async () => renderer.unmount());
  }
  jest.useRealTimers();
});
test('splash leads to onboarding after its animation', async () => {
  jest.useFakeTimers();
  await act(async () => {
    renderer = TestRenderer.create(<App />);
  });
  expect(
    renderer.root.findAllByType('WebView' as React.ElementType),
  ).toHaveLength(1);
  await act(async () => {
    jest.advanceTimersByTime(4800);
  });
  expect(JSON.stringify(renderer.toJSON())).toContain(
    'Your Place by the Water',
  );
});
test('cart calculates totals and removes zero quantities', () => {
  const fish = menu[0];
  let cart = changeQuantity([], fish.id, 2);
  expect(cartTotal(cart)).toBe(56);
  cart = changeQuantity(cart, fish.id, -1);
  expect(cartTotal(cart)).toBe(28);
  expect(changeQuantity(cart, fish.id, -1)).toEqual([]);
  expect(changeQuantity([], fish.id, -1)).toEqual([]);
  expect(
    changeQuantity([{ itemId: fish.id, quantity: 99 }], fish.id, 1)[0].quantity,
  ).toBe(99);
});
test('validates all beach zones and rejects nonexistent places', () => {
  [1, 8, 11, 16, 21, 26, 31, 34].forEach(n =>
    expect(validPlace(String(n))).toBe(true),
  );
  ['', '0', '9', '10', '17', '30', '35', '-1', '1.5', 'abc'].forEach(n =>
    expect(validPlace(n)).toBe(false),
  );
});
test('restores saved guest data without seeding orders or bookings', async () => {
  const saved = freshState();
  saved.checklist[0].checked = true;
  saved.onboarded = true;
  jest.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(saved));
  let current: ReturnType<typeof useResort> | undefined;
  function Probe() {
    current = useResort();
    return null;
  }
  await act(async () => {
    renderer = TestRenderer.create(
      <ResortProvider>
        <Probe />
      </ResortProvider>,
    );
  });
  expect(current?.ready).toBe(true);
  expect(current?.state.checklist[0].checked).toBe(true);
  expect(current?.state.orders).toEqual([]);
  expect(current?.state.reservations).toEqual([]);
});
test('checklist toggles, adds, removes and persists user entries', async () => {
  await act(async () => {
    renderer = TestRenderer.create(
      <ResortProvider>
        <ChecklistScreen />
      </ResortProvider>,
    );
  });
  const checkbox = renderer.root.findAllByProps({
    accessibilityRole: 'checkbox',
  })[0];
  await act(async () => checkbox.props.onPress());
  let stored = JSON.parse(
    jest.mocked(AsyncStorage.setItem).mock.calls.at(-1)![1],
  );
  expect(stored.checklist[0].checked).toBe(true);
  await act(async () => {
    renderer.root.findByType(TextInput).props.onChangeText('Book');
  });
  const add = renderer.root
    .findAllByType(Button)
    .find(x => x.props.title === '+ Add')!;
  await act(async () => add.props.onPress());
  stored = JSON.parse(jest.mocked(AsyncStorage.setItem).mock.calls.at(-1)![1]);
  expect(stored.checklist.at(-1).name).toBe('Book');
  await act(async () =>
    renderer.root
      .findByProps({ accessibilityLabel: 'Delete Book' })
      .props.onPress(),
  );
  stored = JSON.parse(jest.mocked(AsyncStorage.setItem).mock.calls.at(-1)![1]);
  expect(stored.checklist).toHaveLength(8);
});

test('booking stores the selected place and blocks it on the same date', async () => {
  const { BookingScreen } = require('../src/screens/Reservations');
  const navigation = { goBack: jest.fn(), replace: jest.fn() };
  await act(async () => {
    renderer = TestRenderer.create(
      <ResortProvider>
        <BookingScreen
          navigation={navigation}
          route={{ params: { id: 'single' } }}
        />
      </ResortProvider>,
    );
  });
  const confirm = () =>
    renderer.root
      .findAllByType(Button)
      .find(x => x.props.title === 'Confirm Reservation')!;
  expect(
    renderer.root
      .findAllByType(Button)
      .find(x => x.props.title === 'Select a Place to Continue')?.props
      .disabled,
  ).toBe(true);
  await act(async () =>
    renderer.root
      .findByProps({ accessibilityLabel: 'Place 4' })
      .props.onPress(),
  );
  await act(async () => confirm().props.onPress());
  const stored = JSON.parse(
    jest.mocked(AsyncStorage.setItem).mock.calls.at(-1)![1],
  );
  expect(stored.reservations[0].place).toBe(4);
  expect(stored.reservations[0].type).toBe('single');
  expect(navigation.replace).toHaveBeenCalledWith('ReservationConfirmed', {
    id: stored.reservations[0].id,
  });
  expect(
    renderer.root.findByProps({ accessibilityLabel: 'Place 4, booked' }).props
      .disabled,
  ).toBe(true);
});

test('beach checkout requires a valid place and saves an immutable order', async () => {
  const { CartScreen } = require('../src/screens/Dining');
  const saved = freshState();
  saved.cart = [{ itemId: menu[0].id, quantity: 2 }];
  jest.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(saved));
  const navigation = {
    goBack: jest.fn(),
    replace: jest.fn(),
    popToTop: jest.fn(),
  };
  await act(async () => {
    renderer = TestRenderer.create(
      <ResortProvider>
        <CartScreen navigation={navigation} />
      </ResortProvider>,
    );
  });
  await act(async () =>
    renderer.root
      .findAllByProps({ accessibilityRole: 'radio' })
      .filter(x => typeof x.props.onPress === 'function')[1]
      .props.onPress(),
  );
  const confirm = () =>
    renderer.root
      .findAllByType(Button)
      .find(x => x.props.title === 'Confirm Order · €56')!;
  expect(confirm().props.disabled).toBe(true);
  await act(async () =>
    renderer.root.findByType(TextInput).props.onChangeText('4'),
  );
  expect(confirm().props.disabled).toBe(false);
  await act(async () => confirm().props.onPress());
  const stored = JSON.parse(
    jest.mocked(AsyncStorage.setItem).mock.calls.at(-1)![1],
  );
  expect(stored.cart).toEqual([]);
  expect(stored.orders[0]).toMatchObject({
    total: 56,
    place: '4',
    location: 'beach',
    lines: [{ itemId: menu[0].id, quantity: 2 }],
  });
});
