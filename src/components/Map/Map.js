import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";

export default function Map({ locations,latitude,longitude,zoom }) {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: latitude,
    longitude: longitude,
    zoom: zoom
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
          <Marker latitude={location.coordinates[0]} longitude={location.coordinates[1]}>
            <a
              onMouseEnter={() => {
                setSelectedLocation(location);
              }}
            >
              <span role="img" aria-label="push-pin" className={location.type[0] === 2 ? 'location active' : location.type[0] === 3 ? 'location active2':'location'}>
              <FontAwesomeIcon icon={faMapMarker}></FontAwesomeIcon>
              </span>
            </a>
          </Marker>
          {selectLocation.id === location.id ? (
            <Popup 
              onClose={() => setSelectedLocation({})}
              closeOnClick={true}
              latitude={location.coordinates[0]}
              longitude={location.coordinates[1]}
              className="popup-map"
            >
              <p >
              {location.name}
              <br></br>
              {location.description}
              </p>
              <br></br>
              <p>
              {location.location}
              <br></br>
              {location.price}
              <br></br>
              {location.tips}
              </p>
            </Popup>
          ) : (
            false
          )}
        </div>
      ))}
    </ReactMapGL>
  );
}
