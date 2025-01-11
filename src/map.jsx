import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ResourceMap = () => {
  // Example hardcoded marker data
  // Replace with actual data
  const markers = [  
    { id: 1, position: [37.54812, -77.44675], name: "Marker 1", description: "This is the first marker" },
    { id: 2, position: [37.55012, -77.44475], name: "Marker 2", description: "This is the second marker" },
  ];

  const center = [37.54812, -77.44675]
  const fillBlueOptions = { fillColor: 'blue' }
const fillRedOptions = { fillColor: 'red' }
const greenOptions = { color: 'green', fillColor: 'green' }
const purpleOptions = { color: 'purple' } 

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[37.54812, -77.44675]} zoom={13} style={{ height: "100%", width: "100%" }}>
        {/* Add OpenStreetMap Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
              <Circle center={center} pathOptions={fillBlueOptions} radius={200} />

        {/* Add markers */}
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              {marker.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ResourceMap;
