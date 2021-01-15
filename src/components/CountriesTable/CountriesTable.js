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
    <div className="block-two">
      <div className="continent">
      <Link href={`/continent/Africa`} key="Africa">
        <div className="btn">
          <h1>Africa</h1>
          </div>
          </Link>
        {africa.map((countries) =>(
            <Link href={`/country/${countries.name}`} key={countries.name}>
              <div className="btn">{countries.name}</div>
          </Link>
        ))}
      </div>
      <div className="continent">
        <h1>Asia</h1>
        {asia.map((countries) =>(
            <Link href={`/country/${countries.name}`} key={countries.name}>
            <div className={styles.row}>
              <div className={styles.name}>{countries.name}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="continent">
        <h1>Australia / Oceania</h1>
        {australia.map((countries) =>(
            <Link href={`/country/${countries.name}`} key={countries.name}>
            <div className={styles.row}>
              <div className={styles.name}>{countries.name}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="continent">
        <h1>Europe</h1>
        {europe.map((countries) =>(
            <Link href={`/country/${countries.name}`} key={countries.name}>
            <div className={styles.row}>
              <div className={styles.name}>{countries.name}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="continent">
        <h1>North America</h1>
        {northamerica.map((countries) =>(
            <Link href={`/country/${countries.name}`} key={countries.name,countries.continent}>
            <div className={styles.row}>
              <div className={styles.name}>{countries.name}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="continent">
        <h1>South America</h1>
        {southamerica.map((countries) =>(
            <Link href={`/country/${countries.name}`} key={countries.name}>
            <div className={styles.row}>
              <div className={styles.name}>{countries.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
     );
};


export default CountriesTable;
