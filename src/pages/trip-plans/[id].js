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
  const [routes, setRoutes] = useState([]);
  const [cities, setCities] = useState([]);

  React.useEffect(() => {
    _isMounted = true;
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
  const currentCity = cities.filter(cityItem => cityItem.city.toLowerCase() === city.toLowerCase());
  const cityRoutes = () => routes.filter(route => route.city.toLowerCase() === city.toLowerCase());

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
              {cityRoutes().map((route) => (
                <div className="myPlans-div" key="{city}">
                  <div className="row plans-div">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 plan-col">
                      <div className="one-plan">
                        <div className="place-name">
                          {route.name}
                        </div>
                        <div className="">
                          <h1 className="place-h">Money to spend: {route.money}</h1>
                          <h1 className="place-h">Days: {route.days}</h1>
                          <h1 className="place-h">Travel type: {route.type}</h1>
                          <h1 className="place-h">Places to visit: {route.places}</h1>

                          <Link href={`/default-plan/${route.name}`}>
                            <div className="btn show-plan-p show-plan-btn ">
                              Show
                            </div>
                          </Link>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
