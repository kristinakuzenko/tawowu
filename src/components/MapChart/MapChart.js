import React, { memo } from "react";
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';

import {
  Sphere,
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = ({ setTooltipContent }) => {
  const routeChange = (name) =>{ 
    let path = `/city/${name}`; 
  }
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }
  return (
    <>
      <ComposableMap className="map-chart" data-tip="" projectionConfig={{}}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME} = geo.properties;
                    setTooltipContent(`${NAME} `);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  onClick={()=>{
                    const { NAME} = geo.properties;
                    window.location.href=`/country/${NAME} `;
                  }
                  }
                  style={{
                    default: {
                      fill: "#4d2121",
                      outline: "none"
                    },
                    hover: {
                      cursor:"pointer",
                      fill: "#faccb6",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#faccb6",
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
      </ComposableMap>
      
      
    </>
  );
};

export default memo(MapChart);

