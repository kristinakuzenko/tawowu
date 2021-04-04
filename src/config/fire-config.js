import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyB9HV3-vkWsbR8Jjfjp2TEl0OJaU6OPyF0",
  authDomain: "tawowu-data-83295.firebaseapp.com",
  projectId: "tawowu-data-83295",
  storageBucket: "tawowu-data-83295.appspot.com",
  messagingSenderId: "36026786045",
  appId: "1:36026786045:web:7a3d22503e10076fe6de94"
};
try {
  firebase.initializeApp(firebaseConfig);
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}
const fire = firebase;
export default fire;