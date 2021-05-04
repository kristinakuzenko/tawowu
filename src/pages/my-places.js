import React, { useState } from "react";
import Head from 'next/head';
import fire from '../config/fire-config';
import Layout from "../components/Layout/Layout";

const MyPlaces = () => {
  const [favCities, setFavCities] = useState([]);
  const [favPlaces, setFavPlaces] = useState([]);

  React.useEffect(() => {

    Object.keys(localStorage).filter(key => key.indexOf('tawowu-fav') !== -1).forEach((key) => {
      if (!favCities.includes(JSON.parse(localStorage.getItem(key)).city)) {
        favCities.push(JSON.parse(localStorage.getItem(key)).city);
      }
    });

    Object.keys(localStorage).filter(key => key.indexOf('tawowu-fav') !== -1).forEach((key) => {
      favPlaces.push(JSON.parse(localStorage.getItem(key)));
    });

    setFavCities([...favCities]);
    setFavPlaces([...favPlaces]);

  }, []);

  const mySortingFunction = (a, b) => a.popularity.localeCompare(b.popularity);
  const favoriteCities = () => favCities.sort();
  const favoritePlaces = () => favPlaces.sort(mySortingFunction);

  const removeFromFavorites = (e, value, place) => {
    e.preventDefault();
    localStorage.removeItem(`tawowu-fav-${value}`);
    const index = favCities.indexOf(place);
favCities.splice(index,1);
setFavCities([...favCities]);
  }
  const [activeCity, setActiveCity] = useState("");

  const toggleActiveCity = (e, city) => {
    e.preventDefault();

    setActiveCity(city);
  }

  return <Layout title="Favorite places">
    <div className="country-page">
      <div className="country-page2">
        <img className="city-main-img" src="{cityItem.image}" />
        <div className="fav-city-main-caption">
          All your favorites
        </div>
        <div className={favoriteCities().length!==-1 ? 'container-fluid':'none'}>
          {favoriteCities().map((city) => (
            <div className="myPlaces-div" key={city}>
              <div className="row">
                <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3  fav-city-h" onClick={(e) => toggleActiveCity(e,city)}>
                  <p className="fav-city-p" >{city}</p>
                </div>
                <div className={city===activeCity ?'col-6 col-sm-6 col-md-8 col-lg-9 col-xl-9':'none'}>
                  {favoritePlaces().map((place) => (
                    <div className="one-place" key={place.name}>
                      <h1 className="place-name"> {place.name}</h1>
                      <p className="place-desc">{place.description} </p>
                      <div className="container-fluid ">
                        <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                          <img className="image-city " src={place.image} />
                        </div>

                        <div className="btn filter-p filter-btn " onClick={(e) => removeFromFavorites(e, place.name, place)}>
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
            </div>
          ))}
        </div>
        <div className={favoriteCities().length===-1 ? 'none':''}>
          <h1 className="no-fav-city">
          Oooops... You have no favorite places!
          </h1>
           
        </div>
      </div>
    </div>
  </Layout>;
}
export default MyPlaces;

