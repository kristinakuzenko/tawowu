
import Layout from "../../components/Layout/Layout";
import Autocomplete from "../../components/Autocomplete/Autocomplete";
import Key from "../../components/GoogleApiKey/GoogleApiKey";
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
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    DirectionsRenderer,geocodeByAddress,
    PlacesAutocomplete
  } from "react-google-maps";


const NewPlan = ({ city }) => {
    let _isMounted = false;
    const [cities, setCities] = useState([]);
    const [places, setPlaces] = useState([]);
    const [favPlaces, setFavPlaces] = useState([]);
    React.useEffect(() => {
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

    const [name, setName] = useState("");
    const onInputNameChange = (e) => {
        e.preventDefault();
        setName(e.target.value);
    };

    const [budget, setBudget] = useState("");
    const onInputBudgetChange = (e) => {
        e.preventDefault();
        setBudget(e.target.value);
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
        favPlaces.push(place);
        setFavPlaces([...favPlaces]);
    }
    const removeFromPlan = (e, value, place) => {
        e.preventDefault();
        const index = favPlaces.indexOf(place);
        favPlaces.splice(index, 1);
        setFavPlaces([...favPlaces]);
    }

    const checkRoute = (e) => {
        e.preventDefault();
        const geocoder = new google.maps.Geocoder();
        const directionsService = new google.maps.DirectionsService();
        const type = "WALKING";
        const name = name;
        const origin = { lat: currentCity[0].latitude, lng: currentCity[0].longitude };
        const destination = { lat: currentCity[0].latitude, lng: currentCity[0].longitude };
        var loc = [];
        favPlaces.forEach(place => loc.push({location:place.location, stopover:true}));
        
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
                console.log("build");
              this.setState({
                directions: result
              });
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
    };

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



    const [days, setDays] = useState(1);

    const toggleDays = (e, value) => {
        e.preventDefault();
        setDays(value);
    }
    const [page, setPage] = useState(1);

    const togglePage = (e, value) => {
        e.preventDefault();
        setPage(value);
    }

    const [byCar, setByCar] = useState("Public transport / walking");

    const toggleByCar = (e, value) => {
        e.preventDefault();
        setByCar(value);
    }
    const [messageData, setMessageData] = useState("");
    const checkData = (e) => {
        e.preventDefault();
        if(name===""){
            setName("{}`${byCar}`}");
        }
    }
    const sendData = (e) => {
        e.preventDefault();
        const data={
city:currentCity[0],
name:name,
byCar:byCar,
days:days,
budget:budget,
places:favPlaces
        }
        localStorage.setItem(`plan-data-${name}`, JSON.stringify(data));
    }

    const allPlaces = () => cityPlaces().filter(place => place.type.indexOf(4) === -1);
    const calculate = (e) => {
        const directionsService = new google.maps.DirectionsService();
        const origin = { lat: currentCity[0].latitude, lng: currentCity[0].longitude };
        const destination = { lat: currentCity[0].latitude, lng: currentCity[0].longitude };
        var waypts = [];
        allPlaces().forEach(place => {
            stop = new google.maps.LatLng(place.coordinates[0], place.coordinates[1])
            waypts.push({
                location: stop,
                stopover: true
            });
        });
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.WALKING
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    var info = [];
                    for (let i = 0; i < result.routes[0].legs.length; i++) {
                        const routeSegment = i + 1;
                        info.push({
                            number: routeSegment,
                            start: result.routes[0].legs[i].start_address,
                            end: result.routes[0].legs[i].end_address,
                            distance: result.routes[0].legs[i].distance.text,
                            time: result.routes[0].legs[i].duration.text
                        })

                    }
                    console.log("ggdjsavdjhasdv")
                    console.log(result.routes[0].legs[0].distance.value);
                    console.log(result.routes[0].legs[0].duration.value);
                    console.log(info);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }



    const mySortingFunction = (a, b) => a.popularity.localeCompare(b.popularity);
    return <Layout title={city}>

        {currentCity.map((cityItem) => (
            <div className="city-block" key={cityItem.city}>
                <div>
                    <div className={page===1?"places-div ":"none"}>
                        <div >

                        
                        <div onClick={(e) => calculate(e)} className="city-main-caption">
                            Create yor own plan for  {cityItem.city}
                        </div>
                        <div  onClick={(e) => togglePage(e,2)} className="new-plan">
                            <div className="btn filter-p filter-btn ">
                                   Next
                            </div>
                            </div>
                        <div className="">
                            <h1 className="plan-h"> Plan name:</h1>
                            <SearchInput
                      placeholder="Enter your plan name"
                      onChange={onInputNameChange}
                      value={name}
                    />
                            
                        </div>

                        <div className="fill-data-day">
                            <h1 className="plan-h"> Number of days :</h1>

                            <div className="continent-filter filter-type-container col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 ">
                                <p onClick={(e) => toggleDays(e, 1)} className={days === 1 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;1&nbsp; </p>
                            </div>
                            <div className="continent-filter filter-type-container  col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                <p onClick={(e) => toggleDays(e, 2)} className={days === 2 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;2&nbsp; </p>
                            </div>
                            <div className="continent-filter filter-type-container  col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                <p onClick={(e) => toggleDays(e, 3)} className={days === 3 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;3&nbsp; </p>
                            </div>
    
                        </div>

                        <div className="fill-data">
                            <h1 className="plan-h"> How are you travelling?</h1>

                            <div className="continent-filter filter-type-container col-8 col-sm-8 col-md-4 col-lg-4 col-xl-4 ">
                                <p onClick={(e) => toggleByCar(e, "Public transport / walking")} className={byCar === "Public transport / walking" ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;Public transport / walking&nbsp; </p>
                            </div>
                            <div className="continent-filter filter-type-container  col-4 col-sm-4 col-md-2 col-lg-2 col-xl-2 ">
                                <p onClick={(e) => toggleByCar(e, "Car")} className={byCar === "Car" ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;By car&nbsp; </p>
                            </div>
                            <div className="continent-filter filter-type-container  col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 ">
                                <p onClick={(e) => toggleByCar(e, "Bicycle")} className={byCar === "Bicycle"? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;By bicycle&nbsp; </p>
                            </div>
                            <div className="continent-filter filter-type-container  col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 ">
                                <p onClick={(e) => toggleByCar(e, "Motorcycle")} className={byCar === "Motorcycle" ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;By motorcycle&nbsp; </p>
                            </div>
                            <div className="continent-filter filter-type-container  col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 ">
                                <p onClick={(e) => toggleByCar(e, "Only walking")} className={byCar === "Only walking" ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;Only walking&nbsp; </p>
                            </div>
                        </div>

                        <div className="fill-data-budget">
                            <h1 className="plan-h"> Your budget (optional) :</h1>
                            <SearchInput
                      placeholder="Enter your budget"
                      onChange={onInputBudgetChange}
                      value={budget}
                    />
                        </div>
                        
                            </div>
                        <div>
                        </div>
                        
                    </div>

                    <div className={page===2?"places-div":"none"}>
                    <div className="plan-main-caption plan-cap">
                            Select from 2 to 27 places
                     </div>
                     <div className="container-fluid">
                            <div className="row ">
                            <div  onClick={(e) => togglePage(e,1)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                            <div className="btn filter-p filter-btn ">
                                   Back
                            </div>
                            </div>
                            <div  onClick={(e) => togglePage(e,3)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                            <div className="btn filter-p filter-btn ">
                                   Next
                            </div>
                            </div>
                            <div  onClick={(e) => checkRoute(e,3)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                            <div className="btn filter-p filter-btn ">
                                   Check
                            </div>
                            </div>
                            
                            </div>
                        </div>


                        <div className="container-fluid type-cont">
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
                                <Map className="fixed" locations={allPlaces()} latitude={currentCity[0].latitude} longitude={currentCity[0].longitude} zoom={12} />

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
                        </div>
                        <div className={page===3?"places-div":"none"}>
                        <div className="plan-main-caption plan-cap">
                            Where are you staying?
                     </div>
                     <div className="container-fluid plan-btn">
                            <div className="row ">
                            <div  onClick={(e) => togglePage(e,2)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                            <div className="btn filter-p filter-btn ">
                                   Back
                            </div>
                            </div>
                            <div  onClick={(e) => togglePage(e,4)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                            <div className="btn filter-p filter-btn ">
                                   Skip
                            </div>
                            </div>
                            
                            </div>
                        </div>
                     <Autocomplete latitude={currentCity[0].latitude} longitude={currentCity[0].longitude}/>
                        </div>
                        <div className={page===4?"places-div":"none"}>
                        <div className="plan-main-caption plan-cap">
                            Where would you like to end your trip on the last day? (optional)
                     </div>
                     <div className="container-fluid plan-btn">
                            <div className="row ">
                            <div  onClick={(e) => togglePage(e,3)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                            <div className="btn filter-p filter-btn ">
                                   Back
                            </div>
                            </div>

                            <div  onClick={(e) => sendData(e)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                            <div className="btn filter-p filter-btn ">
                                   Create plan
                            </div>
                            </div>
                            
                            </div>
                        </div>
                        <Link href={`/plan/${name}`}  >
                            <div className="new-plan">
                                <div className="btn filter-p filter-btn ">
                                    Create  plan
                            </div>
                            </div>
                        </Link>
                     <Autocomplete latitude={currentCity[0].latitude} longitude={currentCity[0].longitude}/>


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
