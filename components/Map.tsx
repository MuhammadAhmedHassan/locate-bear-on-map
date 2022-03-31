import { useCallback, useMemo, useRef, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { formatRelative } from 'date-fns';
import Search from './Search';
import LocateUser from './LocateUser';

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type MapMouseEvent = google.maps.MapMouseEvent;

type Markers = LatLngLiteral & { time: Date };
type Map = google.maps.Map;

function Map() {
  const mapRef = useRef<Map>();
  const [markers, setMarkers] = useState<Markers[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Markers | null>(null);
  // center is Toronto location
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 43.653225, lng: -79.383186 }),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      // styles: // can add a JSON of map styles here, but I like the default one
      disableDefaultUI: true,
      zoomControl: true,
    }),
    []
  );

  const handleMapClick = useCallback(({ latLng }: MapMouseEvent) => {
    const lat = latLng?.lat();
    const lng = latLng?.lng();
    const time = new Date();
    if (!lat || !lng) return;
    setMarkers((previousState) => [...previousState, { lat, lng, time }]);
  }, []);

  const onMapLoad = useCallback((map) => (mapRef.current = map), []);
  const panTo = useCallback((latLng: LatLngLiteral) => {
    console.log(latLng);
    if (!mapRef.current) return;
    mapRef.current.panTo(latLng);
    mapRef.current.setZoom(14);
  }, []);

  return (
    <div>
      <h1 className='logo'>
        Bears{' '}
        <span role='img' aria-label='tent'>
          ⛺
        </span>
      </h1>

      <Search panTo={panTo} />
      <LocateUser panTo={panTo} />

      <GoogleMap
        onLoad={onMapLoad}
        mapContainerClassName='google-maps'
        zoom={10}
        center={center}
        options={options}
        onClick={handleMapClick}
      >
        {markers.map((marker) => (
          <Marker
            key={`${marker.time.toISOString()}`}
            position={marker}
            icon={{
              url: '../icons/bear.svg', // http://localhost:5678/assets/icons/bear.svg
              scaledSize: new google.maps.Size(30, 30),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(15, 15),
            }}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}
        {!!selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h2>Bear Spotted!</h2>
              <p>Spotted {formatRelative(selectedMarker.time, new Date())}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default Map;
