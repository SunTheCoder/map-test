import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ResourceMap = () => {
  const [geojsonData, setGeojsonData] = useState({ mainland: null, alaska: null, islands: null });
  const animateRef = useRef(false)

  useEffect(() => {
    const fetchGeoJSONs = async () => {
      try {
        const response = await fetch("/other_reservation.geojson");
        const data = await response.json();

        // Separate features by region
        const mainland = data.features.filter((feature) => {
          const [lon, lat] = feature.geometry.coordinates[0][0]; // Get first coordinate
          return lat > 24 && lat < 50 && lon > -125 && lon < -66; // Lower 48 states
        });

        const alaska = data.features.filter((feature) => {
          const [lon, lat] = feature.geometry.coordinates[0][0];
          return lat > 50 && lon < -130; // Alaska region
        });

        const islands = data.features.filter((feature) => {
          const [lon, lat] = feature.geometry.coordinates[0][0];
          return (
            (lat > 15 && lat < 25 && lon > -160 && lon < -150) || // Hawaii
            (lat > 17 && lat < 19 && lon > -68 && lon < -65) || // Puerto Rico
            (lat > 13 && lat < 15 && lon > 144 && lon < 146) // Guam
          );
        });

        setGeojsonData({
          mainland: { type: "FeatureCollection", features: mainland },
          alaska: { type: "FeatureCollection", features: alaska },
          islands: { type: "FeatureCollection", features: islands },
        });
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };

    fetchGeoJSONs();
  }, []);

  function SetViewOnClick({ animateRef }) {
    const map = useMapEvent('click', (e) => {
      map.setView(e.latlng, map.getZoom(), {
        animate: animateRef.current || false,
      })
    })
  
    return null
  }

  const center = [37.54812, -77.44675];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <p>
        <label>
          <input
            type="checkbox"
            onChange={() => {
              animateRef.current = !animateRef.current
            }}
          />
          Animate panning
        </label>
      </p>
      <MapContainer center={center} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        <LayersControl position="topright">
          {/* Mainland Layer */}
          <LayersControl.Overlay checked name="Continental U.S.">
            {geojsonData.mainland && <GeoJSON data={geojsonData.mainland} />}
          </LayersControl.Overlay>

          {/* Alaska Layer */}
          <LayersControl.Overlay checked name="Alaska">
            {geojsonData.alaska && <GeoJSON data={geojsonData.alaska} />}
          </LayersControl.Overlay>

          {/* Islands Layer */}
          <LayersControl.Overlay checked name="Hawaii & Islands">
            {geojsonData.islands && <GeoJSON data={geojsonData.islands} />}
          </LayersControl.Overlay>
        </LayersControl>
        <SetViewOnClick animateRef={animateRef} />

      </MapContainer>
    </div>
  );
};

export default ResourceMap;
