import Head from "next/head";
import React from 'react';
import CountriesTable from "../components/CountriesTable/CountriesTable";
import SearchInput from "../components/SearchInput/SearchInput";
import Layout from "../components/Layout/Layout";
import MainPage from "../components/MainPage/MainPage";
import MapChart from "../components/MapChart/MapChart";
//import Map from "../components/Map/Map";
import ReactTooltip from "react-tooltip";
import styles from "../styles/Home.module.css";

//database import
import fire from '../config/fire-config';
import { useState } from "react";


export default  function Home() {


const [content, setContent] = useState("");
  return (
    <Layout>
<MainPage></MainPage>
<div className="map">
      <MapChart setTooltipContent={setContent} />
      <ReactTooltip  place='right' className="tooltip">{content}</ReactTooltip>
      </div>
      <CountriesTable />
    </Layout>
  );
}


