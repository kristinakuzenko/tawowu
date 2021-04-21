import React, { useState } from "react";
import Head from 'next/head';
import fire from '../config/fire-config';
import Layout from "../components/Layout/Layout";

const MyPlaces = () => {
  const favCities = [];
  const favPlaces = [];
  React.useEffect(() => {

    Object.keys(localStorage).filter(key => key.indexOf('tawowu-fav') !== -1).forEach((key) => {
      if (!favCities.includes(JSON.parse(localStorage.getItem(key)).city)) {
        favCities.push(JSON.parse(localStorage.getItem(key)).city);
      }
    });
    favCities.forEach(element => console.log(element));


    Object.keys(localStorage).filter(key => key.indexOf('tawowu-fav') !== -1).forEach((key) => {
      favPlaces.push(JSON.parse(localStorage.getItem(key)));
    });
    favPlaces.forEach(element => console.log(element));

    favoriteCities().map((city) => (
      console.log("c" + city)
    ));

    favoritePlaces().map((place) => (
      console.log("c" + place)
    ));
    console.log(favPlaces);
    console.log(favCities);
  }, [])
  const mySortingFunction = (a, b) => a.popularity.localeCompare(b.popularity);
  const favoriteCities = () => favCities.sort();
  const favoritePlaces = () => favPlaces.sort(mySortingFunction);


  return <Layout title="Favorite places">
    <div className="country-page">
      <div className="country-page2">
        {favCities.map((city) => (
          <div className="myPlaces-div" key={city}>
            <p>
              <button className="btn fav-city" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                {city}
              </button>
            </p>
            <div className="collapse" id="collapseExample">
              {favoritePlaces().map((place) => (
                <div className="one-place" key={place.name}>
                  <h1 className="place-name"> {place.name}</h1>
                  <p className="place-desc">{place.description} </p>
                  <div className="container-fluid ">
                    <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                      <img className="image-city " src={place.image} />
                    </div>

                    <div className="btn filter-p filter-btn " >
                      Remove
                  </div>

                    <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                      <h1 className="place-h">Price </h1>
                      <h1 className="place-p">{place.price}</h1>
                      <h1 className="place-h">Location</h1>
                      <h1 className="place-p">{place.location}</h1>
                      <h1 className="place-h">Transport</h1>
                      <h1 className="place-p">{place.transport}</h1>
                      <h1 className="place-h">Tips</h1>
                      <h1 className="place-p">{place.tips}</h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  </Layout>;
}
export default MyPlaces;

