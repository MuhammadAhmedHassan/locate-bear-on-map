import type { NextPage } from 'next';
import { useLoadScript } from '@react-google-maps/api';

import '@reach/combobox/styles.css';
import Map from '../components/Map';

const Home: NextPage = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return <Map />;
};

export default Home;
