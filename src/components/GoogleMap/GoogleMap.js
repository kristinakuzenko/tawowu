/*global google*/
import { PanoramaFishEyeTwoTone } from "@material-ui/icons";
import React, { Component } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  DirectionsRenderer,geocodeByAddress,
  PlacesAutocomplete
} from "react-google-maps";
class Map extends Component {
  state = {
    directions: null
  };
  constructor(props) {
    super(props);
    const city = props.data[0];
    const locations = props.data[1];
    const type = props.data[2];
    const name = props.data[3];
    const callback = props.data[4];

    this.state = { city, locations, type, name, callback  };
  }


  componentDidMount() {
    const geocoder = new google.maps.Geocoder();
    const directionsService = new google.maps.DirectionsService();
    const type = this.state.type;
    const name = this.state.name;
    const origin = { lat: this.state.city.latitude, lng: this.state.city.longitude };
    const destination = { lat: this.state.city.latitude, lng: this.state.city.longitude };
    var loc = [];
    this.state.locations.forEach(place => loc.push({location:place.location, stopover:true}));
    
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: loc,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode[type]
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
          this.state.callback();
          if (type === "WALKING") {
            
            var promise2 = result.routes[0].legs.map((route) => () => new Promise((resolve, reject) => {

              var origin1 = route.start_address;
              var destination1 = route.end_address;

              directionsService.route(
                {
                  origin: origin1,
                  destination: destination1,
                  travelMode: google.maps.TravelMode.TRANSIT
                },
                (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                    var instructions=[];
                    var dist=0;
                    var time=0;
                    result.routes[0].legs[0].steps.forEach(step=>{
                      var instr=``;
                      instr+=`${step.instructions}  (${step.duration.text}, ${step.distance.text})`;
                      instructions.push(instr);
                      dist+=step.distance.value;
                      time+=step.duration.value;
                      
                    })
                    resolve({instructions:instructions,distance:dist,time:time,start:origin1,end:destination1});
                     } else {
                    console.error(`error fetching directions ${result}`);
                  }
                }
              );
            }));
            var f2 = async (arr) => {
              const waypts2 = arr.map(arr => arr());
              return await Promise.all(waypts2);
            }
            f2(promise2).then((r) => {
              console.log("r");
              console.log(r);
              localStorage.removeItem(`routes-transport-${name}`);
              localStorage.setItem(`routes-transport-${name}`, JSON.stringify(r));
                 
            })

          }
          console.log("result.routes[0].legs");
          console.log(result.routes[0].legs);
          localStorage.setItem(`route-${name}`, JSON.stringify(result.routes[0].legs));
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );

  }

  render() {

  
    const GoogleMapExample = withGoogleMap(props => (

      <GoogleMap
        defaultCenter={{ lat: this.state.city.latitude, lng: this.state.city.longitude }}
        defaultZoom={13}
      >
        <DirectionsRenderer
          directions={this.state.directions}

        />
                     
        
      </GoogleMap>
    ));

    return (
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: `500px`, width: "500px" }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
 
      </div>
    );
  }
}

export default Map;
