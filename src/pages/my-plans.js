import React, { useState } from "react";
import Head from 'next/head';
import fire from '../config/fire-config';
import Layout from "../components/Layout/Layout";
import Link from "next/link";
import { signin, signout, useSession } from 'next-auth/client';

const MyPlan = () => {
    let _isMounted = false;
    const [session, loading] = useSession();
    const [routes, setRoutes] = useState([]);
    if(session&&routes.length===0){
        const r=JSON.parse(localStorage.getItem(`user-plans-${session.user.email}`))
    //console.log(r);
    r.forEach(item=>{
        routes.push(item);
    })
         setRoutes([...routes]);
     }
 
    
    return <Layout title="Favorite places">
        <div className="country-page">
            <div className="country-page2">
                <div className="plans-page">
                    <img className="city-main-img" src="./../public/background.jpg" />
                    <div className="fav-city-main-caption">
                        Your trip plans
                    </div>
 
                    <div className="container-fluid">
                        <div className="myPlans-div">
                            <div className="row  plans-div">
                            {routes.map((route) => (
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 plan-col">
                                    <div className=" one-plan">
                                        <div className="one-place">
                                            <h1 className="place-name">{route.name}</h1>
                                    </div>
                                        <div className="">
                                            <h1 className="place-h">City: {route.city.city}</h1>
                                            <h1 className="place-h">Travel type: <br/>{route.byCar}</h1>
                                            <h1 className="place-h">Number of places: {route.places.length}</h1>
                                            <h1 className="place-h">Money to spend: {route.price}</h1>
                                             <Link href={`/plan/${route.name}`} key={route.name}>
                                            <div className="btn show-plan-p show-plan-btn ">
                                                Show
                                            </div>
                                            </Link>
                                        </div>
                                     
                                    </div>
                                </div>
                                 ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>;
}
export default MyPlan;

