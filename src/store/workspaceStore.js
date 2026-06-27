import { create } from "zustand";
import { travelCountries, travelLocations } from "../data/travelData.js";

export const useWorkspaceStore = create((set, get) => ({
  viewState: "WORLD",
  selectedCountryId: null,
  selectedCityId: "sydney",
  hudPhotoArmed: false,
  booting: false,
  soundOn: false,

  startBoot: () => set({ booting: true }),
  finishBoot: () => set({ booting: false }),
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
  toggleHudPhoto: () => set((state) => ({ hudPhotoArmed: !state.hudPhotoArmed })),

  selectCity: (cityId) => {
    const city = travelLocations.find((location) => location.id === cityId) ?? travelLocations[0];
    set({
      viewState: "COUNTRY",
      selectedCountryId: city.countryId,
      selectedCityId: city.id,
      hudPhotoArmed: false,
    });
  },

  selectCountry: (countryId) => {
    const country = travelCountries.find((item) => item.id === countryId) ?? travelCountries[0];
    set({
      viewState: "COUNTRY",
      selectedCountryId: country.id,
      selectedCityId: country.locations[0]?.id ?? get().selectedCityId,
      hudPhotoArmed: false,
    });
  },

  resetToWorld: () =>
    set({
      viewState: "WORLD",
      selectedCountryId: null,
      hudPhotoArmed: false,
    }),
}));
