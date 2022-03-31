import React from 'react';

type LatLngLiteral = google.maps.LatLngLiteral;

interface IProps {
  panTo: (latLng: LatLngLiteral) => void;
}

function LocateUser({ panTo }: IProps) {
  return (
    <button
      className='locate'
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => null
        );
      }}
    >
      <img
        src='../icons/compass.svg'
        alt='compass - locate me'
        height={50}
        width={50}
      />
    </button>
  );
}

export default LocateUser;
