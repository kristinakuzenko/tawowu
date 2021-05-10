import Layout from "../../components/Layout/Layout";
import GoogleMap from "../../components/GoogleMap/GoogleMap";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import SearchInput from "../../components/SearchInput/SearchInput";
//database import
import fire from '../../config/fire-config';
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from 'google-map-react';
import DirectionsService from 'google-map-react';
import DirectionsRenderer from 'google-map-react';
import MyGreatPlaceWithHover from "../../components/MyPlace/MyPlace";
import { withScriptjs } from "react-google-maps";

const markers = (locations, handler) => {
  return locations.map(location => (
    <MyGreatPlaceWithHover
      text={location.name}
      lat={location.coordinates[0]}
      lng={location.coordinates[1]}
      type={location.type}
    />
  ))
}
const MapLoader = withScriptjs(GoogleMap);
const Plans = ({ city }) => {
  let _isMounted = false;
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [favPlaces, setFavPlaces] = useState([]);
  React.useEffect(() => {


    Object.keys(localStorage).filter(key => key.indexOf('tawowu-fav') !== -1).forEach((key) => {
      favPlaces.push(JSON.parse(localStorage.getItem(key)));
    });

    setFavPlaces([...favPlaces]);

    _isMounted = true;

    fire.firestore()
      .collection('cities')
      .onSnapshot(snap => {
        const cities = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        _isMounted && setCities(cities);
      });

    fire.firestore()
      .collection('places')
      .onSnapshot(snap => {
        const places = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        _isMounted && setPlaces(places);
      });


    return function cleanup() {
      _isMounted = false;
    }
  }, [])
  const Map = dynamic(() => import("../../components/Map/Map"), {
    loading: () => "Loading...",
    ssr: false
  });

  const currentCity = cities.filter(cityItem => cityItem.city.toLowerCase() === city.toLowerCase());
  const cityPlaces = () => places.filter(place => place.city.toLowerCase() === city.toLowerCase());


  const [activeFilters, setActiveFilters] = useState([]);
  const [activeFilter, setActiveFilterOne] = useState([]);

  //filter for camera, art...
  const toggleFilterOne = (e, filterValue) => {
    e.preventDefault();
    const index = activeFilter.indexOf(filterValue);
    const index2 = activeFilters.indexOf(filterValue);
    if (index > -1) {
      activeFilter.splice(index, 1);
    } else {
      activeFilter.splice(0, activeFilter.length);
      activeFilter.push(filterValue);
    }
    setActiveFilterOne([...activeFilter])
  }

  const sixFiltersPlaces = (type) => {
    let result = [...cityPlaces().filter(place => place.type.indexOf(type) !== -1)];
    if (activeFilter.length > 0) {
      activeFilter.forEach(filter => {
        result = result.filter(pl => pl.filter.indexOf(filter) !== -1)
        //result = result.filter(pl=>pl[filter.name].indexOf(filter.value)!==-1)
      })
    }
    return result;

  }

  //filters for everything
  const toggleFilter = (e, filterValue) => {
    e.preventDefault();
    const index = activeFilters.indexOf(filterValue);
    if (index !== -1) {
      activeFilters.splice(index, 1);
      setActiveFilters([...activeFilters])
    } else {
      activeFilters.push(filterValue);
      setActiveFilters([...activeFilters])
      /*const filter={
        name:"filter",
        value:3
      }*/

    }
  }
  const clearAll = (e) => {
    e.preventDefault();
    activeFilters.splice(0, activeFilters.length);
    setActiveFilters([...activeFilters]);
  }

  const allFilteredPlaces = (type) => {
    let result = [...sixFiltersPlaces(type)];
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        result = result.filter(pl => pl.filter.indexOf(filter) !== -1)
        //result = result.filter(pl=>pl[filter.name].indexOf(filter.value)!==-1)
      })
    }
    return result;
  }

  const [keyword, setKeyword] = useState("");
  const onInputChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };
  const filteredPlaces = (type) => {
    const needle = keyword ? keyword.toLowerCase() : '';
    return allFilteredPlaces(type).filter((place) => place.name.toLowerCase().indexOf(needle) !== -1);
  };
  const filteredPlacesValue = () => {
    const needle = keyword ? keyword.toLowerCase() : '';
    return filteredPlaces(placeType).filter((place) => place.type.indexOf(4) === -1);
  };

  const addToFavorites = (e, value, place) => {
    e.preventDefault();
    localStorage.setItem(`tawowu-fav-${value}`, JSON.stringify(place));
    favPlaces.push(place);
    setFavPlaces([...favPlaces]);
  }
  const removeFromFavorites = (e, value, place) => {
    e.preventDefault();
    localStorage.removeItem(`tawowu-fav-${value}`);
    const index = favPlaces.indexOf(place);
    favPlaces.splice(index, 1);
    setFavPlaces([...favPlaces]);
  }

  const [placeType, setPlaceType] = useState(1);

  const toggleType = (e, typeValue) => {
    e.preventDefault();
    if (placeType !== typeValue) {
      activeFilter.splice(0, activeFilter.length);
      activeFilters.splice(0, activeFilters.length);
      setActiveFilterOne([...activeFilter]);
      setActiveFilters([...activeFilters]);
      setKeyword("");
      setAllTogether(-1);
    }
    setPlaceType(typeValue);
  }
  const [allTogether, setAllTogether] = useState(-1);

  const toggleAllTogether = (e, value) => {
    e.preventDefault();
    setAllTogether(value);
  }


  const allPlaces = () => cityPlaces().filter(place => place.type.indexOf(4) === -1);


  const mySortingFunction = (a, b) => a.popularity.localeCompare(b.popularity);
  return <Layout title={city}>

    {currentCity.map((cityItem) => (
      <div className="city-block" key={cityItem.city}>



        <div>
          <div className="places-div">

          <div className="container-fluid">
          <Link href={`/new-plan/${city}`}>
                        <div className="new-plan">
                            <div className="btn filter-p filter-btn ">
                                Create new plan
                            </div>
                        </div>
                    </Link>
            <div className="choose-plan">
              ... or choose plan from existing :
            </div>
                        <div className="myPlans-div" key="{city}">
                            <div className="row  plans-div">
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 plan-col">
                                    <div className=" one-plan">
                                        <img className="image-plan " src="{place.image}" />
                                        <div className="plan-header">
                                            Barcelona
                                    </div>
                                        <div className="">
                                            <h1>Places to visit: 20</h1>
                                            <h1>Days: 2</h1>
                                            <h1>Money to spend: 20$</h1>
                                            <div className="btn show-plan-p show-plan-btn ">
                                                Show
                                            </div>
                                        </div>
                                     
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
          </div>
        </div>
      </div>
    ))}

  </Layout>;

}
export default Plans;
export const getServerSideProps = async ({ params }) => {
  const city = params.id;
  return {
    props: {
      city
    },
  };
};
