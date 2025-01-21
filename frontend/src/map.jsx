import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ResourceMap = () => {
  const [geojsonData, setGeojsonData] = useState({ mainland: null, alaska: null, islands: null });
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // ✅ Controls accordion state

  useEffect(() => {
    const fetchGeoJSONs = async () => {
      try {
        const response = await fetch("/other_reservation.geojson");
        const data = await response.json();

        // Separate features by region
        const mainland = data.features.filter((feature) => {
          const [lon, lat] = feature.geometry.coordinates[0][0];
          return lat > 24 && lat < 50 && lon > -125 && lon < -66;
        });

        const alaska = data.features.filter((feature) => {
          const [lon, lat] = feature.geometry.coordinates[0][0];
          return lat > 50 && lon < -130;
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

  // ✅ Function to handle feature click and show metadata
  const onEachFeature = (feature, layer) => {
    console.log(feature)
    layer.on({
      click: (e) => {
        setSelectedFeature({
          name: feature.properties["BASENAME"] || "Unknown Location",
          centlat: feature.properties["CENTLAT"]|| "No type available",
          centlng: feature.properties["CENTLON"] || "No description available",
          fullData: feature.properties, // ✅ Store entire dataset for expansion
          coordinates: e.latlng,
        });
        setIsExpanded(false); // ✅ Collapse accordion on new selection
      },
    });
  };

  const center = [37.54812, -77.44675];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={center} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Continental U.S.">
            {geojsonData.mainland && <GeoJSON data={geojsonData.mainland} onEachFeature={onEachFeature} />}
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Alaska">
            {geojsonData.alaska && <GeoJSON data={geojsonData.alaska} onEachFeature={onEachFeature} />}
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Hawaii & Islands">
            {geojsonData.islands && <GeoJSON data={geojsonData.islands} onEachFeature={onEachFeature} />}
          </LayersControl.Overlay>
        </LayersControl>

        {/* ✅ Show clicked feature details inside a Popup */}
        {selectedFeature && (
          <Popup position={selectedFeature.coordinates}>
            <div>
              <h4>{selectedFeature.name}</h4>
              <p><strong>Nation:</strong> {selectedFeature.name}</p>
              <p><strong>Center Latitude:</strong> {selectedFeature.centlat}</p>
              <p><strong>Center Longitude:</strong> {selectedFeature.centlng}</p>

              {/* ✅ Expandable metadata */}
              <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Hide Details ▲" : "Show More ▼"}
              </button>

              {isExpanded && (
                <div style={{ marginTop: "10px", maxHeight: "150px", overflowY: "auto" }}>
                  <pre>{JSON.stringify(selectedFeature.fullData, null, 2)}</pre>
                </div>
              )}
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default ResourceMap;
