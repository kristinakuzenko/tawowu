import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import Head from 'next/head'
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above



function MyApp({Component,pageProps}) {
  return (
      <>
          <Head>
          <head>
<link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
</head>
              <link 
                  rel="stylesheet" 
                  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
                  crossorigin="anonymous"
                  />
              <script 
                  src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
                  crossorigin="anonymous"
                  />
              <script 
                  src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
                  crossorigin="anonymous"
                  />
          </Head>
          <Component {...pageProps}/>
      </>
  );
}

export default MyApp;
