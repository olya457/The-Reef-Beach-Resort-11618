# The Reef Beach Resort

React Native + TypeScript mobile application based on the supplied designs. All images are bundled from `src/assets`.

## Run

```sh
npm install
npm start
npm run ios
```

For Android, start an emulator and run `npm run android`.

Install iOS dependencies after changing native packages:

```sh
cd ios
pod install
```

The available Homebrew CocoaPods executable on this workstation is `/opt/homebrew/opt/ruby/bin/pod`. The system Ruby/Bundler combination does not match the existing Gemfile.lock.

## Structure

- `src/navigation`: typed React Navigation stacks and six bottom tabs.
- `src/screens`: splash, onboarding, reservations, dining, events, weather, reception and checklist.
- `src/components`: shared layout, gradient buttons, fields, icons and date selector.
- `src/store`: AsyncStorage-backed guest state with ordered writes and save-error feedback.
- `src/data`: the supplied seating, food, bar and event catalogues.
- `src/services`: Open-Meteo weather and sea-temperature requests.
- `src/utils`: date, price and beach-place validation helpers.

## Behaviour

The splash shows the supplied background and logo, with a four-second WebView animation. Onboarding completion is persisted. Content scrolls on small screens and respects safe areas.

Reservations, orders and reception requests are local to the device, as requested. There is no server booking, payment, restaurant dispatch or staff messaging. A reserved place is unavailable for another local reservation on the same date. Reservations can be cancelled; saved orders can be reviewed. Reception request statuses are updated manually, with no simulated staff activity.

The menu contains the supplied ten Food and ten Bar items priced in euros, matching the screenshots. The separate Australian-dollar menu was not mixed into this catalogue.

No guest bookings, orders, messages or weather values are prefilled. The checklist starts with the eight requested items. User additions, checkmarks, deletions, cart contents, local orders, reservations, request statuses, onboarding and beach coordinates survive restarts.

Weather requires the user to enter the beach coordinates. The app loads seven days of hourly forecast, local sunrise/sunset and marine temperature from Open-Meteo. Unavailable marine values remain unavailable. Network errors have retry controls. Sources: https://open-meteo.com/en/docs and https://open-meteo.com/en/docs/marine-weather-api .

Eight event cards use the supplied local assets. The first event's date, time, location and programme come from the supplied screenshot. Missing schedules for the other seven events are marked as unannounced rather than fabricated. Update `src/data/catalog.ts` with the resort's actual event schedule when supplied.

## Checks

```sh
npx tsc --noEmit
npm test -- --runInBand --watchman=false
npm run lint
```

Tests cover splash transition, cart totals, valid beach numbers, persistence, checklist edits, local booking and beach checkout. Native UI interaction requires Simulator access.
