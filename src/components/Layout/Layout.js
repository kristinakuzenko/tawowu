import Head from "next/head";
import Link from "next/link";
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styles from './layout.module.css';
import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';


const orderBy = (countries) => {
  return countries.sort((a, b) => (a.name > b.name ? 1 : -1));
};
const Layout = ({ children, title = "Tawowu" }) => {
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
  const [continents, setContinents] = useState([]);
  fire.firestore()
    .collection('continents')
    .onSnapshot(snap => {
      const continents = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContinents(continents);
    });

  const orderedCountries = orderBy(countries);
  return (
    <div className="layout-main">
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
                  {continents.map((continent) => (
                    <Link href={`/continent/${continent.name} `} key={continent.name}>
                      <p className="btn modal-item">{continent.name}</p>
                    </Link>
                  ))}

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
                {continents.map((continent) => (
                  <li className="nav-item dropdown" key={continent.name}>
                    <Link href={`/continent/${continent.name} `} key={continent.name}>
                      <a className="nav-link " data-toggle="dropdown"> {continent.name} </a>
                    </Link>
                    <ul className="dropdown-menu">
                      {countries.filter((country) => country.continent.toLowerCase() == continent.name.toLowerCase()).map((countries) => (
                        <Link href={`/country/${countries.name}`} key={countries.name}>
                          <li><a className="dropdown-item btn"> {countries.name}</a></li>
                        </Link>
                      ))}

                    </ul>
                  </li>
                ))}

                <li className="nav-item">
                  <a className="nav-link" href="#">About </a>
                </li>

              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className={"main"}>{children}</main>

      <footer className="footer">
        Thank you for using Tawowu!
          </footer>

    </div>
  );
};

export default Layout;


