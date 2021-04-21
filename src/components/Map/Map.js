import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

export default function Map({ locations }) {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    // The latitude and longitude of the center of London
    latitude: 51.5074,
    longitude: -0.1278,
    zoom: 10
  });

  const [selectLocation, setSelectedLocation] = useState({});

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken="pk.eyJ1Ijoia3Jpc3RpbmFrdXplbmtvIiwiYSI6ImNrbnJpZDFtYjBwMG8ybnBmeG82a3Z0ejYifQ.GYQGZmk2Y0sSruGEpupdgw"
      {...viewport}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {locations.map((location) => (
        <div key={location.id}>
          <Marker latitude={location.center[1]} longitude={location.center[0]}>
            <a
              onClick={() => {
                setSelectedLocation(location);
              }}
            >
              <span role="img" aria-label="push-pin">
                📌
              </span>
            </a>
          </Marker>
          {selectLocation.id === location.id ? (
            <Popup
              onClose={() => setSelectedLocation({})}
              closeOnClick={true}
              latitude={location.center[1]}
              longitude={location.center[0]}
            >
              {location.place_name}
            </Popup>
          ) : (
            false
          )}
        </div>
      ))}
    </ReactMapGL>
  );
}
