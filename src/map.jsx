import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ResourceMap = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    // Fetch the GeoJSON file dynamically
    fetch("../public/reservation_data.geojson")
      .then((response) => response.json())
      .then((data) => {
        setGeojsonData(data);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, []);

  const center = [37.54812, -77.44675];
  const fillBlueOptions = { fillColor: "blue" };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Circle center={center} pathOptions={fillBlueOptions} radius={200} />

        {/* Render GeoJSON data if available */}
        {geojsonData && <GeoJSON data={geojsonData} />}
      </MapContainer>
    </div>
  );
};

export default ResourceMap;
