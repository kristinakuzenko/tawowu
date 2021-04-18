import Layout from "../../components/Layout/Layout";
import Link from "next/link";
//database import
import fire from '../../config/fire-config';
import React, { useState } from "react";

const orderBy = (countries) => {
  return countries.sort((a, b) => (a.name > b.name ? 1 : -1));
};
const Continent = ({ continent }) => {
  let _isMounted = false;
  React.useEffect(() => {
    _isMounted = true;

    fire.firestore()
        .collection('countries')
        .onSnapshot(snap => {
          const countries = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          _isMounted && setCountries(countries);
        });

    fire.firestore()
        .collection('continents')
        .onSnapshot(snap => {
          const continents = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          _isMounted && setContinents(continents);
        });

    return function cleanup() {
      _isMounted = false;
    }
  }, [])

  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState([]);
  const myCountry = countries.filter(
    (country1) =>
      country1.continent.includes(continent)
  );
  const myContinent = continents.filter(
    (country1) =>
      country1.name.includes(continent)
  );
  const orderedCountries = orderBy(myCountry);

  return <Layout title={continent}>

    <div className="continent2">

      {myContinent.map((continents) => (
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
      {orderedCountries.map((countries) => (
        <Link href={`/country/${countries.name}`} key={countries.name}>
          <div className="city-descr col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4">
            <img src={countries.icon} />
            <h1 className="country-city">{countries.name}</h1>
          </div>
        </Link>

      ))}


    </div>

  </Layout>;

}
export default Continent;
export const getServerSideProps = async ({ params }) => {
  const continent = params.id;
  return {
    props: {
      continent
    },
  };
};
