import Layout from "../../components/Layout/Layout";
import Autocomplete from "../../components/Autocomplete/Autocomplete";
import MapPlaces from "../../components/MapPlaces/MapPlaces";
import MapGoogle from "../../components/GoogleMap/GoogleMap";
import { signin, signout, useSession } from 'next-auth/client';
import key from "../../components/GoogleApiKey/GoogleApiKey";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import SearchInput from "../../components/SearchInput/SearchInput";
//database import
import fire from '../../config/fire-config';
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef,useCallback } from "react";
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    DirectionsRenderer, geocodeByAddress,
    PlacesAutocomplete
} from "react-google-maps";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { render } from "react-dom";
import MapGL from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

const MapLoader = withScriptjs(MapGoogle);
const NewPlan = ({ city }) => {
    const [session, loading] = useSession();
    const [addressStart, setAddressStart] = useState("");
    const [addressEnd, setAddressEnd] = useState("");
    let _isMounted = false;
    const [cities, setCities] = useState([]);
    const [places, setPlaces] = useState([]);
    const [favPlaces, setFavPlaces] = useState([]);
    const [currentLoc, setCurrentLoc]=useState({})
    const [myCity, setMyCity]=useState({});
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

    const [startChoose, setStartChoose] = useState(1);

    const toggleStartChoose = (e, value) => {
        e.preventDefault();
        setStartChoose(value);
    }

    const [endChoose, setEndChoose] = useState(1);

    const toggleEndChoose = (e, value) => {
        e.preventDefault();
        setEndChoose(value);
    }

    const [days, setDays] = useState(1);

    const toggleDays = (e, value) => {
        e.preventDefault();
        setDays(value);
    }
    const [page, setPage] = useState(1);

    const togglePage = (e, value) => {
        console.log(addressStart);
        e.preventDefault();
        setPage(value);
    }

    const [byCar, setByCar] = useState("Public transport / walking");
    const [byCarType, setByCarType] = useState("WALKING");

    const toggleByCar = (e, value) => {
        e.preventDefault();
        setByCar(value);
        if(value==="Car"){
            setByCarType("DRIVING");
        }else if(value==="Bicycle"){
            setByCarType("BICYCLING");
        }else {
            setByCarType("TWO_WHEELER");
        }
    }
   
    const [messageData, setMessageData] = useState("");
    const validateName = (e) => {
        e.preventDefault();
        setMessageData("");
        if(name===""){
            setMessageData("Please, enter plan name");
        }else{
            if(session){
                if(localStorage.getItem(`user-plans-${session.user.email}`)!==null){
                JSON.parse(localStorage.getItem(`user-plans-${session.user.email}`)).forEach(item=>{
                    if(name===item.name){
                        setMessageData("You already have this plan name");
                    }else{
                        togglePage(e, 2);
                    }
                })
            }else{
                togglePage(e, 2);
            }
            }
        }
}

const [distance, setDistance] = useState(0);
const [time, setTime] = useState(0);
const [price, setPrice] = useState(0);
const [messageDataValidate, setMessageDataValidate] = useState("");

    const createPlan = (name, e) => {
        e.preventDefault();
       if (session) {
        setMessageDataValidate("");
            const route=[];
            const route_transport=[];
            route.push(JSON.parse(localStorage.getItem(`route-${name}`)));
            route_transport.push(JSON.parse(localStorage.getItem(`routes-transport-${name}`)));
            console.log(route_transport[0]);
            let dist=0;
            let time=0;
            let price=0;
            if(route_transport[0]===null){
                route[0].forEach(item=>{
                    dist+=item.distance.value;
                    time+=item.duration.value;
                     //setDistance(dist);
                 });
            }else{
                route_transport[0].forEach(item=>{
                    dist+=item.distance;
                    time+=item.time;
                     //setDistance(dist);
                })
            }
           favPlaces.forEach(item=>{
                time+=item.time*60;
                price+=item.money;
            });
            if(time>36000*days){
                setMessageDataValidate("Ooops, you have selected too many sightseeing places.\n Please, delete some places to continue.");
                
            }else if(budget!==""&&price>parseInt(budget)){
                setMessageDataValidate("Ooops, you have selected too many sightseeing places for your budget.\n Please, delete some places or change your budget to continue.");
               
            }else{
                setMessageDataValidate("")  ;
                const data = {
                    start: addressStart,
                    end:addressEnd,
                    city: currentCity[0],
                    name: name,
                    byCar: byCar,
                    days: days,
                    budget: budget,
                    price: price,
                    time:time,
                    dist:dist,
                    places: favPlaces,
                    route:route,
                    route_transport:route_transport
                };
                const res = fire.firestore().collection('user-routes').doc(`${session.user.email}-${name}`).set({});
                if(localStorage.getItem(`user-plans-${session.user.email}`)!==null){
                    console.log("lll")
                    const routes=JSON.parse(localStorage.getItem(`user-plans-${session.user.email}`));
                    routes.push(data);
                    //console.log(JSON.stringify(routes));
                    localStorage.setItem(`plan-data-${name}`, JSON.stringify(data));
                    //write to database
                    var washingtonRef =  fire.firestore().collection("users").doc(session.user.email);
                    washingtonRef.update({
                        routes: JSON.stringify(routes)
                    });
                }else{
                    const routes=[];
                    routes.push(data);
                  
                    localStorage.setItem(`plan-data-${name}`, JSON.stringify(data));
                    //write to database
                    var washingtonRef =  fire.firestore().collection("users").doc(session.user.email);
                    washingtonRef.update({
                        routes: JSON.stringify(routes)
                    });
                }
            }
          }
     if(messageDataValidate===""){
        window.location.href = `/plan/${name} `;
     }
    }

    const allPlaces = () => cityPlaces().filter(place => place.type.indexOf(4) === -1);


    const checkRoute = (e) => {
        setMessageDataValidate("");
        if(favPlaces.length>27){
            setMessageDataValidate("Ooops, you have selected too many sightseeing places.\n Please, delete some places to continue.");
        } else{
        const directionsService = new google.maps.DirectionsService();
        const type = byCarType;
        const defaultLoc = { lat: currentCity[0].latitude, lng: currentCity[0].longitude };
        var loc = [];
        favPlaces.forEach(place => loc.push({ location: place.location, stopover: true }));
        if(startChoose===1&&endChoose===1){
            directionsService.route(
                {
                  origin: defaultLoc,
                  destination: defaultLoc,
                  waypoints: loc,
                  optimizeWaypoints: true,
                  travelMode: google.maps.TravelMode[type]
                },
                (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                    if (type === "WALKING"&& byCar==="Public transport / walking") {
          
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
                              var instructions = [];
                              var dist = 0;
                              var time = 0;
                              result.routes[0].legs[0].steps.forEach(step => {
                                var instr = ``;
                                instr += `${step.instructions}  (${step.duration.text}, ${step.distance.text})`;
                                instructions.push(instr);
                                dist += step.distance.value;
                                time += step.duration.value;
          
                              })
                              resolve({ instructions: instructions, distance: dist, time: time, start: origin1, end: destination1 });
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
                        localStorage.setItem(`routes-transport-${name}`, JSON.stringify(r));
                        console.log(JSON.parse(localStorage.getItem(`routes-transport-${name}`)));
                        
                        //console.log(time);
                      })
                    }
                    localStorage.setItem(`route-${name}`, JSON.stringify(result.routes[0].legs));
                    Object.keys(localStorage).filter(key => key.indexOf(`route-${name}`) !== -1).forEach((key) => {
                      console.log(JSON.parse(localStorage.getItem(key)));
                  });
                  } else {
                    console.error(`error fetching directions ${result}`);
                  }
                }
              );
        }else if(startChoose===1&&endChoose!==1){
            directionsService.route(
                {
                  origin: defaultLoc,
                  destination: addressEnd,
                  waypoints: loc,
                  optimizeWaypoints: true,
                  travelMode: google.maps.TravelMode[type]
                },
                (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                    if (type === "WALKING"&& byCar==="Public transport / walking") {
          
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
                              var instructions = [];
                              var dist = 0;
                              var time = 0;
                              result.routes[0].legs[0].steps.forEach(step => {
                                var instr = ``;
                                instr += `${step.instructions}  (${step.duration.text}, ${step.distance.text})`;
                                instructions.push(instr);
                                dist += step.distance.value;
                                time += step.duration.value;
          
                              })
                              resolve({ instructions: instructions, distance: dist, time: time, start: origin1, end: destination1 });
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
                        localStorage.setItem(`routes-transport-${name}`, JSON.stringify(r));
                        Object.keys(localStorage).filter(key => key.indexOf(`routes-transport-${name}`) !== -1).forEach((key) => {
                          console.log(JSON.parse(localStorage.getItem(key)));
                      });
                      })
                    }
                    localStorage.setItem(`route-${name}`, JSON.stringify(result.routes[0].legs));
                    Object.keys(localStorage).filter(key => key.indexOf(`route-${name}`) !== -1).forEach((key) => {
                      console.log(JSON.parse(localStorage.getItem(key)));
                  });
                  } else {
                    console.error(`error fetching directions ${result}`);
                  }
                }
              );
        } else if(startChoose!==1&&endChoose===1){
            directionsService.route(
                {
                  origin: addressStart,
                  destination: defaultLoc,
                  waypoints: loc,
                  optimizeWaypoints: true,
                  travelMode: google.maps.TravelMode[type]
                },
                (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                    if (type === "WALKING"&& byCar==="Public transport / walking") {
          
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
                              var instructions = [];
                              var dist = 0;
                              var time = 0;
                              result.routes[0].legs[0].steps.forEach(step => {
                                var instr = ``;
                                instr += `${step.instructions}  (${step.duration.text}, ${step.distance.text})`;
                                instructions.push(instr);
                                dist += step.distance.value;
                                time += step.duration.value;
          
                              })
                              resolve({ instructions: instructions, distance: dist, time: time, start: origin1, end: destination1 });
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
                        localStorage.setItem(`routes-transport-${name}`, JSON.stringify(r));
                        Object.keys(localStorage).filter(key => key.indexOf(`routes-transport-${name}`) !== -1).forEach((key) => {
                          console.log(JSON.parse(localStorage.getItem(key)));
                      });
                      })
                    }
                    localStorage.setItem(`route-${name}`, JSON.stringify(result.routes[0].legs));
                    Object.keys(localStorage).filter(key => key.indexOf(`route-${name}`) !== -1).forEach((key) => {
                      console.log(JSON.parse(localStorage.getItem(key)));
                  });
                  } else {
                    console.error(`error fetching directions ${result}`);
                  }
                }
              );
        } else {
            directionsService.route(
                {
                  origin: defaultLoc,
                  destination: defaultLoc,
                  waypoints: loc,
                  optimizeWaypoints: true,
                  travelMode: google.maps.TravelMode[type]
                },
                (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                    if (type === "WALKING" && byCar==="Public transport / walking") {
          
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
                              var instructions = [];
                              var dist = 0;
                              var time = 0;
                              result.routes[0].legs[0].steps.forEach(step => {
                                var instr = ``;
                                instr += `${step.instructions}  (${step.duration.text}, ${step.distance.text})`;
                                instructions.push(instr);
                                dist += step.distance.value;
                                time += step.duration.value;
          
                              })
                              resolve({ instructions: instructions, distance: dist, time: time, start: origin1, end: destination1 });
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
                        localStorage.setItem(`routes-transport-${name}`, JSON.stringify(r));
                        Object.keys(localStorage).filter(key => key.indexOf(`routes-transport-${name}`) !== -1).forEach((key) => {
                          console.log(JSON.parse(localStorage.getItem(key)));
                      });
                      })
                    }
                    localStorage.setItem(`route-${name}`, JSON.stringify(result.routes[0].legs));
                    Object.keys(localStorage).filter(key => key.indexOf(`route-${name}`) !== -1).forEach((key) => {
                      console.log(JSON.parse(localStorage.getItem(key)));
                  });
                  } else {
                    console.error(`error fetching directions ${result}`);
                  }
                }
              );
        }
    }
    }

    const mySortingFunction = (a, b) => a.popularity.localeCompare(b.popularity);
    return <Layout title={city}>

        {currentCity.map((cityItem) => (
            <div className="city-block" key={cityItem.city}>
                <div>
                    <div className={page === 1 ? "places-div " : "none"}>
                        <div >


                            <div onClick={(e) => calculate(e)} className="city-main-caption">
                                Create yor own plan for  {cityItem.city}
                            </div>
                            <div onClick={(e) => validateName(e)} className="new-plan">
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
                            

                            <div className="fill-data">
                                <h1 className="plan-h"> How are you travelling?</h1>

                                <div className="continent-filter filter-type-container col-8 col-sm-8 col-md-4 col-lg-4 col-xl-4 ">
                                    <p onClick={(e) => toggleByCar(e, "Public transport / walking")} className={byCar === "Public transport / walking" ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;Public transport / walking&nbsp; </p>
                                </div>
                                <div className="continent-filter filter-type-container  col-4 col-sm-4 col-md-2 col-lg-2 col-xl-2 ">
                                    <p onClick={(e) => toggleByCar(e, "Car")} className={byCar === "Car" ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;By car&nbsp; </p>
                                </div>
                                <div className="continent-filter filter-type-container  col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 ">
                                    <p onClick={(e) => toggleByCar(e, "Bicycle")} className={byCar === "Bicycle" ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;By bicycle&nbsp; </p>
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

                    <div className={page === 4 ? "places-div" : "none"}>
                        <div className="plan-main-caption plan-cap">
                            Select up to 27 places
                     </div>
                        <div className="container-fluid">
                            <div className="row ">
                                <div onClick={(e) => togglePage(e, 3)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                                    <div className="btn filter-p filter-btn ">
                                        Back
                            </div>
                                </div>
                                <div onClick={(e) => createPlan(name, e)} className="new-plan">
                            <div className="btn filter-p filter-btn ">
                                Create  plan
                            </div>
                        </div>
                                <div onClick={(e) => checkRoute(e)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
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
                    <div className={page === 2 ? "places-div" : "none"}>
                        <div className="plan-main-caption plan-cap">
                            Choose your start point
                     </div>
                     <div className="continent-filter filter-type-container col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
                                    <p onClick={(e) => toggleStartChoose(e,1)} className={startChoose === 1 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;Start in the city center&nbsp; </p>
                                </div>
                                <div className="continent-filter filter-type-container col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
                                    <p onClick={(e) => toggleStartChoose(e,2)} className={startChoose === 2 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;Start from my hotel / location&nbsp; </p>
                                </div>

                        <div className="container-fluid plan-btn">
                            <div className="row ">
                                <div onClick={(e) => togglePage(e, 1)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                                    <div className="btn filter-p filter-btn ">
                                        Back
                            </div>
                                </div>
                                <div onClick={(e) => togglePage(e, 3)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                                    <div className="btn filter-p filter-btn ">
                                        Next
                            </div>
                                </div>

                            </div>
                        </div>
                        
                        <div className={startChoose === 1?"help-div":"none"}></div>
                        <div className={startChoose === 1?"none":""}>
                             <div className="help-div">
                             <MapPlaces handleSetAddress={(a)=>setAddressStart(a)} addressStart={addressStart}/>
                             
                             </div>
                     
                        </div>
                         </div>
                         <div className={page === 3 ? "places-div" : "none"}>
                        <div className="plan-main-caption plan-cap">
                            Where you want to end your trip?
                     </div>
                     <div className="continent-filter filter-type-container col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
                                    <p onClick={(e) => toggleEndChoose(e,1)} className={endChoose === 1 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;Use my start location&nbsp; </p>
                                </div>
                                <div className="continent-filter filter-type-container col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
                                    <p onClick={(e) => toggleEndChoose(e,2)} className={endChoose === 2 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;Custom end location&nbsp; </p>
                                </div>

                        <div className="container-fluid plan-btn">
                            <div className="row ">
                                <div onClick={(e) => togglePage(e, 2)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                                    <div className="btn filter-p filter-btn ">
                                        Back
                            </div>
                                </div>
                                <div onClick={(e) => togglePage(e, 4)} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 new-plan">
                                    <div className="btn filter-p filter-btn ">
                                        Next
                            </div>
                                </div>

                            </div>
                        </div>
                        
                        <div className={endChoose === 1?"help-div":"none"}></div>
                        <div className={endChoose === 1?"none":""}>
                             <div className="help-div">
                             <MapPlaces handleSetAddress={(a)=>setAddressEnd(a)} addressEnd={addressEnd}/>
                             
                             </div>
                     
                        </div>
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
