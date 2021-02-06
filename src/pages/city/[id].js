import Layout from "../../components/Layout/Layout";
import Link from "next/link";
const orderBy = (countries) => {
  return countries.sort((a, b) => (a.name> b.name ? 1 : -1));
};
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
      <p className="filter-name">Recommendations</p>
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
      {sightseeing.map((places) =>(
      <div className="one-place">
        <h1> {places.name} </h1> 
        <p>{places.description} </p>
        <div className="container-fluid ">
        <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
      <img className="image-city "  src={places.image} ></img>
      </div>
     
      <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
        <h1>Price: {places.price}</h1>
        <h1>Location: {places.location}</h1>
        <h1>Transport: {places.transport}</h1>
        <h1>Tips: {places.tips}</h1>
      </div>
      </div>
      </div>
      ))} 
      </div>
           <div className="sightseeing-div">
            <h1 className="sightseeing-h">Food, restaurants, markets ...</h1>
            
      </div>
      <div className="places-div">
      {food.map((places) =>(
      <div className="one-place">
        <h1> {places.name} </h1> 
        <p>{places.description} </p>
        <div className="container-fluid ">
        <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
      <img className="image-city "  src={places.image} ></img>
      </div>
     
      <div className=" col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
        <h1>Average bill price: {places.price}</h1>
        <h1>Location: {places.location}</h1>
        <h1>Transport: {places.transport}</h1>
        <h1>Our favorites / recommendations: {places.tips}</h1>
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
        <h1>Location: {places.location}</h1>
        <h1>Transport: {places.transport}</h1>
        <h1>Tips:  {places.tips}</h1>
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
<h1> {places.price}</h1>
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
