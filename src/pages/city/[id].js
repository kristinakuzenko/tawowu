import Layout from "../../components/Layout/Layout";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import {  faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons"; 
const orderBy = (countries) => {
  return countries.sort((a, b) => (a.name> b.name ? 1 : -1));
};
/*

const SortArrow = ({ direction }) => {
  if (!direction) {
    return (
      <img className="small-icon "  src="../art.png" ></img>
    );
  }
  else {
    return (
      <img className="small-icon "  src="../park.png" ></img>
    );
  } 
};
*/
const City=({city,cities,countries,places})=>{
  const myCity = cities.filter(
    (city1) =>
    city1.city.includes(city) 
  );
  const myPlaces = places.filter(
    (places) =>
    places.city.includes(city) 
  );
  const sightseeing = myPlaces.filter(
    (places) =>
    places.type.includes(1) 
  );
  const food = myPlaces.filter(
    (places) =>
    places.type.includes(2) 
  );
  const shopping = myPlaces.filter(
    (places) =>
    places.type.includes(3) 
  );
  const transport = myPlaces.filter(
    (places) =>
    places.type.includes(4) 
  );


  return <Layout countries={countries} title={city}>

{myCity.map((cities) =>(
  <div className="city-block">
    <img className="city-main-img" src={cities.image}  ></img>
    <div className=" city-main-caption carousel-caption d-none d-md-block">
        <div className="main-header">
        {cities.city}
        </div>
    </div>
    <div className="city-filter container-fluid ">
    
      <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item "> 
      <p className="filter-name">Sightseeing</p>
      </div>
      <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item "> 
      <p className="filter-name">Food</p>
      </div>
      <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item "> 
      <p className="filter-name">Shopping</p>
      </div>
      <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2 filter-item "> 
      <p className="filter-name">Transportation</p>
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
<h1 className="sightseeing-h">Things to do in {city}</h1>
      </div>

      <div className="places-div">
        
      <div className="container-fluid ">
        <div className="icon-container" >
        <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  " > 
        <img className="small-icon "  src="../art.png" ></img>
    </div>

      <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  "> 
      <img className="small-icon "  src="../camera.png" ></img>
      </div>
      <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  "> 
      <img className="small-icon "  src="../park.png" ></img>
      </div>
      <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  "> 
      <img className="small-icon "  src="../museum.png" ></img>
      </div>
      <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  "> 
      <img className="small-icon "  src="../view.png" ></img>
      </div>
      <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  "> 
      <p className="filter-p">Filter</p>
      </div>
      </div>
      </div>
      {sightseeing.map((places) =>(
      <div className="one-place">
        <h1 className="place-name"> {places.name} </h1> 
        <p className="place-desc">{places.description} </p>
        <div className="container-fluid ">
        <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
      <img className="image-city "  src={places.image} ></img>
      </div>
     
      <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
        <h1 className="place-h">Price </h1>
        <h1 className="place-p">{places.price}</h1>
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
            <h1 className="sightseeing-h">Food, restaurants, markets ...</h1>
            
      </div>
      <div className="places-div">
      <div className="container-fluid ">
        <div className="icon-container" >
      <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  "> 
      <img className="small-icon "  src="../take-away.png" ></img>
      </div>
      <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  "> 
      <img className="small-icon "  src="../market.png" ></img>
      </div>
      <div className="btn icon-div col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2  "> 
      <img className="small-icon "  src="../cocktail.png" ></img>
      </div>
      <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  "> 
      <img className="small-icon "  src="../restaurant.png" ></img>
      </div>
      <div className="btn icon-div col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2  "> 
      <img className="small-icon "  src="../cupcake.png" ></img>
      </div>
      <div className="btn filter-btn icon-div col-6 col-sm-6 col-md-12 col-lg-2 col-xl-2  "> 
      <p className="filter-p">Filter</p>
      </div>
      </div>
      </div>
      {food.map((places) =>(
      <div className="one-place">
        <h1> {places.name} </h1> 
        <p>{places.description} </p>
        <div className="container-fluid ">
        <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
      <img className="image-city "  src={places.image} ></img>
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
      {shopping.map((places) =>(
      <div className="one-place">
        <h1> {places.name} </h1> 
        <p>{places.description} </p>
        <div className="container-fluid ">
        <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
      <img className="image-city "  src={places.image} ></img>
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
      {transport.map((places) =>(
      <div className="one-place">
        <h1> {places.name} </h1> 
        <p>{places.description} </p>
        <div className="container-fluid ">
        <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
      <img className="image-city "  src={places.image} ></img>
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
export const getServerSideProps = async({params})=>{
    const city = params.id;
    const res = await fetch("https://kristinakuzenko.github.io/cities.json");
    const cities = await res.json();
    const res2 = await fetch("https://kristinakuzenko.github.io/countries.json");
    const countries = await res2.json();
    const res3 = await fetch("https://kristinakuzenko.github.io/places.json");
    const places = await res3.json();
    return{
        props:{
          city,
          countries,
          cities,
          places
        },
    };
  };
