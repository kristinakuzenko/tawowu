import Layout from "../../components/Layout/Layout";
import Link from "next/link";
const orderBy = (countries) => {
  return countries.sort((a, b) => (a.name> b.name ? 1 : -1));
};
const Continent=({continent, continents, countries})=>{
  const myCountry = countries.filter(
    (country1) =>
      country1.continent.includes(continent) 
  );
  const myContinent = continents.filter(
    (country1) =>
      country1.name.includes(continent) 
  );
  const orderedCountries=orderBy(myCountry);
  return <Layout countries={countries} title={continent}>


<div className="continent2">

{myContinent.map((continents) =>(
            <div >   
        <div className="main-header2">
          <div>
          <span>Welcome </span>
          <span>to </span>
          <span> {continents.name}</span>
          </div>
       
          <h2><button type="button" className="btn discover2">Choose the country</button></h2>
  
          </div>
          <div className="contour">
          <img className="" src={continents.contour} ></img>
            </div>

            </div>
        ))}
      
</div>
<div className="countries container-fluid btn">
        {orderedCountries.map((countries) =>(
           <Link href={`/country/${countries.name}`} key={countries.name}>
      <div className="city-descr col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4">
      <img src={countries.icon}/>
        <h1 className="country-city">{countries.name}</h1>
      </div>
           </Link>
          
        ))}


</div>

  </Layout>;

}
export default Continent;
export const getServerSideProps = async({params})=>{
    const continent = params.id;
    const res = await fetch("https://kristinakuzenko.github.io/continents.json");
    const continents = await res.json();
    const res2 = await fetch("https://kristinakuzenko.github.io/countries.json");
    const countries = await res2.json();
    return{
        props:{
          continent,
          continents,
          countries
        },
    };
  };
