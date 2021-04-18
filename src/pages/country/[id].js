import Layout from "../../components/Layout/Layout";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import SearchInput from "../../components/SearchInput/SearchInput";
//database import
import fire from '../../config/fire-config';
import React, { useState } from "react";

const Country = ({ country }) => {
  let _isMounted = false;
  React.useEffect(() => {
    _isMounted = true;

    fire.firestore()
        .collection('cities')
        .onSnapshot(snap => {
          const cities = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          _isMounted && setCities(cities);
        });

    return function cleanup() {
      _isMounted = false;
    }
  }, [])

  const [cities, setCities] = useState([]);
  const [keyword, setKeyword] = useState("");

  // Pick the country from the list by its name

  // Here we filter out the cities that don't belong to current country
  const countryCities = cities.filter((city) => city.country.toLowerCase() === country.toLowerCase());

  // Here we filter out the cities that don't match the keyword selected
  // If there is no keyword selected we simply return the countryCities array as it is
  const filteredCities = () => {
    const needle = keyword ? keyword.toLowerCase() : '';
    return countryCities.filter((city) => city.city.toLowerCase().indexOf(needle) !== -1);
  };

  // Let's track the input change event and set keyword
  // Once keyword is set -- it will effect the filteredCities() above
  const onInputChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };
  if (countryCities.length == 0) {
    return <Layout title={country}>
      <div className="country-page">
        <div className="country-page2">
          <div className="country-h2" key="{country.name}">
            <br /> Ooops... <br /> <br />No cities for {country} yet
            </div>
          <p className="country-desc"> Contact us and we will add <br /> some cities as soon as possible! <br /><br />  <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></p>
          <div className="contact-div">
            <p className="contact-btn">Click to contact us</p>
          </div>

        </div>
      </div>
    </Layout>;
  } else {
    return <Layout title={country}>
      <div className="country-page">
        <div className="country-page2">
          <div className="country-h">
            <div>
              Discover {country}
            </div>
          </div>
          <div>
            <SearchInput
              placeholder="Search for city"
              onChange={onInputChange}
            />
          </div>
          <div className="container-fluid cities">

            <div className="row">
              {filteredCities().map((city) => (

                <Link href={`/city/${city.city}`} key={city.city}>
                  <div className="city-descr col-6 col-sm-6 col-md-6 col-lg-6 col-xl-4" key={city.city}>
                    <img className="city-icon" src={city.icon} />

                    <h1 className="country-city">{city.city}</h1>
                    <p className="country-desc">{city.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>;
  }

}
export default Country;

export const getServerSideProps = async ({ params }) => {
  const country = params.id;
  return {
    props: {
      country
    },
  };
};
