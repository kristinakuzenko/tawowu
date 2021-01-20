import Link from "next/link";
import styles from "./CountriesTable.module.css";


const orderBy = (countries) => {
    return countries.sort((a, b) => (a.name> b.name ? 1 : -1));
};
const CountriesTable = ({ countries }) => {
  const europe = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("europe") 
  );
  const australia = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("australia") 
  );
  const africa = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("africa") 
  );
  const northamerica = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("north america") 
  );
  const southamerica = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("south america") 
  );
  const asia = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("asia") 
  );
  const orderedCountries=orderBy(countries);
  return (

    <div className="block-two container-fluid">
<div className="row ">
      <div className="continent col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <Link href={`/continent/Africa`} key="Africa">
        <div className="btn">
          <h1>Africa</h1>
          </div>
          </Link>
          <div>
        {africa.map((countries) =>(
          <div>
            <Link href={`/country/${countries.name}`} key={countries.name}>
              <div className="btn">{countries.name}</div>
          </Link>
          </div>
        ))}
          </div>
      </div>
      <div className="continent col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <Link href={`/continent/Asia`} key="Asia">
        <div className="btn">
          <h1>Asia</h1>
          </div>
          </Link>
          <div>
        {asia.map((countries) =>(
          
            <Link href={`/country/${countries.name}`} key={countries.name}>

              <div className="btn">{countries.name}</div>
          </Link>
        ))}
        </div>
      </div>
      <div className="continent col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <Link href={`/continent/Australia`} key="Australia">
        <div className="btn">
          <h1>Australia/Oceania</h1>
          </div>
          </Link>
          <div>
        {australia.map((countries) =>(
            <Link href={`/country/${countries.name}`} key={countries.name}>
              <div className="btn">{countries.name}</div>
          </Link>
        ))}
        </div>
      </div>
      <div className="continent col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <Link href={`/continent/Europe`} key="Europe">
        <div className="btn">
          <h1>Europe</h1>
          </div>
          </Link>
          <div>
        {europe.map((countries) =>(
          <div>
            <Link href={`/country/${countries.name}`} key={countries.name}>
              <div className="btn">{countries.name}</div>
          </Link>
          </div>
        ))}
        </div>
      </div>
      <div className="continent col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <Link href={`/continent/North America`} key="North America">
        <div className="btn">
          <h1>North America</h1>
          </div>
          </Link>
          <div>
        {northamerica.map((countries) =>(
            <Link href={`/country/${countries.name}`} key={countries.name}>
              <div className="btn">{countries.name}</div>
          </Link>
        ))}
        </div>
      </div>
      <div className="continent col-lg-4 col-md-4 col-sm-6 col-xs-12">
      <Link href={`/continent/South America`} key="South America">
        <div className="btn">
          <h1>South America</h1>
          </div>
          </Link>
          <div>
        {southamerica.map((countries) =>(
            <Link href={`/country/${countries.name}`} key={countries.name}>
              <div className="btn">{countries.name}</div>
          </Link>
        ))}
        </div>
      </div>
      </div>
    </div>
     );
};


export default CountriesTable;
