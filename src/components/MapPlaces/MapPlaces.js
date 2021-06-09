import React, { useState } from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import apiKey from '../GoogleApiKey/GoogleApiKey';

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.setValue = this.setValue.bind(this);
  }

  setValue = (value) => {
    console.log(value);
    this.props.handleSetAddress(value.label);
    
  };

  render() {
    return (
      <div className="autocomplete">
        <GooglePlacesAutocomplete
          apiKey={apiKey} 
          options={{
            types: ["(regions)"],
            componentRestrictions: { country: "us" },
          }}
          selectProps={{
            value: this.props.address,
            onChange: this.setValue,
          }} />
      </div>
    );
  }
}

export default LocationSearchInput;