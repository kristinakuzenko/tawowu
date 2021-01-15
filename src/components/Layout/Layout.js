import Head from "next/head";
import Link from "next/link";
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faSearch } from "@fortawesome/free-solid-svg-icons"; 
import styles from './layout.module.css'
const Layout=({children, title = "Tawowu"})=>{
  return(
    <div>
      <Head>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    />
         <title>{title}</title>
    
      </Head>
      <header className={styles.header}>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
    <div className="">
    <span type="button" className="nav-link search" href="#" data-toggle="modal" data-target="#exampleModal"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> </span>
    <div className="modal fade " id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
        <input className="input-search" type="text" placeholder=" Search for cities, countries, ..." ></input>
        <p className="btn">Africa</p>
        <p className="btn">America</p>
        <p className="btn">Asia</p>
        <p className="btn">Australia</p>
        <p className="btn">Europe</p>
        <p className="btn">Oceania</p>
        <br></br>
        <p className="btn">About</p>
        <br></br>
        <span className="btn close-btn" data-dismiss="modal">Close</span>
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
            <Link href="/posts/africa"><a className="nav-link " href="#" data-toggle="dropdown"> Africa </a></Link>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#"> Submenu item 1</a></li>
                      <li><a className="dropdown-item" href="#"> Submenu item 2 </a></li>
                    </ul>
              </li>
              <li className="nav-item dropdown">
                  <a className="nav-link " href="#" data-toggle="dropdown"> Asia </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#"> Submenu item 1</a></li>
                      <li><a className="dropdown-item" href="#"> Submenu item 2 </a></li>
                    </ul>
              </li>
              <li className="nav-item dropdown">
                  <a className="nav-link " href="#" data-toggle="dropdown"> Australia </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#"> Submenu item 1</a></li>
                      <li><a className="dropdown-item" href="#"> Submenu item 2 </a></li>
                    </ul>
              </li>
              <li className="nav-item dropdown">
                  <a className="nav-link " href="#" data-toggle="dropdown"> Europe </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#"> Austria</a></li>
                      <li><a className="dropdown-item" href="#"> Submenu item 2 </a></li>
                    </ul>
              </li>
              <li className="nav-item dropdown">
                  <a className="nav-link " href="#" data-toggle="dropdown"> NorthAmerica </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#"> Submenu item 1</a></li>
                      <li><a className="dropdown-item" href="#"> Submenu item 2 </a></li>
                    </ul>
              </li>
              <li className="nav-item dropdown">
                  <a className="nav-link " href="#" data-toggle="dropdown"> SouthAmerica </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#"> Submenu item 1</a></li>
                      <li><a className="dropdown-item" href="#"> Submenu item 2 </a></li>
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

      <footer>

      </footer>

    </div>
  );
};
export default Layout
