import React from 'react';
import { IoFastFood } from 'react-icons/io5';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaPills } from 'react-icons/fa';
import { CiBank } from 'react-icons/ci';
import { MdOutlineLocalBar } from 'react-icons/md';
import { MdOutlineLocalCafe } from 'react-icons/md';
import { IoRestaurant } from 'react-icons/io5';
import { MdSchool } from 'react-icons/md';
import { FaTheaterMasks } from 'react-icons/fa';
import { GiPoliceBadge } from 'react-icons/gi';
const Markers = ({ placeName, lat, lng }) => {
  const iconMapping = {
    doctors: <FaUserDoctor id="doctor-marker" fontSize="large" />,
    fast_food: <IoFastFood id="fast-food-marker" fontSize="large" />,
    drugstore: <FaPills id="drugstore-marker" fontSize="large" />,
    bank: <CiBank id="bank-marker" fontSize="large" />,
    bar: <MdOutlineLocalBar id="bar-marker" fontSize="large" />,
    cafe: <MdOutlineLocalCafe id="cafe-marker" fontSize="large" />,
    restaurant: <IoRestaurant id="restaurant-marker" fontSize="large" />,
    school: <MdSchool id="school-marker" fontSize="large" />,
    theatre: <FaTheaterMasks id="theatre-marker" fontSize="large" />,
    police: <GiPoliceBadge id="police-marker" fontSize="large" />,
  };

  const markerIcon = iconMapping[placeName];

  return (
    <div className="markerContainer" lat={Number(lat)} lng={Number(lng)}>
      <div className="markerSquare">{markerIcon}</div>
    </div>
  );
};

export default Markers;
