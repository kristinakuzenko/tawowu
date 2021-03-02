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
      cities.city.toLowerCase().startsWith(keyword.toLowerCase()) 
  );

  const onInputChange = (e) => {
    e.preventDefault();

    setKeyword(e.target.value.toLowerCase());
  };

  return <Layout countries={countries} title={country}>
<div className="country-page">
      <div className="country-page2">
      {myCountry.map((countries) =>(
          
          <div className="country-h">
            <div>
            Discover {countries.name}
            </div>

</div>
      ))}
        <div className="before-input"> </div>
        <div className="input-div">
        <SearchInput
          placeholder="Search for city"
          onChange={onInputChange}
          />
        </div>
        <div className="before-input"> </div>
        <div className="btn">
        <span type="button" className="nav-link filter-cntry" href="#" data-toggle="modal" data-target="#exampleModal2">Filter</span>
    <div className="modal fade " id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
        
        <span className="btn close-btn modal-item" data-dismiss="modal">Close</span>
    </div>
  </div>
</div>
        </div>
          <div className="">

          <div className="container-fluid btn cities">
{filteredCities.map((cities) =>(

<Link href={`/city/${cities.city}`} key={cities.city}>

      <div className="city-descr col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4">
      <img className="city-icon" src={cities.icon}></img>
        <h1 className="country-city">{cities.city}</h1>
        <h1 className="country-desc">{cities.description}</h1>
        
      </div>

   </Link>
))}
   </div>
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
