export type BeachStackParams = {
  Reservations: undefined;
  Booking: { id: string };
  ReservationConfirmed: { id: string };
};
export type DiningStackParams = {
  Menu: undefined;
  MenuDetail: { id: string };
  Cart: undefined;
  OrderConfirmed: { id: string };
  OrderHistory: undefined;
};
export type EventsStackParams = {
  Events: undefined;
  EventDetail: { id: string };
};
export type TabsParams = {
  Beach: undefined;
  Dining: undefined;
  EventsTab: undefined;
  Weather: undefined;
  Reception: undefined;
  Checklist: undefined;
};
