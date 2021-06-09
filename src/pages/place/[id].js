
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

        return function cleanup() {
            _isMounted = false;
        }
    }, [])
    const currentPlace = places.filter(place => place.name.toLowerCase() === name.toLowerCase());

    return <Layout title={name}>

        {currentPlace.map((place) => (
            <div className="city-block" key={place}>
                <div>
                    <div className="places-div">
                    <div className="city-main-caption info-place">
                        {place.name}
                    </div>
                    <div className="container-fluid info-place ">
                        <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 ">
                        <img className="place-image" src={place.image} />
                        </div>
                        <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 place-page">
                        <h1 className="place-h">Location</h1>
                        <h1 className="place-p">{place.location}</h1>
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

