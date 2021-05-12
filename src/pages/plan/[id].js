
import Layout from "../../components/Layout/Layout";
import MapGoogle from "../../components/GoogleMap/GoogleMap";
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
import React, { useState, useEffect, useRef } from "react";
import MyGreatPlaceWithHover from "../../components/MyPlace/MyPlace";
import {  withGoogleMap,
    withScriptjs,
    GoogleMap,
    DirectionsRenderer } from "react-google-maps";

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
const MapLoader = withScriptjs(MapGoogle);
const Plan = ({ name }) => {

    let _isMounted = false;
    const [info, setInfo] = useState([]);
    const [r, setR] = useState([]);
    React.useEffect(() => {

        Object.keys(localStorage).filter(key => key.indexOf(`plan-data-${name}`) !== -1).forEach((key) => {
            info.push(JSON.parse(localStorage.getItem(key)));
        });
        Object.keys(localStorage).filter(key => key.indexOf(`route`) !== -1).forEach((key) => {
            r.push(JSON.parse(localStorage.getItem(key)));
        });

        setInfo([...info]);
        setR([...r]);
        console.log("r");
        console.log(r[0][0]);

        return function cleanup() {
            _isMounted = false;
        }
    }, [])
    const Map = dynamic(() => import("../../components/Map/Map"), {
        loading: () => "Loading...",
        ssr: false
    });


    const [distance, setDistance] = useState("");
    const [routes, setRoutes] = useState([]);
    const [routesInstr, setRoutesInstr] = useState([]);

    const calculate = (e) => {
        const directionsService = new google.maps.DirectionsService();
        const geocoder = new google.maps.Geocoder();
        const origin = { lat: info[0].city.latitude, lng: info[0].city.longitude };
        const destination = { lat: info[0].city.latitude, lng: info[0].city.longitude };
        var waypts = [];
        var coo=[];
        const instr = [];
        info[0].places.forEach(place => {
            stop = new google.maps.LatLng(place.coordinates[0], place.coordinates[1])
            waypts.push({
                location: stop,
                stopover: true
            });
        });
        info[0].places.forEach(place => {
            
            geocoder.geocode({ address: place.location }, (results, status) => {
                var loc={lat:results[0].geometry.location.lat(),lng:results[0].geometry.location.lng()};
                   
                    coo.push(loc)
                     console.log(loc);
                  console.log(results[0].geometry.location.lat());
                  console.log(results[0].geometry.location.lng());
        
                
            });
        });
        console.log("way");
     console.log(coo);
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
                    for (let i = 0; i < result.routes[0].legs.length; i++) {
                        const routeSegment = i + 1;
                        routes.push({
                            number: routeSegment,
                            start: result.routes[0].legs[i].start_address,
                            start_coordinates: [result.routes[0].legs[i].start_location.lat(), result.routes[0].legs[i].start_location.lng()],
                            end_coordinates: [result.routes[0].legs[i].end_location.lat(), result.routes[0].legs[i].end_location.lng()],
                            end: result.routes[0].legs[i].end_address,
                            distance: result.routes[0].legs[i].distance.text,
                            time: result.routes[0].legs[i].duration.text
                        })

                    }
                    setRoutes([...routes]);
                    console.log("rsult");
                    console.log(routes);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );

    }

const getLoc=(location)=>{
    const geocoder = new google.maps.Geocoder();
}
    const calculate2 = () => {
        for (let i = 0; i < routes.length; i++) {
        const directionsService = new google.maps.DirectionsService();
        const origin = { lat: routes[i].start_coordinates[0], lng: routes[i].start_coordinates[1] };
        const destination = { lat: routes[i].end_coordinates[0], lng: routes[i].end_coordinates[1] };
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.TRANSIT
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    for (let j = 0; j < result.routes[0].legs[0].steps.length; j++) {
                        const routeSegment = j + 1;
                        routesInstr.push({
                            number: routeSegment,
                            distance: result.routes[0].legs[0].steps[j].distance,
                            duration: result.routes[0].legs[0].steps[j].duration,
                            instructions: result.routes[0].legs[0].steps[j].instructions,
                        })

                    }
                    setRoutesInstr([...routesInstr]);
                    console.log(routesInstr);
                    //instr.push(instructions)
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
        }
        
    }


    const calculate3 = (e) => {
        const directionsService = new google.maps.DirectionsService();
        const origin = { lat: info[0].city.latitude, lng: info[0].city.longitude };
        const destination = { lat: info[0].city.latitude, lng: info[0].city.longitude };
        var waypts = [];
        info[0].places.forEach(place => {
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
                    for (let i = 0; i < result.routes[0].legs.length; i++) {
                        const routeSegment = i + 1;

                        routes.push({
                            number: routeSegment,
                            start: result.routes[0].legs[i].start_address,
                            start_coordinates: [result.routes[0].legs[i].start_location.lat(), result.routes[0].legs[i].start_location.lng()],
                            end_coordinates: [result.routes[0].legs[i].end_location.lat(), result.routes[0].legs[i].end_location.lng()],
                            end: result.routes[0].legs[i].end_address,
                            distance: result.routes[0].legs[i].distance.text,
                            time: result.routes[0].legs[i].duration.text
                        })

                    }
                    setRoutes([...routes]);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }

    const mySortingFunction = (a, b) => a.popularity.localeCompare(b.popularity);
    return <Layout title={name}>
        {info.map((cityItem) => (

            <div className="city-block" key="{cityItem.city}">
                <div>
                    <div className="places-div">
                        <div className="city-main-caption">
                            {name}
                        </div>
                        <div className="plan-description">
                            <h1 className="plan-h">Days: {info[0].days}</h1>
                            <h1 className="plan-h">Travelling by: {info[0].byCar === 1 ? "Public transport" : info[0].byCar === 2 ? "Car" : info[0].byCar === 3 ? "Bicycle" : "Motorcycle"}</h1>
                            <h1 className="plan-h">Your budget: {info[0].budget === "" ? "Not available" : `${info[0].budget} $`}</h1>
                            <h1 className="plan-h">Money to spend: </h1>
                            <h1 className="plan-h">Distance:{distance} </h1>
                            <h1 className="plan-h">Number of places: {info[0].places.length} </h1>
                        </div>

                        <div className="container-fluid ">
                            <div className=" col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 map-container">
                                <MapLoader className="fixed" data={[info[0].city, info[0].places, "WALKING"]}
                                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}`}
                                    loadingElement={<div style={{ height: `100%` }} />}
                                />
                            </div>
                            <div onClick={(e) => calculate(e)} className="new-plan">
                                <div className="btn filter-p filter-btn ">
                                    Show details
                            </div>
                            </div>
                            <div onClick={(e) => calculate2()} className="new-plan">
                                <div className="btn filter-p filter-btn ">
                                    Show details2
                            </div>
                            </div>
                            <div className="city-places-div col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7">
                                <div className="fixed-div">
                                    {routes.map((route) => (
                                        <div>
                                            <div className="plan-description fill-data">
                                                <h1 className="plan-h">Start: </h1>
                                                <h1 className="place-p">{route.start}</h1>
                                                <h1 className="plan-h">End: </h1>
                                                <h1 className="place-p">{route.end}</h1>
                                                <h1 className="plan-h">Time: </h1>
                                                <h1 className="place-p">{route.time}</h1>
                                                <h1 className="plan-h">Distance: </h1>
                                                <h1 className="place-p">{route.distance}</h1>
        
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))};
   </Layout>;

}
export default Plan;
export const getServerSideProps = async ({ params }) => {
    const name = params.id;
    return {
        props: {
            name
        },
    };
};

