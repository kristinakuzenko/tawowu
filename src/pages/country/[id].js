import Layout from "../../components/Layout/Layout";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import SearchInput from "../../components/SearchInput/SearchInput";
const Country=({country,countries, cities})=>{
  const myCountry = countries.filter(
    (country1) =>
      country1.name.includes(country) 
  );
  const myCities = cities.filter(
    (cities) =>
    cities.country.includes(country) 
  );
  const [keyword, setKeyword] = useState("");

  const filteredCities = myCities.filter(
    (cities) =>
      cities.city.toLowerCase().includes(keyword) 
  );

  const onInputChange = (e) => {
    e.preventDefault();

    setKeyword(e.target.value.toLowerCase());
  };

  return <Layout countries={countries} title={country}>
<div className="country-page">


        {myCountry.map((countries) =>(
          
            <div className="country">
                    <div className="">
  <div id="myCarousel" className="carousel slide" data-ride="carousel">
    <ol className="carousel-indicators">
      <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
      <li data-target="#myCarousel" data-slide-to="1"></li>
      <li data-target="#myCarousel" data-slide-to="2"></li>
    </ol>

    <div className="carousel-inner">
      <div className="item active">
        <img className="w-100 carousel-img" src={countries.images[0]} ></img>
        <div className="carousel-caption  carousel-caption-center d-none d-md-block">
        <div className="main-header">
          <div>
          <span>Welcome </span>
          <span>to </span>
          <span>{countries.name} </span>
          </div>
       
          <h2><button type="button" className="btn discover">Discover cities</button></h2>
  
          </div>
  </div>
      </div>

      <div className="item">
        <img className="w-100 carousel-img" src={countries.images[1]}  ></img>
        <div className="carousel-caption carousel-caption-center d-none d-md-block">
        <div className="main-header">
          <div>
          <span>Welcome </span>
          <span>to </span>
          <span>{countries.name} </span>
          </div>
       
          <h2><button type="button" className="btn discover">Discover ultimate {countries.name} guide</button></h2>
  
          </div>
  </div>
      </div>
    
      <div className="item">
        <img className="w-100 carousel-img" src={countries.images[2]}  ></img>
        <div className="carousel-caption carousel-caption-center d-none d-md-block">
        <div className="main-header">
          <div>
          <span>Welcome </span>
          <span>to </span>
          <span>{countries.name} </span>
          </div>
       
          <h2><button type="button" className="btn discover">Discover latest news and updates</button></h2>
  
          </div>
  </div>
      </div>
    </div>

    <a className="left carousel-control" href="#myCarousel" data-slide="prev">
      <span className="glyphicon glyphicon-chevron-left"></span>
      <span className="sr-only">Previous</span>
    </a>
    <a className="right carousel-control" href="#myCarousel" data-slide="next">
      <span className="glyphicon glyphicon-chevron-right"></span>
      <span className="sr-only">Next</span>
    </a>
  </div>
</div>
</div>
        ))}
      <div className="country-page2">
        <div className="before-input"> </div>
        <div className="input-div">
        <SearchInput
          placeholder="Search for city"
          onChange={onInputChange}
          />
        </div>
        <div className="before-input"> </div>
        <div className="btn">
        <span type="button" className="nav-link search" href="#" data-toggle="modal" data-target="#exampleModal2">Filter</span>
    <div className="modal fade " id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
        
        <span className="btn close-btn modal-item" data-dismiss="modal">Close</span>
    </div>
  </div>
</div>
        </div>
          <div className="">


{filteredCities.map((cities) =>(

<Link href={`/city/${cities.city}`} key={cities.city}>
<div className="container-fluid btn">
      <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <img className="image-city "  src={cities.image} ></img>
      </div>
     
      <div className="city-descr col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
        <h1>{cities.city}</h1>
        <p>{cities.description}</p>
      </div>
   </div>
   </Link>
))}
 </div>
      </div>
                 
        
</div>
  </Layout>;
}
export default Country;

export const getServerSideProps = async({params})=>{
  const country = params.id;
  const res = await fetch("https://kristinakuzenko.github.io/cities.json");
  const cities = await res.json();
  const res2 = await fetch("https://kristinakuzenko.github.io/countries.json");
  const countries = await res2.json();
  return{
      props:{
        country,
        cities,
        countries
      },
  };
};
