import Layout from "../../components/Layout/Layout";
import {useState} from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapMarkedAlt} from "@fortawesome/free-solid-svg-icons";


const City = ({city, cities, countries, places}) => {

  const [placeType, setPlaceType] = useState(-1);
  const [placeFilter, setPlaceFilter] = useState(-1);

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
  const cityPlacesByFilter = [
    // art
    [...cityPlaces().filter(place => place.filter.indexOf(1) !== -1)],
    // camera
    [...cityPlaces().filter(place => place.filter.indexOf(2) !== -1)],
    // park
    [...cityPlaces().filter(place => place.filter.indexOf(3) !== -1)],
    // museum
    [...cityPlaces().filter(place => place.filter.indexOf(4) !== -1)],
    //viewpoint
    [...cityPlaces().filter(place => place.filter.indexOf(5) !== -1)],
    //
  ]

  // [[1,2], [3,4]].flat() => [1,2,3,4]

  // console.log('placesByType', cityPlacesByType);

  const cityPlacesFilteredByActiveType = () => {
    if (placeType === -1) {
      return [].concat(...cityPlacesByType);
    }
    return cityPlacesByType[placeType - 1];
  }

  const cityPlacesFilteredByActiveFilter = () => {
    if (placeFilter === -1) {
      return [].concat(...cityPlacesByFilter);
    }
    return cityPlacesByFilter[placeFilter - 1];
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

  const toggleFilterFilter = (e, filterValue) => {
    e.preventDefault();
    if (placeFilter === filterValue) {
      setPlaceFilter(-1);
      return;
    }
    setPlaceFilter(filterValue);
  }

  const mySortingFunction = (a, b) => a.popularity.localeCompare(b.popularity);

  return <Layout countries={countries} title={city}>
    {currentCity.map((cityItem) => (
      <div className="city-block" key={cityItem.city}>
        <img className="city-main-img" src={cityItem.image}/>
          <div className="city-main-caption">
            {cityItem.city}
        </div>
        <div className="city-filter container-fluid ">

          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" >Sightseeing</p>
          </div>
          <a href="#food">
          <div  className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name">Food</p>
         
          </div>
          </a>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" >Shopping</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name" >Transportation</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name">Activities</p>
          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item ">
            <p className="filter-name">Trip plans</p>
          </div>

        </div>

        <div>
          <div className="sightseeing-h">Things to do in {cityItem.city}</div>

          <div className="places-div">

            <div className="container-fluid ">
              <div className="icon-container">
                
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Art" src="../art.png" onClick={(e) => toggleFilterFilter(e, 1)}/>
                </div>

                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Insta places" src="../camera.png" onClick={(e) => toggleFilterFilter(e, 2)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Parks / outdoors" src="../park.png" onClick={(e) => toggleFilterFilter(e, 3)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Museums" src="../museum.png" onClick={(e) => toggleFilterFilter(e, 4)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Viewpoints" src="../view.png" onClick={(e) => toggleFilterFilter(e, 5)}/>
                </div>
                <div data-toggle="modal" data-target="#filterModal" className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
                <div className="modal fade " id="filterModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <h1 className="modal-f">Filter by categories</h1>
                      <p className="btn modal-item"  onClick={(e) => toggleFilterFilter(e, 1)}>Art</p>
                      <p className="btn modal-item"  onClick={(e) => toggleFilterFilter(e, 2)}>Insta places</p>
                      <span className="btn close-btn modal-item" data-dismiss="modal">Close</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            {cityPlacesFilteredByActiveFilter().filter(place => place.type.indexOf(1) !== -1).sort(mySortingFunction).map((place) => (
                <div className="one-place">
                  <h1 className="place-name"> {place.name} </h1>
                  <p className="place-desc">{place.description} </p>
                  <div className="container-fluid ">
                    <div className="image-city-div col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                      <img className="image-city " src={place.image} />
                    </div>
                      <div className="btn filter-p filter-btn ">
                        Show more
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
          <div id="food" className="sightseeing-h">Food in {city}
          </div>
          <div className="places-div">
            <div className="container-fluid ">
              <div className="icon-container">
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Take-away" src="../take-away.png" onClick={(e) => toggleFilterFilter(e, 1)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Coffee shops" src="../tea.png" onClick={(e) => toggleFilterFilter(e, 2)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Bars" src="../cocktail.png" onClick={(e) => toggleFilterFilter(e, 3)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Restaurants / cafes" src="../restaurant.png" onClick={(e) => toggleFilterFilter(e, 4)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Confectionery" src="../cupcake.png" onClick={(e) => toggleFilterFilter(e, 5)}/>
                </div>
                <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
              </div>
            </div>
            {cityPlacesFilteredByActiveFilter().filter(place => place.type.indexOf(2) !== -1).sort(mySortingFunction).map((place) => (
                <div className="one-place">
                  <h1 className="place-name"> {place.name} </h1>
                  <p className="place-desc">{place.description} </p>
                  <div className="container-fluid ">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                      <img className="image-city " src={place.image} />
                    </div>

                    <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                      <h1 className="place-h">Average bill price</h1>
                      <h1 className="place-p">{place.price}</h1>
                      <h1 className="place-h">Location</h1>
                      <h1 className="place-p">{place.location}</h1>
                      <h1 className="place-h">Transport</h1>
                      <h1 className="place-p">{place.transport}</h1>
                      <h1 className="place-h">Our favorites / recommendations</h1>
                      <h1 className="place-p">{place.tips}</h1>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          <div className="sightseeing-h">Shopping in {city}
          </div>
          <div className="places-div">
          <div className="container-fluid ">
              <div className="icon-container">
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Markets" src="../market.png" onClick={(e) => toggleFilterFilter(e, 1)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon "data-toggle="tooltip" data-placement="bottom" title="Shopping malls / streets" src="../clothes.png" onClick={(e) => toggleFilterFilter(e, 2)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Supermarkets" src="../supermarket.png" onClick={(e) => toggleFilterFilter(e, 3)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Souvenir shops" src="../souvenir.png" onClick={(e) => toggleFilterFilter(e, 4)}/>
                </div>
                <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  ">
                  <img className="small-icon " data-toggle="tooltip" data-placement="bottom" title="Outlet" src="../outlet.png" onClick={(e) => toggleFilterFilter(e, 5)}/>
                </div>
                <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  ">
                  <p className="filter-p">Filter</p>
                </div>
              </div>
            </div>
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
          <div className="sightseeing-h">Transport in {city}
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
