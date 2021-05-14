
import Layout from "../../components/Layout/Layout";
import MapGoogle from "../../components/GoogleMap/GoogleMap";
import Autocomplete from "../../components/Autocomplete/Autocomplete";
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
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    DirectionsRenderer
} from "react-google-maps";

const MapLoader = withScriptjs(MapGoogle);
const Plan = ({ name }) => {

    let _isMounted = false;
    const [info, setInfo] = useState([]);
    const [route, setRoute] = useState([]);
    const [routePlace, setRoutePlace] = useState([]);
    const [start, setStart] = useState([]);
    const [routeTransport, setRouteTransport] = useState([]);
    React.useEffect(() => {

        Object.keys(localStorage).filter(key => key.indexOf(`plan-data-${name}`) !== -1).forEach((key) => {
            info.push(JSON.parse(localStorage.getItem(key)));
        });
        Object.keys(localStorage).filter(key => key.indexOf(`route-${name}`) !== -1).forEach((key) => {
            route.push(JSON.parse(localStorage.getItem(key)));
        });
        Object.keys(localStorage).filter(key => key.indexOf(`routes-transport-${name}`) !== -1).forEach((key) => {
            routeTransport.push(JSON.parse(localStorage.getItem(key)));
        });
        start.push(route[0][0]);
        route[0].shift();
        setInfo([...info]);
        setRoute([...route]);
        setRouteTransport([...routeTransport]);
        console.log(info);
        setStart(start);

        for (let i = 0; i < route[0].length; i++) {
            var start_place = {};
            info[0]?.places.forEach(p => {
                if (p.location === route[0][i].start_address) {
                    start_place = p;
                }
            })
            routePlace.push({ data: route[0][i], place: start_place })

        }

        setRoutePlace([...routePlace]);
    }, [])
    const postInitCallback=()=>{
        console.log("map ready");
    }
    /*
                                                            <MapLoader className="fixed" data={[info[0]?.city, info[0]?.places, "WALKING",name]}
                                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`}
                                        loadingElement={<div style={{ height: `100%` }} />}
                                    />
    */
    return <Layout title={name}>

            <div className="city-block" key={name}>
                <div>
                    <div className="places-div">
                        <div className="city-main-caption">
                            {name}
                        </div>
                        <div className="plan-description">
                            <h1 className="plan-h">Days: {info[0]?.days}</h1>
                            <h1 className="plan-h">Travelling by: {info[0]?.byCar}</h1>
                            <h1 className="plan-h">Your budget: {info[0]?.budget === "" ? "Not available" : `${info[0]?.budget} $`}</h1>
                            <h1 className="plan-h">Money to spend: </h1>
                            <h1 className="plan-h">Distance: </h1>
                            <h1 className="plan-h">Number of places: {info[0]?.places.length} </h1>
                            <h1 className="plan-h">Start point: start </h1>
                            <h1 className="plan-h">End point: end </h1>
                        </div>

                        <div className="container-fluid ">
                            <div className=" col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 map-container">

                            <MapLoader className="fixed" data={[info[0]?.city, info[0]?.places, "WALKING",name,postInitCallback]}
                                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`}
                                        loadingElement={<div style={{ height: `100%` }} />}
                                    />
                            </div>
                            <div className={info[0]?.byCar !== "Public transport / walking"? "city-places-div col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7":"none"}>
                                <div className="fixed-div">
                                    <div>
                                        <h1 className={info[0]?.byCar === "Car" || info[0]?.byCar === "Motorcycle" ? "place-h" : "none"}>Drive {start[0]?.distance.text} ({start[0]?.duration.text})</h1>
                                        <h1 className={info[0]?.byCar === "Bicycle" ? "place-h" : "none"}>Ride {start[0]?.distance.text} ({start[0]?.duration.text})</h1>
                                        <h1 className={info[0]?.byCar === "Only walking" ? "place-h" : "none"}>Walk {start[0]?.distance.text} ({start[0]?.duration.text})</h1>
                                        <h1 className={info[0]?.byCar === "Public transport / walking" ? "place-h" : "none"}>Walk {start[0]?.distance.text} ({start[0]?.duration.text})</h1>

                                    </div>

                                    {routePlace.map((route) => (
                                        <div>
                                            <div className="plan-description fill-data">
                                                <div className={route.place.type[0] !== 111 ? "one-place" : "none"} key={route.place.name}>
                                                    <h1 className="place-name"> {route.place.name} </h1>
                                                    <p className="place-desc">{route.place.description} </p>
                                                    <div className="container-fluid ">
                                                        <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                                            <img className="image-city " src={route.place.image} />
                                                        </div>
                                                        <div className={route.place.type[0] === 1 ? 'col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8' : 'none'} >
                                                            <h1 className="place-h">Price </h1>
                                                            <h1 className="place-p">{route.place.price}</h1>
                                                            <h1 className="place-h">Location</h1>
                                                            <h1 className="place-p">{route.place.location}</h1>
                                                            <h1 className="place-h">Transport</h1>
                                                            <h1 className="place-p">{route.place.transport}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                                <h1 className="plan-h">Time: </h1>
                                                <h1 className="place-p">{route.data.duration.text}</h1>
                                                <h1 className="plan-h">Distance: </h1>
                                                <h1 className="place-p">{route.data.distance.text}</h1>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={info[0]?.byCar === "Public transport / walking"? "city-places-div col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7":"none"}>
                                {routeTransport[0]?.map((routeTransport) => (
                                    <div>
                                        <div className="plan-description fill-data">
                                            <h1 className="plan-h">Start: </h1>
                                            <h1 className="place-p">{routeTransport.start}</h1>
                                            <h1 className="plan-h">End: </h1>
                                            <h1 className="place-p">{routeTransport.end}</h1>
                                            <h1 className="plan-h">Time: </h1>
                                            <h1 className="place-p">{routeTransport.time}</h1>
                                            <h1 className="plan-h">Distance: </h1>
                                            <h1 className="place-p">{routeTransport.distance}</h1>
                                            <h1 className="plan-h">Instructions: </h1>
                                            {routeTransport.instructions.map((instr) => (
                                                <h1 className="place-p">{instr}</h1>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

