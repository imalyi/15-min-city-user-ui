import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import '../styles/Map.css';
import { useTranslation } from 'react-i18next';
import {
  doctors,
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
  biergarten,
  food_court,
  ice_cream,
  pub,
  college,
  dancing_school,
  driving_school,
  first_aid_school,
  language_school,
  surf_school,
  toy_library,
  research_institute,
  training,
  music_school,
  traffic_park,
  bicycle_parking,
  bicycle_repair_station,
  bicycle_rental,
  bicycle_wash,
  boat_rental,
  boat_sharing,
  bus_station,
  car_rental,
  car_sharing,
  compressed_air,
  vehicle_inspection,
  driver_training,
  ferry_terminal,
  fuel,
  grit_bin,
  motorcycle_parking,
  parking,
  parking_entrance,
  parking_space,
  taxi,
  weighbridge,
  payment_terminal,
  bureau_de_change,
  baby_hatch,
  nursing_home,
  social_facility,
  arts_centre,
  casino,
  cinema,
  community_centre,
  conference_centre,
  events_venue,
  exhibition_centre,
  fountain,
  music_venue,
  nightclub,
  planetarium,
  public_bookcase,
  social_centre,
  studio,
  courthouse,
  fire_station,
  post_depot,
  prison,
  ranger_station,
  townhall,
  bbq,
  bench,
  dog_toilet,
  dressing_room,
  drinking_water,
  give_box,
  mailroom,
  parcel_locker,
  shower,
  telephone,
  toilets,
  water_point,
  watering_place,
  sanitary_dump_station,
  waste_basket,
  waste_transfer_station,
  animal_boarding,
  animal_breeding,
  animal_shelter,
  animal_training,
  baking_oven,
  clock,
  crematorium,
  dive_centre,
  funeral_hall,
  grave_yard,
  hunting_stand,
  internet_cafe,
  kitchen,
  kneipp_water_cure,
  lounger,
  marketplace,
  monastery,
  photo_booth,
  place_of_mourning,
  place_of_worship,
  public_bath,
  public_building,
  refugee_site,
  vending_machine,
  universal_icon,
  Cukiernie_i_piekarnie,
  sushi,
  shop,
  playground,
  Kluby_bilardowe,
  Gry_Planszowe,
  fitness,
  meditacja,
  horseback_riding,
  shooting_range,
  depilation,
  barber_shop,
  hairdressers,
  nails,
  massage,
  model_making,
  three_d_printers,
  office,
  pizza,
  shoppingBag,
  butcher,
  cosmetics,
  shop_for_animal,
  entertainment_centers,
  cinema_theateres_operas,
  game_room,
  gym,
  mindfulness,
  swimming_pool,
  open_space,
  travel,
  healthcare,
  copy_machine,
  family_doctor,
  bike,
  station,
} from './Icons';
const Markers = ({ placeName, lat, lng, distance, address, name }) => {
  const iconMapping = {
    'Smażalnia ryb': fast_food,
    'Puby i bary': bar,
    'Street Food': food_court,
    'Małe skłepy spożywcze': shoppingBag,
    'Hipermarkety': shop,
    'Supermarkety': shop,
    'Sklepy mięsne': butcher,
    'Zdrowie': pharmacy,
    'Kosmetyczne': cosmetics,
    'Księgarnie': library,
    'Zoologiczne': shop_for_animal,
    'Centra rozrywki': entertainment_centers,
    'Centra handlowe': shop,
    'Kina, teatry, opery': cinema_theateres_operas,
    'Sale gier': game_room,
    'Kluby, dyskoteki': nightclub,
    'Siłownie': gym,
    'Mindfulness': mindfulness,
    'Baseny i kąpieliska': swimming_pool,
    'Open space': open_space,
    'Szkoły policealne': school,
    'Szkoły podstawowe': school,
    'Przedszkola': school,
    'Żłobki': kindergarten,
    'Biblioteki': library,
    'Szkoły artystyczne i hobbystyczne': school,
    'Placówki pocztowe, bankomaty': post_office,
    'SPA, masaże': massage,
    'Salony kosmetyczne': massage,
    'Fryzjerzy i barberzy': hairdressers,
    'Artykuły domowe i hobbystyczne': shop,
    'Turystyka': travel,
    'Pielęgnacja zwerząt': healthcare,
    'punkty ksero': copy_machine,
    'Lekarze rodzinni': family_doctor,
    'Interniści': doctors,
    'Pediatrzy': doctors,
    'Prywatne kliniki i spółdzielnie': clinic,
    'Apteki': pharmacy,
    'Przychodnie': clinic,
    'Rowery MEVO': bike,
    'Przystanki': station,
    Bistro: fast_food,
    'Food hall': food_court,
    Bary: bar,
    'Szkoły średnie': school,
    Winiarnie: bar,
    Browary: bar,
    'Cukiernie i piekarnie': Cukiernie_i_piekarnie,
    Puby: pub,
    Restauracje: restaurant,
    'Bary mleczne': bar,
    Sushi: sushi,
    Pizzerie: pizza,
    Kebaby: fast_food,
    'Sklepy rybne': shop,
    'Kawiarnie i herbaciarnie': cafe,
    'Bary przekąskowe': fast_food,
    'Palarnie kawy': cafe,
    Naleśnikarnie: fast_food,
    'Sklepy garmażeryjne': shop,
    'Sklepy ogólnospożywcze': shop,
    'Produkcja spożywcza': shop,
    'Odżywki i suplementy diety': shop,
    Drogerie: shop,
    'Sklepy zielarsko-medyczne': shop,
    'Sklepy monopolowe': shop,
    Supermarkety: shop,
    'Sklepy z winami': shop,
    Perfumerie: shop,
    Księgarnie: shop,
    'Zdrowa żywność': shop,
    Hipermarkety: shop,
    'Punkty ksero': shop,
    Targowiska: shop,
    'Sklepy mięsne': shop,
    'Place zabaw i małpie gaje': playground,
    Kina: cinema,
    'Centra handlowe': shop,
    Kręgielnie: shop,
    'Kluby nocne': nightclub,
    'Kluby, dyskoteki': nightclub,
    'Kluby bilardowe': Kluby_bilardowe,
    'Gry planszowe': Gry_Planszowe,
    'Siłownie i fitness kluby': fitness,
    Aquafitness: fitness,
    'Gimnastyka artystyczna i sportowa': fitness,
    Medytacje: meditacja,
    'Jazda konna': horseback_riding,
    Squash: fitness,
    Strzelnice: shooting_range,
    Joga: meditacja,
    'Nauka pływania': fitness,
    'Windsurfing, kitesurfing': fitness,
    Baseny: fitness,
    'Studio Pilates': fitness,
    'Sztuki walki i samoobrona': fitness,
    Golf: fitness,
    'Korty badminton': fitness,
    Kajaki: fitness,
    'Kluby sportowe': fitness,
    'Nordic walking': fitness,
    Wspinaczka: fitness,
    Skateparki: fitness,
    Sauny: fitness,
    Lodowiska: fitness,
    'Punkty odbioru przesyłek': post_office,
    'Szkolnictwo policealne i pomaturalne': college,
    żłobki: kindergarten,
    Biblioteki: library,
    'Kursy muzyczne': music_school,
    'Nauka tenisa': training,
    'Szkoły podstawowe': school,
    Przedszkola: kindergarten,
    'Szkoły wyższe': university,
    'Uniwersytety Trzeciego Wieku': university,
    'Kursy tańca': dancing_school,
    'Szkolenia psów': training,
    'Szkoły wizażu i stylizacji': training,
    'Pole dance': dancing_school,
    'Kursy szybkiego czytania': training,
    'Szkoły językowe': language_school,
    'Szkółki Piłkarskie': training,
    Bankomaty: atm,
    'Bankomaty BPH': atm,
    'Bankomaty ING Bank Śląski': atm,
    'Bankomaty SGB': atm,
    'Bankomaty PKO BP': atm,
    'Bankomaty Citibank': atm,
    'Bankomaty eCard': atm,
    'Bankomaty Euronet': atm,
    Banki: bank,
    SPA: fitness,
    'Depilacja laserowa': depilation,
    'Depilacja pastą cukrową': depilation,
    'Barber Shop': barber_shop,
    Fryzjerzy: hairdressers,
    'Przedłużanie rzęs': hairdressers,
    Paznokcie: nails,
    Solaria: massage,
    'Salony masażu': massage,
    'Przedłużanie włosów': hairdressers,
    Masażyści: massage,
    'Depilacja woskiem': depilation,
    'Salony kosmetyczne': massage,
    Modelarstwo: model_making,
    'Drukarnie 3D': three_d_printers,
    Bookcrossing: library,
    'Pralnie, magiel - wyposażenie, artykuły': shop,
    Pralnie: shop,
    'Hotele dla zwierząt': animal_boarding,
    Weterynarze: veterinary,
    'Pielęgnacja zwierząt': animal_training,
    'Sklepy zoologiczne': animal_shelter,
    'Współdzielenie biura - coworking': office,
    'Lekarze rodzinni': doctors,
    Interniści: doctors,
    Pediatrzy: doctors,
    Apteki: pharmacy,
    'Prywatne kliniki i spółdzielnie': clinic,
    'Apteki całodobowe': pharmacy,
    'Przychodnie, poradnie': clinic,
    'Fast Food': fast_food,
    doctors: doctors,
    bank: bank,
    bar: bar,
    cafe: cafe,
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
    biergarten: biergarten,
    food_court: food_court,
    ice_cream: ice_cream,
    pub: pub,
    college: college,
    dancing_school: dancing_school,
    driving_school: driving_school,
    first_aid_school: first_aid_school,
    language_school: language_school,
    surf_school: surf_school,
    toy_library: toy_library,
    research_institute: research_institute,
    training: training,
    music_school: music_school,
    traffic_park: traffic_park,
    bicycle_parking: bicycle_parking,
    bicycle_repair_station: bicycle_repair_station,
    bicycle_rental: bicycle_rental,
    bicycle_wash: bicycle_wash,
    boat_rental: boat_rental,
    boat_sharing: boat_sharing,
    bus_station: bus_station,
    car_rental: car_rental,
    car_sharing: car_sharing,
    compressed_air: compressed_air,
    vehicle_inspection: vehicle_inspection,
    driver_training: driver_training,
    ferry_terminal: ferry_terminal,
    fuel: fuel,
    grit_bin: grit_bin,
    motorcycle_parking: motorcycle_parking,
    parking: parking,
    parking_entrance: parking_entrance,
    parking_space: parking_space,
    taxi: taxi,
    weighbridge: weighbridge,
    payment_terminal: payment_terminal,
    bureau_de_change: bureau_de_change,
    baby_hatch: baby_hatch,
    nursing_home: nursing_home,
    social_facility: social_facility,
    arts_centre: arts_centre,
    casino: casino,
    cinema: cinema,
    community_centre: community_centre,
    conference_centre: conference_centre,
    events_venue: events_venue,
    exhibition_centre: exhibition_centre,
    fountain: fountain,
    music_venue: music_venue,
    nightclub: nightclub,
    planetarium: planetarium,
    public_bookcase: public_bookcase,
    social_centre: social_centre,
    studio: studio,
    courthouse: courthouse,
    fire_station: fire_station,
    post_depot: post_depot,
    prison: prison,
    ranger_station: ranger_station,
    townhall: townhall,
    bbq: bbq,
    bench: bench,
    dog_toilet: dog_toilet,
    dressing_room: dressing_room,
    drinking_water: drinking_water,
    give_box: give_box,
    mailroom: mailroom,
    parcel_locker: parcel_locker,
    shower: shower,
    telephone: telephone,
    toilets: toilets,
    water_point: water_point,
    watering_place: watering_place,
    sanitary_dump_station: sanitary_dump_station,
    waste_basket: waste_basket,
    waste_transfer_station: waste_transfer_station,
    animal_boarding: animal_boarding,
    animal_breeding: animal_breeding,
    animal_shelter: animal_shelter,
    animal_training: animal_training,
    baking_oven: baking_oven,
    clock: clock,
    crematorium: crematorium,
    dive_centre: dive_centre,
    funeral_hall: funeral_hall,
    grave_yard: grave_yard,
    hunting_stand: hunting_stand,
    internet_cafe: internet_cafe,
    kitchen: kitchen,
    kneipp_water_cure: kneipp_water_cure,
    lounger: lounger,
    marketplace: marketplace,
    monastery: monastery,
    photo_booth: photo_booth,
    place_of_mourning: place_of_mourning,
    place_of_worship: place_of_worship,
    public_bath: public_bath,
    public_building: public_building,
    refugee_site: refugee_site,
    vending_machine: vending_machine,
  };

  const defaultIcon = universal_icon; // Ustaw swoją uniwersalną ikonę tutaj
  const markerIcon = iconMapping[placeName] || defaultIcon;
  const { t } = useTranslation();
  return (
  
    <Marker
      className="markerContainer markerSquare"
      position={[Number(lat), Number(lng)]}
      icon={markerIcon}
      riseOnHover={true}
    >
      <Popup>
        <div>
          <strong>{name}</strong>
        </div>
        <div>{address}</div>
        <div>
          <strong>{t('Distance')}:</strong>{' '}
          {distance < 1000
            ? `${distance.toFixed(0)}m`
            : `${(distance / 1000).toFixed(1)}km`}
        </div>
      </Popup>
    </Marker>
  );
};

export default Markers;
