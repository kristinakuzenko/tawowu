import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";

export default class MyGreatPlaceWithHover extends React.PureComponent {

  render() {
    return (
<span role="img" aria-label="push-pin" className={'location'}>
              <FontAwesomeIcon icon={faMapMarker}></FontAwesomeIcon>
              
</span>
    );
  }
}