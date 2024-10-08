
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';


const customMarkerIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png', 
  iconAnchor: [12, 41],
  popupAnchor: [1, -34], 
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png', 
  shadowSize: [41, 41], 
  shadowAnchor: [12, 41] 
});

const MapComponent = ({ locations, mapKey }) => {
  const defaultCenter = locations.length > 0 ? [locations[0].x, locations[0].y] : [0, 0]; 

  return (
    <MapContainer
      key={mapKey} 
      center={defaultCenter}
      zoom={10}
      style={{ height: '450px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {locations.map((loc, index) => (
        <Marker 
          key={index} 
          position={[loc.x, loc.y]} 
          icon={customMarkerIcon} 
        >
          <Popup>
            <div>
              {loc.firstName && loc.lastName 
                ? `Employee: ${loc.firstName} ${loc.lastName}` 
                : 'Employee: Unknown'}
              <br />
              Coordinates: ({loc.x}, {loc.y})
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
