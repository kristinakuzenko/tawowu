// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import fire from '../config/fire-config';
import CreatePost from '../components/CreatePost/CreatePost';
const Home = () => {
  const [blogs, setBlogs] = useState([]);
  fire.firestore()
      .collection('blogs')
      .onSnapshot(snap => {
        const blogs = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogs);
      });
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {blogs.map(blog =>
          <li key={blog.id}>
            {blog.name}
          </li>
        )}
      </ul>
      <CreatePost />
    </div>
  )
}
export default Home;

/*import Head from "next/head";
import { useState } from "react";
import CountriesTable from "../components/CountriesTable/CountriesTable";
import Layout from "../components/Layout/Layout";
import MainPage from "../components/MainPage/MainPage";
import styles from "../styles/Home.module.css";
import admin from 'firebase-admin';
import serviceAccount from '../db/serviceAccountKey.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "YOUR_DB_URL"
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();*/
/*
export default function Home({ countries }) {
  const [keyword, setKeyword] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(keyword) ||
      country.region.toLowerCase().includes(keyword) ||
      country.subregion.toLowerCase().includes(keyword)
  );

  const onInputChange = (e) => {
    e.preventDefault();

    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <Layout countries={countries}>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const res = await fetch("https://kristinakuzenko.github.io/countries.json");
  const countries = await res.json();

  return {
    props: {
      countries,
    },
  };
};

*/