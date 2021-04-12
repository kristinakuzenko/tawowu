// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import fire from '../config/fire-config';
import Layout from "../components/Layout/Layout";

export default function Home() {
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
  return (
    <Layout countries={countries}>
    </Layout>
  );
}


