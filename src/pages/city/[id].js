import Layout from "../../components/Layout/Layout";
import {useState} from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapMarkedAlt} from "@fortawesome/free-solid-svg-icons";


const City = ({city, cities, countries, places}) => {

  const [placeType, setPlaceType] = useState(-1);
  const [placeFilter, setPlaceFilter] = useState("");

  const currentCity = cities.filter(cityItem => cityItem.city.toLowerCase() === city.toLowerCase());

  // console.log('currentCity', currentCity);

  const cityPlaces = () => places.filter(place => place.city.toLowerCase() === city.toLowerCase());

  // console.log('cityPlaces', cityPlaces());

  const cityPlacesByType = [
    // sightseeing
    [...cityPlaces().filter(place => place.type.indexOf(1) !== -1)],
    // food
    [...cityPlaces().filter(place => place.type.indexOf(2) !== -1)],
    // shopping
    [...cityPlaces().filter(place => place.type.indexOf(3) !== -1)],
    // transport
    [...cityPlaces().filter(place => place.type.indexOf(4) !== -1)]
  ]

  // console.log('placesByType', cityPlacesByType);

  const cityPlacesFilteredByActiveType = () => {
    if (placeType === -1) {
      return cityPlacesByType.flat();
    }
    return cityPlacesByType[placeType - 1];
  }

  // console.log('cityPlacesFilteredByActiveType', cityPlacesFilteredByActiveType());

  const toggleTypeFilter = (e, filterValue) => {
    e.preventDefault();
    if (placeType === filterValue) {
      setPlaceType(-1);
      return;
    }
    setPlaceType(filterValue);
  }

  return <Layout countries={countries} title={city}>
    {currentCity.map((cityItem) => (
      <div className="city-block" key={cityItem.city}>
        <img className="city-main-img" src={cityItem.image}/>
        <div className=" city-main-caption carousel-caption d-none d-md-block">
          <div className="main-header">
            {cityItem.city}
          </div>
        </div>
        <div className="city-filter container-fluid ">

          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" onClick={(e) => toggleTypeFilter(e, 1)}>Sightseeing</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" onClick={(e) => toggleTypeFilter(e, 2)}>Food</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" onClick={(e) => toggleTypeFilter(e, 3)}>Shopping</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" onClick={(e) => toggleTypeFilter(e, 4)}>Transportation</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name">Activities</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name">Trip plans</p>
          </div>

        </div>

        <div>
          <div className="sightseeing-div">
            <h1 className="sightseeing-h">Things to do in {cityItem.city}</h1>
          </div>

          <div className="places-div">

            <div className="container-fluid ">
              <div className="icon-container">
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../art.png" />
                </div>

                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../camera.png"/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../park.png"/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../museum.png"/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../view.png"/>
                </div>
                <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
              </div>
            </div>
            {cityPlacesFilteredByActiveType().map((place) => (
                <div className="one-place">
                  <h1 className="place-name"> {place.name} </h1>
                  <p className="place-desc">{place.description} </p>
                  <div className="container-fluid ">
                    <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                      <img className="image-city " src={place.image} />
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
          <div className="sightseeing-div">
            <h1 className="sightseeing-h">Food, restaurants, markets ...</h1>

          </div>
          <div className="places-div">
            <div className="container-fluid ">
              <div className="icon-container">
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../take-away.png" />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../market.png" />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../cocktail.png" />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../restaurant.png" />
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " src="../cupcake.png" />
                </div>
                <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
              </div>
            </div>
            {cityPlacesByType[1].map((places) => (
                <div className="one-place">
                  <h1> {places.name} </h1>
                  <p>{places.description} </p>
                  <div className="container-fluid ">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                      <img className="image-city " src={places.image} />
                    </div>

                    <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                      <h1 className="place-h">Average bill price</h1>
                      <h1 className="place-p">{places.price}</h1>
                      <h1 className="place-h">Location</h1>
                      <h1 className="place-p">{places.location}</h1>
                      <h1 className="place-h">Transport</h1>
                      <h1 className="place-p">{places.transport}</h1>
                      <h1 className="place-h">Our favorites / recommendations</h1>
                      <h1 className="place-p">{places.tips}</h1>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          <div className="sightseeing-div">
            <h1 className="sightseeing-h">Shopping in {city}</h1>

          </div>
          <div className="places-div">
            {cityPlacesByType[2].map((places) => (
                <div className="one-place">
                  <h1> {places.name} </h1>
                  <p>{places.description} </p>
                  <div className="container-fluid ">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                      <img className="image-city " src={places.image} />
                    </div>

                    <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                      <h1 className="place-h">Location</h1>
                      <h1 className="place-p">{places.location}</h1>
                      <h1 className="place-h">Transport</h1>
                      <h1 className="place-p">{places.transport}</h1>
                      <h1 className="place-h">Tips</h1>
                      <h1 className="place-p">{places.tips}</h1>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          <div className="sightseeing-div">
            <h1 className="sightseeing-h">Transport in {city}</h1>

          </div>
          <div className="places-div">
            {cityPlacesByType[3].map((places) => (
                <div className="one-place">
                  <h1> {places.name} </h1>
                  <p>{places.description} </p>
                  <div className="container-fluid ">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                      <img className="image-city " src={places.image} />
                    </div>

                    <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                      <h1 className="place-p">{places.price}</h1>
                    </div>
                  </div>
                </div>
            ))}
          </div>

        </div>

      </div>
    ))}

  </Layout>;

}
export default City;
export const getServerSideProps = async ({params}) => {
  const city = params.id;
  const res = await fetch("https://kristinakuzenko.github.io/cities.json");
  const cities = await res.json();
  const res2 = await fetch("https://kristinakuzenko.github.io/countries.json");
  const countries = await res2.json();
  const res3 = await fetch("https://kristinakuzenko.github.io/places.json");
  const places = await res3.json();
  return {
    props: {
      city,
      countries,
      cities,
      places
    },
  };
};
