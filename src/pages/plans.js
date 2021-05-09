import React, { useState } from "react";
import Head from 'next/head';
import fire from '../config/fire-config';
import Layout from "../components/Layout/Layout";
import Link from "next/link";

const MyPlaces = () => {
    return <Layout title="Favorite places">
        <div className="country-page">
            <div className="country-page2">
                <div className="plans-page">
                    <img className="city-main-img" src="./../public/background.jpg" />
                    <div className="fav-city-main-caption">
                        Your trip plans
                    </div>
                    <Link href={`/new-plan`}>
                        <div className="new-plan">
                            <div className="btn filter-p filter-btn ">
                                Create new plan
                            </div>
                        </div>
                    </Link>
 
                    <div className="container-fluid">
                        <div className="myPlans-div" key="{city}">
                            <div className="row  plans-div">
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 plan-col">
                                    <div className=" one-plan">
                                        <img className="image-plan " src="{place.image}" />
                                        <div className="plan-header">
                                            Barcelona
                                    </div>
                                        <div className="">
                                            <h1>Places to visit: 20</h1>
                                            <h1>Days: 2</h1>
                                            <h1>Money to spend: 20$</h1>
                                            <div className="btn show-plan-p show-plan-btn ">
                                                Show
                                            </div>
                                        </div>
                                     
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>;
}
export default MyPlaces;

