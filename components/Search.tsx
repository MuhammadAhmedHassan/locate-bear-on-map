import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

import '@reach/combobox/styles.css';
import { useMemo } from 'react';

type LatLngLiteral = google.maps.LatLngLiteral;

interface IProps {
  panTo: (latLng: LatLngLiteral) => void;
}

function Search({ panTo }: IProps) {
  // location Toronto is being used as preferred location
  const location = useMemo<LatLngLiteral>(
    () => ({ lat: 43.653225, lng: -79.383186 }),
    []
  );

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => location.lat, lng: () => location.lng } as any,
      radius: 200 * 1000,
    },
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const result = await getGeocode({ address });
      if (result.length) {
        const { lat, lng } = await getLatLng(result[0]);
        panTo({ lat, lng });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className='search'>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className='combobox-input'
          placeholder='Search office address'
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default Search;
