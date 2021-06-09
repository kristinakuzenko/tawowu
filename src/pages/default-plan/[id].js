
import Layout from "../../components/Layout/Layout";
import MapGoogle from "../../components/GoogleMap/GoogleMap";
import Autocomplete from "../../components/Autocomplete/Autocomplete";
import key from "../../components/GoogleApiKey/GoogleApiKey";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
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
import { signin, signout, useSession } from 'next-auth/client';

const MapLoader = withScriptjs(MapGoogle);
const DefaultPlan = ({ name }) => {
    let _isMounted = false;
    const [routes, setRoutes] = useState([]);
    const [cities, setCities] = useState([]);
    const [places, setPlaces] = useState([]);
    React.useEffect(() => {

        _isMounted = true;

        fire.firestore()
            .collection('places')
            .onSnapshot(snap => {
                const places = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                _isMounted && setPlaces(places);
            });

        fire.firestore()
            .collection('routes')
            .onSnapshot(snap => {
                const routes = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                _isMounted && setRoutes(routes);
            });

        fire.firestore()
            .collection('cities')
            .onSnapshot(snap => {
                const cities = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                _isMounted && setCities(cities);
            });
        return function cleanup() {
            _isMounted = false;
        }
    }, [])
    const currentRoute = routes.filter(route => route.name.toLowerCase() === name.toLowerCase());
    const currentCity = cities.filter(cityItem => cityItem.city.toLowerCase() === currentRoute[0].city.toLowerCase());

    const Map = dynamic(() => import("../../components/Map/Map"), {
        loading: () => "Loading...",
        ssr: false
    });
    return <Layout title={name}>

        {currentRoute.map((route) => (
            <div className="city-block" key={route}>

                <div>
                    <img className="plan-main-img" src={route.photo} />
                    <div className="fav-city-main-caption">
                        {name}
                    </div>

                    <div className="places-div">
                        <div className="container-fluid ">
                        <div className="route-tips border-plan">
                            <h1 className="place-h">{route.tips} </h1>
                        </div>
                        <div className="container-fluid detail-plan">
                        <div className="box col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                            <h1 className="place-h">{route.money} </h1>
                        </div>
                        <div className="box col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                            <h1 className="place-h">{route.days} days </h1>
                        </div>
                        <div className="box col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                            <h1 className="place-h">{route.places} places</h1>
                        </div>
                        <div className="box col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                            <h1 className="place-h">{route.type} </h1>
                        </div>
                        </div>
                            <div className="route ">
                                {route.plan.map((place) => (
                                    <div>
                                        {places.filter(current => current.name.toLowerCase() === place.place.toLowerCase()).map((item) => (
                                            <div className="plan-one-place plan-top">
                                                <h1 className="place-name"> {item.name} </h1>
                                                <p className="place-desc">{item.description} </p>
                                                <div className="container-fluid ">
                                                    <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                                        <img className="image-city-plan " src={item.image} />
                                                    </div>
                                                    <h1 className="place-h">Price </h1>
                                                    <h1 className="place-p">{item.price}</h1>
                                                    <h1 className="place-h">Location</h1>
                                                    <h1 className="place-p">{item.location}</h1>
                                                    <h1 className="place-details">Click for more details </h1>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="plan-one-place">
                                            <h1 className="place-h">{place.description} </h1>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </Layout>;

}
export default DefaultPlan;
export const getServerSideProps = async ({ params }) => {
    const name = params.id;
    return {
        props: {
            name
        },
    };
};

