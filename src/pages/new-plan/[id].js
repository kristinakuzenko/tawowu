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
const NewPlan = ({ city }) => {
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

    const addToPlan = (e, value, place) => {
        e.preventDefault();
        localStorage.setItem(`tawowu-plan-${value}`, JSON.stringify(place));
        favPlaces.push(place);
        setFavPlaces([...favPlaces]);
    }
    const removeFromPlan = (e, value, place) => {
        e.preventDefault();
        localStorage.removeItem(`tawowu-plan-${value}`);
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
                        <div className="city-main-caption">
                            Create yor own plan for  {cityItem.city}
                        </div>
                        <form>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Plan name: </label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="1"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Select number of days you are staying in {cityItem.city}</label>
                                <select class="form-control" id="exampleFormControlSelect1">
                                    <option value="1">1</option>
                                    <option >2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Your budget in US dollars $ for all trip:  </label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="1"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Are you travelling by car?</label>
                                <select class="form-control" id="exampleFormControlSelect1">
                                    <option>Without car</option>
                                    <option>By car</option>
                                </select>
                            </div>
                        </form>

                        <div className="city-main-caption">
                            Select up to 27 places
                     </div>


                        <div className="container-fluid">
                            <div className="row ">
                                <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 continent-filter filter-type-container">
                                    <p onClick={(e) => toggleType(e, 1)} className={placeType === 1 ? 'continent-filter-p active ' : 'continent-filter-p '}  >&nbsp;Sightseeing&nbsp; </p>
                                </div>
                                <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 continent-filter filter-type-container">
                                    <p onClick={(e) => toggleType(e, 2)} className={placeType === 2 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;Food&nbsp;</p>
                                </div>
                                <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 continent-filter filter-type-container">
                                    <p onClick={(e) => toggleType(e, 3)} className={placeType === 3 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;Shopping&nbsp; </p>
                                </div>
                            </div>
                        </div>

                        <div className="container-fluid ">
                            <div className=" col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 map-container">

                                <div onClick={(e) => toggleAllTogether(e, 1)} className={allTogether === -1 ? ' show-all filter-type-container ' : 'none'}>
                                    <p className={allTogether === -1 ? 'continent-filter-p ' : 'none'}  >&nbsp;Show all places together&nbsp; </p>
                                </div>
                                <div onClick={(e) => toggleAllTogether(e, -1)} className={allTogether === 1 ? ' show-all filter-type-container ' : 'none'}>
                                    <p className={allTogether === 1 && placeType === 2 ? 'continent-filter-p ' : 'none'}  >&nbsp;Show only food&nbsp; </p>
                                    <p className={allTogether === 1 && placeType === 1 ? 'continent-filter-p ' : 'none'}  >&nbsp;Show only sightseeing&nbsp; </p>
                                    <p className={allTogether === 1 && placeType === 3 ? 'continent-filter-p ' : 'none'}  >&nbsp;Show only shopping&nbsp; </p>
                                </div>

                                <Map className="fixed" locations={ allTogether===-1?filteredPlacesValue():allPlaces()} latitude={currentCity[0].latitude} longitude={currentCity[0].longitude} zoom={12} />

<GoogleMapReact className={allTogether === 1 ?'none':''}
bootstrapURLKeys={{ key: "AIzaSyCp7BwWMHA_ZfhMSTSTs2QxW1_vocqb1k4" }}
defaultCenter={{lat: currentCity[0].latitude, lng: currentCity[0].longitude}}
defaultZoom={12}

>
{allTogether === -1? markers(filteredPlacesValue()): markers(allPlaces())}
</GoogleMapReact> 

                            </div>
                            <div className="city-places-div col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7">
                                <div className="fixed-div">
                                    <div className={placeType === 4 ? ' none' : 'input-city'}>
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
                                                        <p className={!activeFilters.includes(1) ? 'btn modal-item2' : 'none'} onClick={(e) => toggleFilter(e, 1)}>Art</p>
                                                        <p className={activeFilters.includes(1) ? 'btn modal-item2 filter-active' : 'none'} onClick={(e) => toggleFilter(e, 1)}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> Art</p>
                                                        <p className={!activeFilters.includes(2) ? 'btn modal-item2' : 'none'} onClick={(e) => toggleFilter(e, 2)}>Insta places</p>
                                                        <p className={activeFilters.includes(2) ? 'btn modal-item2 filter-active' : 'none'} onClick={(e) => toggleFilter(e, 2)}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> Insta places</p>
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

                                            <div className={favPlaces.indexOf(place) === -1 ? 'btn filter-p filter-btn ' : 'none'} onClick={(e) => addToPlan(e, place.name, place)}>
                                                Add to plan
                      </div>
                                            <div className={favPlaces.indexOf(place) !== -1 ? 'btn filter-p filter-btn ' : 'none'} onClick={(e) => removeFromPlan(e, place.name, place)}>
                                                Remove from plan
                      </div>

                                            <div className={placeType === 1 ? 'col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8' : 'none'} >
                                                <h1 className="place-h">Price </h1>
                                                <h1 className="place-p">{place.price}</h1>
                                                <h1 className="place-h">Location</h1>
                                                <h1 className="place-p">{place.location}</h1>
                                                <h1 className="place-h">Transport</h1>
                                                <h1 className="place-p">{place.transport}</h1>
                                            </div>

                                            <div className={placeType === 2 ? 'col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8' : 'none'}>
                                                <h1 className="place-h">&nbsp; Average bill price</h1>
                                                <h1 className="place-p">{place.price}</h1>
                                                <h1 className="place-h">Location</h1>
                                                <h1 className="place-p">{place.location}</h1>
                                                <h1 className="place-h">Transport</h1>
                                                <h1 className="place-p">{place.transport}</h1>
                                            </div>

                                            <div className={placeType === 3 ? 'col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8' : 'none'}>
                                                <h1 className="place-h">Location</h1>
                                                <h1 className="place-p">{place.location}</h1>
                                                <h1 className="place-h">Transport</h1>
                                                <h1 className="place-p">{place.transport}</h1>
                                            </div>
                                        </div>

                                        <h1 className='place-h' >Tips</h1>
                                        <h1 className='place-p' >{place.tips}</h1>

                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                        </div>
                        <Link href={`/plan/${city}`}>
                        <div className="new-plan">
                            <div className="btn filter-p filter-btn ">
                                Create new plan
                            </div>
                        </div>
                    </Link>
                    </div>
                </div>
            </div>
        ))}

    </Layout>;

}
export default NewPlan;
export const getServerSideProps = async ({ params }) => {
    const city = params.id;
    return {
        props: {
            city
        },
    };
};
