import Layout from "../../components/Layout/Layout";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import SearchInput from "../../components/SearchInput/SearchInput";
//database import
import fire from '../../config/fire-config';
import dynamic from 'next/dynamic';
import styled from "styled-components";
import React, { useState, useEffect } from "react";

const City = ({ city }) => {
  let _isMounted = false;
  const values = [];
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  React.useEffect(() => {
    const fetchLocations = async () => {
      await fetch(url).then((response) =>
        response.text()).then((res) => JSON.parse(res))
      .then((json) => {
        setLocations(json.features);
      }).catch((err) => console.log({ err }));
    };
    fetchLocations();


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

    // get values by keys from local storage
    Object.keys(localStorage).forEach((key) => values.push(localStorage.getItem(key)));

    return function cleanup() {
      _isMounted = false;
    }
  }, [])
 const Map = dynamic(() => import("../../components/Map/Map"), {
    loading: () => "Loading...",
    ssr: false
  });

  const [keyword, setKeyword] = useState("");
  const onInputChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };

  const filteredPlaces = () => {
    const needle = keyword ? keyword.toLowerCase() : '';
    return cityPlaces().filter((place) => place.name.toLowerCase().indexOf(needle) !== -1);
  };

  const [placeType, setPlaceType] = useState(-1);
  const [placeFilter, setPlaceFilter] = useState(-1);

  const currentCity = cities.filter(cityItem => cityItem.city.toLowerCase() === city.toLowerCase());

  // console.log('currentCity', currentCity);

  const cityPlaces = () => places.filter(place => place.city.toLowerCase() === city.toLowerCase());

  // console.log('cityPlaces', cityPlaces());

  const cityPlacesByType = [
    // sightseeing
    [...filteredPlaces().filter(place => place.type.indexOf(1) !== -1)],
    // food
    [...filteredPlaces().filter(place => place.type.indexOf(2) !== -1)],
    // shopping
    [...filteredPlaces().filter(place => place.type.indexOf(3) !== -1)],
    // transport
    [...filteredPlaces().filter(place => place.type.indexOf(4) !== -1)]
  ]
  const cityPlacesByFilter = [
    // art
    [...filteredPlaces().filter(place => place.filter.indexOf(1) !== -1)],
    // camera
    [...filteredPlaces().filter(place => place.filter.indexOf(2) !== -1)],
    // park
    [...filteredPlaces().filter(place => place.filter.indexOf(3) !== -1)],
    // museum
    [...filteredPlaces().filter(place => place.filter.indexOf(4) !== -1)],
    //viewpoint
    [...filteredPlaces().filter(place => place.filter.indexOf(5) !== -1)],
    //
  ]

  // [[1,2], [3,4]].flat() => [1,2,3,4]

  // console.log('placesByType', cityPlacesByType);
  const cityPlacesFilteredByActiveType = () => {
    if (placeType === -1) {
      return [].concat(...cityPlacesByType);
    }
    return cityPlacesByType[placeType - 1];
  }

  const cityPlacesFilteredByActiveFilter = () => {
    if (placeFilter === -1) {
      return [].concat(...cityPlacesByFilter);
    }
    return cityPlacesByFilter[placeFilter - 1];
  }

  // console.log('cityPlacesFilteredByActiveType', cityPlacesFilteredByActiveType());

  const toggleTypeFilter = (e, filterValue) => {
    e.preventDefault();
    if (placeType === filterValue) {
      setPlaceType(-1);
      return;
    }
    setPlaceType(filterValue);
  }

  const toggleFilterFilter = (e, filterValue) => {
    e.preventDefault();
    if (placeFilter === filterValue) {
      setPlaceFilter(-1);
      return;
    }
    setPlaceFilter(filterValue);
  }
  const addToFavorites = (e, value, place) => {
    e.preventDefault();
    localStorage.setItem(`tawowu-fav-${value}`, JSON.stringify(place)); // put
  }


  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (e, filterValue) => {
    activeFilters.forEach(element => console.log(element));
    e.preventDefault();
    const index = activeFilters.indexOf(filterValue);
    if (index > -1) {
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
    console.log(activeFilters);
  }

  const toggleFilterNew = (e,name, value) => {
    e.preventDefault();
    const index = activeFilters.findIndex(f=>f.value===value);
    if (index > -1) {
      activeFilters.splice(index, 1);
      
    } else {
      activeFilters.push({name,value});
    }
    setActiveFilters([...activeFilters])
    console.log(activeFilters);
  }


  const getActiveFilteredPlaces = () => {
    console.log([...cityPlaces()]);
    let result = [...cityPlaces()];
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        console.log(filter);
        result = result.filter(pl=>pl.filter.indexOf(filter)!==-1)
        //result = result.filter(pl=>pl[filter.name].indexOf(filter.value)!==-1)
      })
    }
    console.log(result);
    return result;
  }
  // const activeFilters = [['type', [1, 2, 3]], ['location', [1]]];
  // const places = [{type: [1, 3, 2], location: 1}, {type:1, location: 3}, {type:2, location:3}];
  //
  // const getFilteredPlaces = () => {
  //
  //   // [1, 2, 3] === [1, 2, 3]
  //   // 1-2-3 === 1-2-3
  //   // 1-2-3 !== 1-3-2
  //
  //   let result = [...places];
  //
  //   activeFilters.forEach(filter => { // ['type', 1]
  //     result = result.filter(place => place[filter[0]].join('-') === filter[1].join('-'))
  //   })
  //
  //   return result;
  // }
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/greggs.json?access_token=pk.eyJ1Ijoia3Jpc3RpbmFrdXplbmtvIiwiYSI6ImNrbnJpZDFtYjBwMG8ybnBmeG82a3Z0ejYifQ.GYQGZmk2Y0sSruGEpupdgw&bbox=-0.227654%2C51.464102%2C0.060737%2C51.553421&limit=10`;
  const [locations, setLocations] = React.useState([]);
  const mySortingFunction = (a, b) => a.popularity.localeCompare(b.popularity);
  return <Layout title={city}>
    {currentCity.map((cityItem) => (
      <div className="city-block" key={cityItem.city}>
        <img className="city-main-img" src={cityItem.image} />
        <div className="city-main-caption">
          {cityItem.city}
        </div>
        <Container><Map locations={locations} /></Container>
        <div className="city-filter container-fluid ">

          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" >Sightseeing</p>
          </div>
          <a href="#food">
            <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
              <p className="filter-name">Food</p>

            </div>
          </a>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" >Shopping</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" >Transportation</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name">Activities</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name">Trip plans</p>
          </div>

        </div>

        <div>
          <div className="sightseeing-h">Things to do in {cityItem.city}</div>

          <div className="places-div">
            <div className="container-fluid ">
              <div className="icon-container">

                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className={placeFilter === 1 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Art" src="../art.png" onClick={(e) => toggleFilter(e, 1)} />
                </div>

                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className={placeFilter === 2 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Insta places" src="../camera.png" onClick={(e) => toggleFilter(e, 2)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className={placeFilter === 3 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Parks / outdoors" src="../park.png" onClick={(e) => toggleFilter(e, 3)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className={placeFilter === 4 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Museums" src="../museum.png" onClick={(e) => toggleFilter(e, 4)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className={placeFilter === 5 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Viewpoints" src="../view.png" onClick={(e) => toggleFilter(e, 5)} />
                </div>
                <div data-toggle="modal" data-target="#filterModal" className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
                <div className="modal fade " id="filterModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <h1 className="modal-f">Filter by categories</h1>
                      <p className="btn modal-item" onClick={(e) => toggleFilterFilter(e, 1)}>Art</p>
                      <p className="btn modal-item" onClick={(e) => toggleFilterFilter(e, 2)}>Insta places</p>
                      <span className="btn close-btn modal-item" data-dismiss="modal">Close</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className="input-city">
              <SearchInput
                placeholder="Search for city"
                onChange={onInputChange}
              />
            </div>

            {getActiveFilteredPlaces().filter(place => place.type.indexOf(1) !== -1).sort(mySortingFunction).map((place) => (
              <div className="one-place" key={place.name}>
                <h1 className="place-name"> {place.name} </h1>
                <p className="place-desc">{place.description} </p>
                <div className="container-fluid ">
                  <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <img className="image-city " src={place.image} />
                  </div>

                  <div className="btn filter-p filter-btn " onClick={(e) => addToFavorites(e, place.name, place)}>
                    Add to favorites
                      </div>

                  <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                    <h1 className="place-h">Price </h1>
                    <h1 className="place-p">{place.price}</h1>
                    <h1 className="place-h">Location</h1>
                    <h1 className="place-p">{place.location}</h1>
                    <h1 className="place-h">Transport</h1>
                    <h1 className="place-p">{place.transport}</h1>
                    <h1 className="place-h">Tips</h1>
                    <h1 className="place-p">{place.tips}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div id="food" className="sightseeing-h">Food in {city}
          </div>
          <div className="places-div">
            <div className="container-fluid ">
              <div className="icon-container">
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Take-away" src="../take-away.png" onClick={(e) => toggleFilter(e, 1)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Coffee shops" src="../tea.png" onClick={(e) => toggleFilterFilter(e, 2)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Bars" src="../cocktail.png" onClick={(e) => toggleFilterFilter(e, 3)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Restaurants / cafes" src="../restaurant.png" onClick={(e) => toggleFilterFilter(e, 4)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Confectionery" src="../cupcake.png" onClick={(e) => toggleFilterFilter(e, 5)} />
                </div>
                <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
              </div>
            </div>
            {cityPlacesFilteredByActiveFilter().filter(place => place.type.indexOf(2) !== -1).sort(mySortingFunction).map((place) => (
              <div className="one-place" key={place.name}>
                <h1 className="place-name"> {place.name} </h1>
                <p className="place-desc">{place.description} </p>
                <div className="container-fluid ">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <img className="image-city " src={place.image} />
                  </div>

                  <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                    <h1 className="place-h">Average bill price</h1>
                    <h1 className="place-p">{place.price}</h1>
                    <h1 className="place-h">Location</h1>
                    <h1 className="place-p">{place.location}</h1>
                    <h1 className="place-h">Transport</h1>
                    <h1 className="place-p">{place.transport}</h1>
                    <h1 className="place-h">Our favorites / recommendations</h1>
                    <h1 className="place-p">{place.tips}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sightseeing-h">Shopping in {city}
          </div>
          <div className="places-div">
            <div className="container-fluid ">
              <div className="icon-container">
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Markets" src="../market.png" onClick={(e) => toggleFilterFilter(e, 1)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Shopping malls / streets" src="../clothes.png" onClick={(e) => toggleFilterFilter(e, 2)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Supermarkets" src="../supermarket.png" onClick={(e) => toggleFilterFilter(e, 3)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Souvenir shops" src="../souvenir.png" onClick={(e) => toggleFilterFilter(e, 4)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Outlet" src="../outlet.png" onClick={(e) => toggleFilterFilter(e, 5)} />
                </div>
                <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
              </div>
            </div>
            {cityPlacesByType[2].map((places) => (
              <div className="one-place" key={places.name}>
                <h1> {places.name} </h1>
                <p>{places.description} </p>
                <div className="container-fluid ">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <img className="image-city " src={places.image} />
                  </div>

                  <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                    <h1 className="place-h">Location</h1>
                    <h1 className="place-p">{places.location}</h1>
                    <h1 className="place-h">Transport</h1>
                    <h1 className="place-p">{places.transport}</h1>
                    <h1 className="place-h">Tips</h1>
                    <h1 className="place-p">{places.tips}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sightseeing-h">Transport in {city}
          </div>
          <div className="places-div">
            {cityPlacesByType[3].map((places) => (
              <div className="one-place" key={places.name}>
                <h1> {places.name} </h1>
                <p>{places.description} </p>
                <div className="container-fluid ">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <img className="image-city " src={places.image} />
                  </div>

                  <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                    <h1 className="place-p">{places.price}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sightseeing-h"> in {city}
          </div>
          <div className="places-div">
            {values.map((places) => (
              <div className="one-place" key={places.name}>
                <h1> {places.name} </h1>
                <p>{places.description} </p>
                <div className="container-fluid ">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <img className="image-city " src={places.image} />
                  </div>

                  <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                    <h1 className="place-p">{places.price}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    ))}

  </Layout>;

}
const Container = styled.div`
  width: 50vw;
  height: 50vh;
`;
export default City;
export const getServerSideProps = async ({ params }) => {
  const city = params.id;
  return {
    props: {
      city
    },
  };
};
