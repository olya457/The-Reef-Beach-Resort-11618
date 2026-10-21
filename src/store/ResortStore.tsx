import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialChecklist, menu } from '../data/catalog';
import { uid } from '../utils/date';
export type Reservation = {
  id: string;
  type: string;
  place: number;
  date: string;
};
export type CartLine = { itemId: string; quantity: number };
export type Order = {
  id: string;
  lines: CartLine[];
  location: 'cafe' | 'beach';
  place: string;
  date: string;
  total: number;
};
export type RequestStatus = 'Sent' | 'In progress' | 'Completed';
export type ServiceRequest = {
  id: string;
  title: string;
  comment: string;
  place: string;
  status: RequestStatus;
  date: string;
};
export type State = {
  onboarded: boolean;
  reservations: Reservation[];
  cart: CartLine[];
  orders: Order[];
  requests: ServiceRequest[];
  checklist: { id: string; name: string; checked: boolean }[];
  location: { name: string; latitude: string; longitude: string };
};
export const freshState = (): State => ({
  onboarded: false,
  reservations: [],
  cart: [],
  orders: [],
  requests: [],
  checklist: initialChecklist.map((name, i) => ({
    id: `default-${i}`,
    name,
    checked: false,
  })),
  location: { name: '', latitude: '', longitude: '' },
});
export const cartTotal = (cart: CartLine[]) =>
  cart.reduce(
    (sum, line) =>
      sum + (menu.find(x => x.id === line.itemId)?.price || 0) * line.quantity,
    0,
  );
export function changeQuantity(
  cart: CartLine[],
  itemId: string,
  delta: number,
) {
  const current = cart.find(x => x.itemId === itemId);
  if (!current) {
    return delta > 0
      ? [...cart, { itemId, quantity: Math.min(99, delta) }]
      : cart;
  }
  return cart
    .map(x =>
      x.itemId === itemId
        ? { ...x, quantity: Math.min(99, x.quantity + delta) }
        : x,
    )
    .filter(x => x.quantity > 0);
}
const KEY = '@reef/state/v1';
type Context = {
  state: State;
  ready: boolean;
  error: string;
  update: (fn: (s: State) => State) => void;
  add: (id: string, delta?: number) => void;
  retry: () => void;
};
const Store = createContext<Context | null>(null);
export function ResortProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<State>(freshState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const writes = useRef(Promise.resolve());
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(KEY)
      .then(raw => {
        if (!mounted) {
          return;
        }
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            !parsed ||
            !Array.isArray(parsed.checklist) ||
            !Array.isArray(parsed.reservations) ||
            !Array.isArray(parsed.cart) ||
            !Array.isArray(parsed.orders) ||
            !Array.isArray(parsed.requests)
          ) {
            throw new Error('Invalid saved data');
          }
          setState({ ...freshState(), ...parsed });
        }
        setReady(true);
      })
      .catch(() => {
        if (mounted) {
          setError('Saved data could not be opened. Restart the app to retry.');
        }
      });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) {
      return;
    }
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(KEY, JSON.stringify(state)))
      .then(() => setError(''))
      .catch(() => setError('Changes could not be saved. Please retry.'));
  }, [state, ready, retryCount]);
  return (
    <Store.Provider
      value={{
        state,
        ready,
        error,
        update: setState,
        add: (id, delta = 1) =>
          setState(s => ({ ...s, cart: changeQuantity(s.cart, id, delta) })),
        retry: () => setRetryCount(x => x + 1),
      }}
    >
      {children}
    </Store.Provider>
  );
}
export function useResort() {
  const value = useContext(Store);
  if (!value) {
    throw new Error('ResortProvider missing');
  }
  return value;
}
export function makeRequest(
  title: string,
  comment: string,
  place: string,
): ServiceRequest {
  return {
    id: uid(),
    title,
    comment,
    place,
    status: 'Sent',
    date: new Date().toISOString(),
  };
}
