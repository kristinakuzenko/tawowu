import Link from "next/link";
import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';

const orderBy = (countries) => {
  return countries.sort((a, b) => (a.name > b.name ? 1 : -1));
};

const CountriesTable = () => {
  const [countries, setCountries] = useState([]);
  fire.firestore()
    .collection('countries')
    .onSnapshot(snap => {
      const countries = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCountries(countries);
    });
  const [continentFilter, setContinentFilter] = useState(-1);

  const toggleFilter = (e, filterValue) => {
    e.preventDefault();
    if (continentFilter === filterValue) {
      setContinentFilter(-1);
      return;
    }
    setContinentFilter(filterValue);
  }

  const orderedCountries = orderBy(countries);

  return (
    <div className="block-two container-fluid">
      <div className="row continent-filter-row">
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 continent-filter">
          <p onClick={(e) => toggleFilter(e, -1)} className={continentFilter === -1 ? 'continent-filter-p active' : 'continent-filter-p'}  >&nbsp;&nbsp;World&nbsp;&nbsp; </p>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 continent-filter">
          <p onClick={(e) => toggleFilter(e, 1)} className={continentFilter === 1 ? 'continent-filter-p active' : 'continent-filter-p'}>&nbsp;Africa&nbsp;</p>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 continent-filter">
          <p onClick={(e) => toggleFilter(e, 2)} className={continentFilter === 2 ? 'continent-filter-p active' : 'continent-filter-p'} >&nbsp;Europe&nbsp;</p>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 continent-filter">
          <p onClick={(e) => toggleFilter(e, 3)} className={continentFilter === 3 ? 'continent-filter-p active' : 'continent-filter-p'} >&nbsp;Oceania&nbsp;</p>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 continent-filter">
          <p onClick={(e) => toggleFilter(e, 4)} className={continentFilter === 4 ? 'continent-filter-p active' : 'continent-filter-p'} >&nbsp;Caribbean&nbsp;</p>
        </div>
        <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 continent-filter">
          <p onClick={(e) => toggleFilter(e, 8)} className={continentFilter === 8 ? 'continent-filter-p active' : 'continent-filter-p'} >&nbsp;Asia&nbsp;</p>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 continent-filter">
          <p onClick={(e) => toggleFilter(e, 6)} className={continentFilter === 6 ? 'continent-filter-p active' : 'continent-filter-p'} >&nbsp;North America&nbsp;</p>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 continent-filter">
          <p onClick={(e) => toggleFilter(e, 7)} className={continentFilter === 7 ? 'continent-filter-p active' : 'continent-filter-p'} >&nbsp;South America&nbsp;</p>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 continent-filter">
          <p onClick={(e) => toggleFilter(e, 5)} className={continentFilter === 5 ? 'continent-filter-p active' : 'continent-filter-p'} >&nbsp;Central America&nbsp;</p>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 continent-filter">
          <p onClick={(e) => toggleFilter(e, 9)} className={continentFilter === 9 ? 'continent-filter-p active' : 'continent-filter-p'} >&nbsp;Middle East&nbsp;</p>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 continent-filter">
          <p onClick={(e) => toggleFilter(e, 10)} className={continentFilter === 10 ? 'continent-filter-p active' : 'continent-filter-p'} >&nbsp;Southeastern Asia&nbsp;</p>
        </div>
      </div>

      <div className={-1 !== continentFilter ? 'row continent-row active' : ' row continent-row'} >
        <div className="continent col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <Link href={`/continent/Africa`} key="Africa">
            <div className="btn">
              <h1 className="continent-table">Africa</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "africa").map((countries) => (
              <div key={countries.name}>
                <Link href={`/country/${countries.name}`}>
                  <div className="btn country-table">{countries.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="continent col-xl-4 col-lg-6 col-md-6  col-sm-12 col-xs-12">
          <Link href={`/continent/Europe`} key="Europe">
            <div className="btn">
              <h1 className="continent-table">Europe</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "europe").map((countries) => (
              <div key={countries.name}>
                <Link href={`/country/${countries.name}`} >
                  <div className="btn country-table">{countries.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="continent col-xl-4 col-lg-6 col-md-6  col-sm-12 col-xs-12">
          <Link href={`/continent/Australia`} key="Australia">
            <div className="btn">
              <h1 className="continent-table">Oceania</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "oceania").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="continent col-xl-4 col-lg-6 col-md-6  col-sm-12 col-xs-12">
          <Link href={`/continent/Australia`} key="Australia">
            <div className="btn">
              <h1 className="continent-table">Caribbean</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "caribbean").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="continent col-xl-4 col-lg-6 col-md-6  col-sm-12 col-xs-12">
          <Link href={`/continent/Australia`} key="Australia">
            <div className="btn">
              <h1 className="continent-table">Central America</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "central america").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="continent col-xl-4 col-lg-6 col-md-6  col-sm-12 col-xs-12">
          <Link href={`/continent/North America`} key="North America">
            <div className="btn">
              <h1 className="continent-table">North America</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "north america").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="continent col-xl-4 col-lg-6 col-md-6  col-sm-12 col-xs-12">
          <Link href={`/continent/South America`} key="South America">
            <div className="btn">
              <h1 className="continent-table">South America</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "south america").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="continent col-xl-4 col-lg-6 col-md-6  col-sm-12 col-xs-12">
          <Link href={`/continent/Asia`} key="Asia">
            <div className="btn">
              <h1 className="continent-table">Asia</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "asia").map((countries) => (

              <Link href={`/country/${countries.name}`} key={countries.name}>

                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="continent col-xl-4 col-lg-6 col-md-6  col-sm-12 col-xs-12">
          <Link href={`/continent/South America`} key="South America">
            <div className="btn">
              <h1 className="continent-table">Middle East</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "middle east").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="continent col-xl-4 col-lg-6 col-md-6  col-sm-12 col-xs-12">
          <Link href={`/continent/South America`} key="South America">
            <div className="btn">
              <h1 className="continent-table">Southeastern Asia</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "southeastern asia").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
      <div className="row continent-row">
        <div className={1 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/Africa`} key="Africa">
            <div className="btn">
              <h1 className="continent-table">Africa</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "africa").map((countries) => (
              <div key={countries.name}>
                <Link href={`/country/${countries.name}`}>
                  <div className="btn country-table">{countries.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className={2 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/Europe`} key="Europe">
            <div className="btn">
              <h1 className="continent-table">Europe</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "europe").map((countries) => (
              <div key={countries.name}>
                <Link href={`/country/${countries.name}`} >
                  <div className="btn country-table">{countries.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className={3 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/Australia`} key="Australia">
            <div className="btn">
              <h1 className="continent-table">Oceania</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "oceania").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className={4 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/Australia`} key="Australia">
            <div className="btn">
              <h1 className="continent-table">Caribbean</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "caribbean").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className={8 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/Asia`} key="Asia">
            <div className="btn">
              <h1 className="continent-table">Asia</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "asia").map((countries) => (

              <Link href={`/country/${countries.name}`} key={countries.name}>

                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className={6 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/North America`} key="North America">
            <div className="btn">
              <h1 className="continent-table">North America</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "north america").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className={7 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/South America`} key="South America">
            <div className="btn">
              <h1 className="continent-table">South America</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "south america").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className={5 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/Australia`} key="Australia">
            <div className="btn">
              <h1 className="continent-table">Central America</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "central america").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className={9 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/South America`} key="South America">
            <div className="btn">
              <h1 className="continent-table">Middle East</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "middle east").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className={10 !== continentFilter ? 'continent active' : ' continent'}>
          <Link href={`/continent/South America`} key="South America">
            <div className="btn">
              <h1 className="continent-table">Southeastern Asia</h1>
            </div>
          </Link>
          <div>
            {countries.filter((country) => country.region.toLowerCase() == "southeastern asia").map((countries) => (
              <Link href={`/country/${countries.name}`} key={countries.name}>
                <div className="btn country-table">{countries.name}</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>

  );
};


export default CountriesTable;
