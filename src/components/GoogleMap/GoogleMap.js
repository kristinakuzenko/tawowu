/*global google*/
import React, { Component } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  DirectionsRenderer
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

    this.state = {city,locations,type};

    console.log(this.state);
}

  componentDidMount() {
    const geocoder = new google.maps.Geocoder();
    const directionsService = new google.maps.DirectionsService();
    const type=this.state.type;
    const origin = { lat: this.state.city.latitude, lng: this.state.city.longitude};
    const destination = { lat: this.state.city.latitude,lng: this.state.city.longitude };
    var waypts = [];
    var loc=[];
    
    this.state.locations.forEach(place => {
      geocoder.geocode({ address: place.location }, (results, status) => {
       loc.push({lat:results[0].geometry.location.lat(),lng:results[0].geometry.location.lng()});
           
          console.log(results[0].geometry.location.lng());

        
    });
      stop = new google.maps.LatLng(place.coordinates[0], place.coordinates[1])
      waypts.push({
          location: stop,
          stopover: true
      });
    });
    console.log("loc");
    console.log(loc);
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints:waypts,
        optimizeWaypoints:true,
        travelMode: google.maps.TravelMode[type]
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
          localStorage.setItem(`route`, JSON.stringify(result.routes[0].legs));
          
          
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
