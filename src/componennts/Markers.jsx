import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import '../styles/Map.css';
import {
  doctor,
  fast_food,
  bank,
  bar,
  cafe,
  restaurant,
  school,
  theatre,
  police,
  atm,
  car_wash,
  charging_station,
  clinic,
  dentist,
  hospital,
  kick_scooter_parking,
  kindergarten,
  library,
  payment_centre,
  pharmacy,
  post_box,
  post_office,
  recycling,
  shelter,
  university,
  veterinary,
  waste_disposal,
} from './Icons';
const Markers = ({ placeName, lat, lng, distance, address, name }) => {
  const iconMapping = {
    doctors: doctor,
    fast_food: fast_food,
    bank: bank,
    bar: bar,
    cafe: cafe,
    restaurant: restaurant,
    school: school,
    theatre: theatre,
    police: police,
    clinic: clinic,
    dentist: dentist,
    atm: atm,
    car_wash: car_wash,
    charging_station: charging_station,
    hospital: hospital,
    kick_scooter_parking: kick_scooter_parking,
    kindergarten: kindergarten,
    library: library,
    payment_centre: payment_centre,
    pharmacy: pharmacy,
    post_box: post_box,
    post_office: post_office,
    recycling: recycling,
    shelter: shelter,
    university: university,
    veterinary: veterinary,
    waste_disposal: waste_disposal,
  };

  const markerIcon = iconMapping[placeName];

  return (
    <Marker
      className="markerContainer markerSquare"
      position={[Number(lat), Number(lng)]}
      icon={markerIcon}
      riseOnHover={true}
    >
      <Popup>
        <div className="centerized">
          <strong>{name}</strong>
        </div>
        <div>{address}</div>
        <div>
          <strong>Distance:</strong>{' '}
          {distance < 1000
            ? `${distance.toFixed(0)}m`
            : `${(distance / 1000).toFixed(1)}km`}
        </div>
      </Popup>
    </Marker>
  );
};

export default Markers;
