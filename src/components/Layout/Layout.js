import Head from "next/head";
import Link from "next/link";
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styles from './layout.module.css';


const orderBy = (countries) => {
  return countries.sort((a, b) => (a.name > b.name ? 1 : -1));
};
const Layout = ({ countries, children, title = "Tawowu" }) => {
  console.log(countries);
  const e = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("europe")
  );
  const europe = orderBy(e);
  const australia = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("australia")
  );
  const a = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("africa")
  );
  const africa = orderBy(a);
  const n = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("north america")
  );
  const northamerica = orderBy(n);
  const s = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("south america")
  );
  const southamerica = orderBy(s);
  const as = countries.filter(
    (country) =>
      country.continent.toLowerCase().includes("asia")
  );
  const asia = orderBy(as);
  const orderedCountries = orderBy(countries);
  return (
    <div className="layout-main">
      <Head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        />
        <title>{title}</title>

      </Head>
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
          <div className="">
            <span type="button" className="nav-link search" href="#" data-toggle="modal" data-target="#exampleModal"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> </span>
            <Link href={`/my-places`}>
              <span type="button" className="nav-link search" ><FontAwesomeIcon icon={faUser}></FontAwesomeIcon> </span>
            </Link>
            <div className="modal fade " id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <input className="input-search" type="text" placeholder=" Search for cities, countries, ..." ></input>
                  <Link href={`/continent/Africa`} key="Africa">
                    <p className="btn modal-item">Africa</p>
                  </Link>
                  <Link href={`/continent/Asia`} key="Asia">
                    <p className="btn modal-item">Asia</p>
                  </Link>
                  <Link href={`/continent/Australia`} key="Australia">
                    <p className="btn modal-item">Oceania</p>
                  </Link>
                  <Link href={`/continent/Europe`} key="Europe">
                    <p className="btn modal-item">Europe</p>
                  </Link>
                  <Link href={`/continent/North America`} key="North America">
                    <p className="btn modal-item">North America</p>
                  </Link>
                  <Link href={`/continent/South America`} key="South America">
                    <p className="btn modal-item">South America</p>
                  </Link>
                  <br></br>
                  <p className="btn modal-item">About</p>
                  <br></br>
                  <span className="btn close-btn modal-item" data-dismiss="modal">Close</span>
                </div>
              </div>
            </div>
            <Link href="/"><a className="navbar-brand logo" >t a w o w u <span className="sr-only">(current)</span></a></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse " id="navbarResponsive">
              <ul className="navbar-nav ">
                <li className="nav-item dropdown">
                  <Link href={`/continent/Africa`} key="Africa">
                    <a className="nav-link " data-toggle="dropdown"> Africa </a>
                  </Link>
                  <ul className="dropdown-menu">
                    {africa.map((countries) => (
                      <Link href={`/country/${countries.name}`} key={countries.name}>
                        <li><a className="dropdown-item btn"> {countries.name}</a></li>
                      </Link>
                    ))}
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link href={`/continent/Asia`} key="Asia">
                    <a className="nav-link " href="#" data-toggle="dropdown"> Asia </a>
                  </Link>
                  <ul className="dropdown-menu">
                    {asia.map((countries) => (
                      <Link href={`/country/${countries.name}`} key={countries.name}>
                        <li><a className="dropdown-item btn"> {countries.name}</a></li>
                      </Link>
                    ))}
                  </ul>
                </li>
          

                <li className="nav-item dropdown">
                  <Link href={`/continent/Europe`} key="Europe">
                    <a className="nav-link " href="#" data-toggle="dropdown"> Europe </a>
                  </Link>
                  <ul className="dropdown-menu">
                    {europe.map((countries) => (
                      <Link href={`/country/${countries.name}`} key={countries.name}>
                        <li><a className="dropdown-item btn"> {countries.name}</a></li>
                      </Link>
                    ))}
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link href={`/continent/North America`} key="North America">
                    <a className="nav-link " href="#" data-toggle="dropdown"> NorthAmerica </a>
                  </Link>
                  <ul className="dropdown-menu">
                    {northamerica.map((countries) => (
                      <Link href={`/country/${countries.name}`} key={countries.name}>
                        <li><a className="dropdown-item btn"> {countries.name}</a></li>
                      </Link>
                    ))}
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <Link href={`/continent/Australia`} key="Australia">
                    <a className="nav-link " href="#" data-toggle="dropdown"> Oceania </a>
                  </Link>
                  <ul className="dropdown-menu">
                    {australia.map((countries) => (
                      <Link href={`/country/${countries.name}`} key={countries.name}>
                        <li><a className="dropdown-item btn"> {countries.name}</a></li>
                      </Link>
                    ))}
                  </ul>
                </li>
                
                <li className="nav-item dropdown">
                  <Link href={`/continent/South America`} key="South America">
                    <a className="nav-link " href="#" data-toggle="dropdown"> SouthAmerica </a>
                  </Link>
                  <ul className="dropdown-menu">
                    {southamerica.map((countries) => (
                      <Link href={`/country/${countries.name}`} key={countries.name}>
                        <li><a className="dropdown-item btn"> {countries.name}</a></li>
                      </Link>
                    ))}
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">About </a>
                </li>

              </ul>
            </div>
          </div>
        </nav>
      </header>







      <main className={styles.main}>{children}</main>

      <footer className="footer">
        Thank you for using Tawowu!
          </footer>

    </div>
  );
};

export default Layout;


