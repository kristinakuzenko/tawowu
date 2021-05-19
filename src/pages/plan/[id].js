
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
const Plan = ({ name }) => {
    const [session, loading] = useSession();
    const [info, setInfo] = useState([]);
    const [routePlace, setRoutePlace] = useState([]);
    const [start, setStart] = useState([]);
    const [start2, setStart2] = useState([]);
    if(session&&info.length===0){
const r = JSON.parse(localStorage.getItem(`user-plans-${session.user.email}`));
  r.forEach(item=>{
      if(item.name===name){
          info.push(item);
      }
  })
  start.push(info[0].route[0][0]);
  if(info[0].route_transport[0]!==null ){
      start2.push({route:info[0].route[0][0],instructions: info[0].route_transport[0][0]});
      info[0].route_transport[0].shift();
  }
  info[0].route[0].shift();
 
  setInfo([...info]);
  setStart(start);
  setStart2(start2);

for (let i = 0; i < info[0].route[0].length; i++) {
  var start_place = {};
  info[0].places.forEach(p => {
      if (p.location === info[0].route[0][i].start_address) {
          start_place = p;
      }
  })
  if(info[0].route_transport[0]===null ){

  routePlace.push({ data: info[0].route[0][i], place: start_place })
  }else{
      routePlace.push({ data: info[0].route[0][i], place: start_place, instructions:info[0].route_transport[0][i] })
}

}

  setRoutePlace([...routePlace]);
    }

    /*
                                                            <MapLoader className="fixed" data={[info[0].city, info[0].places, "WALKING",name]}
                                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`}
                                        loadingElement={<div style={{ height: `100%` }} />}
                                    />
    */
    return <Layout title={name}>
        {info.map((cityItem) => (

            <div className="city-block" key={cityItem}>
                <div>
                    <div className="places-div">
                        <div className="city-main-caption">
                            {name}
                        </div>
                        <div className="plan-description">
                            <h1 className="plan-h">Days: {info[0].days}</h1>
                            <h1 className="plan-h">Travelling by: {info[0].byCar}</h1>
                            <h1 className="plan-h">Your budget: {info[0].budget === "" ? "Not available" : `${info[0].budget} $`}</h1>
                            <h1 className="plan-h">Money to spend: </h1>
                            <h1 className="plan-h">Distance: </h1>
                            <h1 className="plan-h">Number of places: {info[0].places.length} </h1>
                        </div>

                        <div className="container-fluid ">
                            <div className=" col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 map-container">


   
                            </div>
                            <div className={info[0].byCar !== "Public transport / walking"? "city-places-div col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7":"none"}>
                                <div className="fixed-div">
                                    <div className="plan-description fill-data">
                                    <h1 className="place-name"> <FontAwesomeIcon icon={faMapMarkedAlt}></FontAwesomeIcon> Start location:<br/><br/> {info[0].start}</h1>
                                    
                                    <div>
                                        <h1 className={info[0].byCar === "Car" || info[0].byCar === "Motorcycle" ? "place-h" : "none"}>Drive {start[0].distance.text} ({start[0].duration.text}) <br/><br/> to</h1>
                                        <h1 className={info[0].byCar === "Bicycle" ? "place-h" : "none"}>Ride {start[0].distance.text} ({start[0].duration.text})</h1>
                                        <h1 className={info[0].byCar === "Only walking" ? "place-h" : "none"}>Walk {start[0].distance.text} ({start[0].duration.text})</h1>
                                        <h1 className={info[0].byCar === "Public transport / walking" ? "place-h" : "none"}>Walk {start[0].distance.text} ({start[0].duration.text})</h1>

                                    </div>
                                    </div>
                                    

                                    {routePlace.map((route) => (
                                        <div key={route}>
                                            <div className="plan-description ">
                                                <div className="one-place">
                                                    <h1 className="place-name"> {route.place.name} </h1>
                                                    <p className="place-desc">{route.place.description} </p>
                                                    <div className="container-fluid ">
                                                        <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                                            <img className="image-city " src={route.place.image} />
                                                        </div>
                                                        <div className='col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8' >
                                                            <h1 className="place-h">Price </h1>
                                                            <h1 className="place-p">{route.place.price}</h1>
                                                            <h1 className="place-h">Location</h1>
                                                            <h1 className="place-p">{route.place.location}</h1>
                                                            <h1 className="place-h">Transport</h1>
                                                            <h1 className="place-p">{route.place.transport}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                                <h1 className={info[0].byCar === "Car" || info[0].byCar === "Motorcycle" ? "place-h" : "none"}>Drive {route.data.distance.text} ({route.data.duration.text}) <br/><br/> to</h1>
                                        <h1 className={info[0].byCar === "Bicycle" ? "place-h" : "none"}>Ride {route.data.distance.text} ({route.data.duration.text})</h1>
                                        <h1 className={info[0].byCar === "Only walking" ? "place-h" : "none"}>Walk {route.data.distance.text} ({route.data.duration.text})</h1>
                                        <h1 className={info[0].byCar === "Public transport / walking" ? "place-h" : "none"}>Walk {route.data.distance.text} ({route.data.duration.text})</h1>

                                               
                                            </div>
                                        </div>
                                    ))}
                                      <div className="plan-description end-location">
                                    <h1 className="place-name"><FontAwesomeIcon icon={faMapMarkedAlt}></FontAwesomeIcon> Your end location: <br/><br/>  {info[0].route[0][info[0].route[0].length-1].end_address}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className={info[0].byCar === "Public transport / walking"? "city-places-div col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7":"none"}>
                            <div className="plan-description fill-data">
                                    <h1 className="place-name"> <FontAwesomeIcon icon={faMapMarkedAlt}></FontAwesomeIcon> Start location: <br/><br/> {info[0].start===""?start[0].start_address:info[0].start} <br/><br/><br/></h1>
                                    {start2[0]!==undefined &&start2[0].instructions.instructions.map((instr) => (
                                                <h1 className="place-h">{instr}</h1>
                                            ))}
                                             <h1 className="plan-h "><br/>Total time: </h1>
                                    <h1 className= "place-p" >{start2[0]!==undefined &&start2[0].instructions.time}</h1>

                                    </div>
                                    
                                   

                                    {info[0].route_transport[0]!==null &&routePlace.map((route) => (
                                         <div className="fixed-div" key={route}>
                                        <div>
                                            <div className="plan-description ">
                                                <div className="one-place">
                                                    <h1 className="place-name"> {route.place.name} </h1>
                                                    <p className="place-desc">{route.place.description} </p>
                                                    <div className="container-fluid ">
                                                        <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                                                            <img className="image-city " src={route.place.image} />
                                                        </div>
                                                        <div className='col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8' >
                                                            <h1 className="place-h">Price </h1>
                                                            <h1 className="place-p">{route.place.price}</h1>
                                                            <h1 className="place-h">Location</h1>
                                                            <h1 className="place-p">{route.place.location}</h1>
                                                            <h1 className="place-h">Transport</h1>
                                                            <h1 className="place-p">{route.place.transport}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                                {route.instructions.instructions.map((instr) => (
                                                <h1 className="place-h">{instr}</h1>
                                            ))}
                                                <h1 className="plan-h"><br/>Total time: </h1>
                                            <h1 className="place-p">{route.instructions.time}</h1>
          
                                            </div>
                                        </div>
                                        </div>
                                    ))}
                                           <div className="plan-description end-location">
                                    <h1 className="place-name"><FontAwesomeIcon icon={faMapMarkedAlt}></FontAwesomeIcon> Your end location: <br/><br/> {info[0].route[0][info[0].route[0].length-1].end_address}</h1>
                                    </div>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
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

