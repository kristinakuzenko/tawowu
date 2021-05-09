import Layout from "../../components/Layout/Layout";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import SearchInput from "../../components/SearchInput/SearchInput";
//database import
import fire from '../../config/fire-config';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from "react";


const City = ({ city }) => {
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
favPlaces.splice(index,1);
setFavPlaces([...favPlaces]);
  }

  const [placeType, setPlaceType] = useState(1);

  const toggleType = (e, typeValue) => {
    e.preventDefault();
    if (placeType !== typeValue) {
      activeFilter.splice(0,activeFilter.length);
      activeFilters.splice(0,activeFilters.length);
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
  const [showRoutes, setShowRoutes] = useState(-1);

  const toggleShowRoutes = (e, value) => {
    e.preventDefault();
    setShowRoutes(value);
  }

  const allPlaces = () => cityPlaces().filter(place => place.type.indexOf(4) === -1);


  const mySortingFunction = (a, b) => a.popularity.localeCompare(b.popularity);
  return <Layout title={city}>
    <Head>
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE"
      async
    ></script>
    </Head>
    {currentCity.map((cityItem) => (
      <div className="city-block" key={cityItem.city}>
        <div className="city-filter container-fluid ">
<map/>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item " >
            <p  onClick={(e) => toggleType(e, 1)} className={placeType === 1 ? 'filter-name active' : 'filter-name '} >&nbsp;Sightseeing&nbsp;</p>
          </div>
            <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
              <p onClick={(e) => toggleType(e, 2)} className={placeType === 2 ? 'filter-name active' : 'filter-name '}>&nbsp;Food&nbsp;</p>
            </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p onClick={(e) => toggleType(e, 3)} className={placeType === 3 ? 'filter-name active' : 'filter-name '} >&nbsp;Shopping&nbsp;</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p onClick={(e) => toggleType(e, 4)} className={placeType === 4 ? 'filter-name active' : 'filter-name '} >&nbsp;Transport&nbsp;</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p onClick={(e) => toggleShowRoutes(e, 2)} className="filter-name">&nbsp;Activities&nbsp;</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p onClick={(e) => toggleShowRoutes(e, 1)} className="filter-name">&nbsp;Trip plans&nbsp;</p>
          </div>

        </div>

        <div>


          <div className="places-div">


            <div className="container-fluid ">
              <div className=" col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 map-container">
              <div className="city-main-caption">
         {cityItem.city}
        </div>
        <div onClick={(e) => toggleAllTogether(e, 1)} className= {allTogether===-1 ? ' show-all filter-type-container ' : 'none'}>
          <p className={allTogether===-1 ? 'continent-filter-p ' : 'none'}  >&nbsp;Show all places together&nbsp; </p>
        </div>
        <div onClick={(e) => toggleAllTogether(e, -1)} className= {allTogether===1 ? ' show-all filter-type-container ' : 'none'}>
          <p className={allTogether===1 && placeType===2? 'continent-filter-p ' : 'none'}  >&nbsp;Show only food&nbsp; </p>
          <p className={allTogether===1 && placeType===1? 'continent-filter-p ' : 'none'}  >&nbsp;Show only sightseeing&nbsp; </p>
          <p className={allTogether===1 && placeType===3? 'continent-filter-p ' : 'none'}  >&nbsp;Show only shopping&nbsp; </p>
        </div>
                <Map className="fixed" locations={ allTogether===-1?filteredPlacesValue():allPlaces()} latitude={currentCity[0].latitude} longitude={currentCity[0].longitude} zoom={12} />
                       
              </div>
              <div className="city-places-div col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7">
                <div className="fixed-div">
                  <div className={placeType === 4 ?' none':'input-city'}>
                    <SearchInput
                      placeholder="Search for a place"
                      onChange={onInputChange}
                      value={keyword}
                    />
                  </div>
                  <div className="container-fluid ">
                    <div className={placeType === 1 ? 'icon-container ' : 'icon-container active'} >

                      <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                        <img className={activeFilter[0] === 1 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Art" src="../art.png" onClick={(e) => toggleFilterOne(e, 1)} />
                      </div>

                      <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                        <img className={activeFilter[0] === 2 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Insta places" src="../camera.png" onClick={(e) => toggleFilterOne(e, 2)} />
                      </div>
                      <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                        <img className={activeFilter[0] === 3 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Parks / outdoors" src="../park.png" onClick={(e) => toggleFilterOne(e, 3)} />
                      </div>
                      <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                        <img className={activeFilter[0] === 4 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Museums" src="../museum.png" onClick={(e) => toggleFilterOne(e, 4)} />
                      </div>
                      <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                        <img className={activeFilter[0] === 5 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Viewpoints" src="../view.png" onClick={(e) => toggleFilterOne(e, 5)} />
                      </div>
                      <div data-toggle="modal" data-target="#filterModal" className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                        <p className="filter-p">Filter</p>
                      </div>
                      <div className="modal fade " id="filterModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <h1 className="modal-f">Filter by categories</h1>
                            <p className={!activeFilters.includes(1)?'btn modal-item2':'none'} onClick={(e) => toggleFilter(e, 1)}>Art</p>
                            <p className={activeFilters.includes(1)?'btn modal-item2 filter-active':'none'} onClick={(e) => toggleFilter(e, 1)}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> Art</p>
                            <p className={!activeFilters.includes(2)? 'btn modal-item2':'none'} onClick={(e) => toggleFilter(e, 2)}>Insta places</p>
                            <p className={activeFilters.includes(2) ?'btn modal-item2 filter-active':'none'} onClick={(e) => toggleFilter(e, 2)}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> Insta places</p>
<div>
                            <span className="btn close-btn modal-item col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6" data-dismiss="modal">Done</span>
                            <span className="btn close-btn modal-item col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6" data-dismiss="modal" onClick={(e) => clearAll(e)}>Clear all</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
              <div className={placeType === 2 ? 'icon-container ' : 'icon-container active'}>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 1 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Take-away" src="../take-away.png" onClick={(e) => toggleFilterOne(e, 1)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 2 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Coffee shops" src="../tea.png" onClick={(e) => toggleFilterOne(e, 2)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 3 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Bars" src="../cocktail.png" onClick={(e) => toggleFilterOne(e, 3)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 4 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Restaurants / cafes" src="../restaurant.png" onClick={(e) => toggleFilterOne(e, 4)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 5 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Confectionery" src="../cupcake.png" onClick={(e) => toggleFilterOne(e, 5)} />
                </div>
                <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
            </div>
              <div className={placeType === 3 ? 'icon-container ' : 'icon-container active'}>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 1 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Markets" src="../market.png" onClick={(e) => toggleFilterOne(e, 1)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 2 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Shopping malls / streets" src="../clothes.png" onClick={(e) => toggleFilterOne(e, 2)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 3 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Supermarkets" src="../supermarket.png" onClick={(e) => toggleFilterOne(e, 3)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 4 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Souvenir shops" src="../souvenir.png" onClick={(e) => toggleFilterOne(e, 4)} />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className={activeFilter[0] === 5 ? 'small-icon active' : 'small-icon'} data-toggle="tooltip" data-placement="bottom" title="Outlet" src="../outlet.png" onClick={(e) => toggleFilterOne(e, 5)} />
                </div>
                <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
              </div>
                  </div>
                </div>
                {filteredPlaces(placeType).filter(place => place.type.indexOf(placeType) !== -1).sort(mySortingFunction).map((place) => (
                  <div className="one-place" key={place.name}>
                    <h1 className="place-name"> {place.name} </h1>
                    <p className="place-desc">{place.description} </p>
                    <div className="container-fluid ">
                      <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                        <img className="image-city " src={place.image} />
                      </div>

                      <div className={placeType !== 4 && favPlaces.indexOf(place)===-1 ?'btn filter-p filter-btn ':'none'} onClick={(e) => addToFavorites(e, place.name, place)}>
                        Add to favorites
                      </div>
                      <div className={placeType !== 4 && favPlaces.indexOf(place)!==-1 ?'btn filter-p filter-btn ':'none'} onClick={(e) => removeFromFavorites(e, place.name, place)}>
                        Remove from favorites
                      </div>

                      <div className={placeType === 1 ? 'col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8':'none' } >
                        <h1 className="place-h">Price </h1>
                        <h1 className="place-p">{place.price}</h1>
                        <h1 className="place-h">Location</h1>
                        <h1 className="place-p">{place.location}</h1>
                        <h1 className="place-h">Transport</h1>
                        <h1 className="place-p">{place.transport}</h1>

                      </div>

                    <div className={placeType === 2 ? 'col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8':'none' }>
                    <h1 className="place-h">&nbsp; Average bill price</h1>
                    <h1 className="place-p">{place.price}</h1>
                    <h1 className="place-h">Location</h1>
                    <h1 className="place-p">{place.location}</h1>
                    <h1 className="place-h">Transport</h1>
                    <h1 className="place-p">{place.transport}</h1>
                  </div>
                  <div className={placeType === 3 ? 'col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8':'none' }>
                    <h1 className="place-h">Location</h1>
                    <h1 className="place-p">{place.location}</h1>
                    <h1 className="place-h">Transport</h1>
                    <h1 className="place-p">{place.transport}</h1>
                  </div>
                  <div className={placeType === 4 ? 'col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8':'none' }>
                    <h1 className="place-p">{place.price}</h1>
                  </div>

                    </div>
                    <h1 className={placeType !== 4 ?'place-h':'none'}>Tips</h1>
                  <h1 className={placeType !== 4 ?'place-p':'none'}>{place.tips}</h1>
                  </div>
                ))}
              </div>
            </div>
            <div>
              
            </div>
          </div>


        </div>

      </div>
    ))}

  </Layout>;

}
export default City;
export const getServerSideProps = async ({ params }) => {
  const city = params.id;
  return {
    props: {
      city
    },
  };
};
