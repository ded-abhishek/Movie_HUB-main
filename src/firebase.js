// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider,signInWithPopup} from "firebase/auth"
import {getFirestore,setDoc,doc, getDoc} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAi5S3ecQ_yyC-EkGK4ID6yfDNxuAw1uyM",
//   authDomain: "moviehub-38cc2.firebaseapp.com",
//   projectId: "moviehub-38cc2",
//   storageBucket: "moviehub-38cc2.appspot.com",
//   messagingSenderId: "320027665466",
//   appId: "1:320027665466:web:d9d5cdb4cd787483448103"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDCVhVVG2-UlMkzD8Gtw1ki325UpJipwv0",
//   authDomain: "movie-hub-f7c9c.firebaseapp.com",
//   projectId: "movie-hub-f7c9c",
//   storageBucket: "movie-hub-f7c9c.appspot.com",
//   messagingSenderId: "728786825825",
//   appId: "1:728786825825:web:c2ebd48e8015bd8144b020"
// };
// Import the functions you need from the SDKs you need

const firebaseConfig = {
  apiKey: "AIzaSyBkUuEsmhfhZfwjM7e61z_Fezktq-aqhlE",
  authDomain: "movie-hub-aa4c6.firebaseapp.com",
  projectId: "movie-hub-aa4c6",
  storageBucket: "movie-hub-aa4c6.appspot.com",
  messagingSenderId: "50884378373",
  appId: "1:50884378373:web:dba4fc712c5230bad1816c",
  measurementId: "G-SRFYPCCNCG"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()
      
const db = getFirestore()

export const signInWithGoogle = async ()=>{
    let result = await signInWithPopup(auth,provider)
    let userName = result.user.displayName
    let email = result.user.email
    let photoLink = result.user.photoURL
    localStorage.setItem("UserName",userName)
    localStorage.setItem("email",email)
    localStorage.setItem("photoLink",photoLink)

    // authorization done !

    const docRef = doc(db,"users",`${email}`)
    let docSnap = await getDoc(docRef)
    //localStorage.setItem("temp",JSON.stringify(docSnap.data()))
    if(docSnap.data() == undefined) // a new user, so store shell data for this user first
    {
      const payload = {Favourites : JSON.stringify([]) }
      await setDoc(docRef,payload)
      docSnap = await getDoc(docRef)
    }
    localStorage.setItem("Favourites",docSnap.data()["Favourites"])
    localStorage.setItem("recommendedMovies",docSnap.data()['Recommended'])
    window.location.reload()
}

 export const signOutWithGoogle = async () =>{
  let email = localStorage.getItem("email")
  localStorage.removeItem("UserName")
  localStorage.removeItem("email")
  localStorage.removeItem("photoLink")
  const docRef = doc(db,"users",`${email}`)
  const payload = {Favourites : localStorage.getItem("Favourites"), Recommended : localStorage.getItem("recommendedMovies") }
  await setDoc(docRef,payload)
  localStorage.removeItem("Favourites")
  localStorage.removeItem("recommendedMovies")
  window.location.reload()
}

export const updateFavsToFireBase = async ()=>{
  let email = localStorage.getItem("email")
  const docRef = doc(db,"users",`${email}`)
  const payload = {Favourites : localStorage.getItem("Favourites"), Recommended : localStorage.getItem("recommendedMovies") }
  await setDoc(docRef,payload)
}

export const updateFavsFromFireBase = async ()=>{
  let email = localStorage.getItem("email")
  const docRef = doc(db,"users",`${email}`)
  let docSnap = await getDoc(docRef)
  let fvstr = docSnap.data()['Favourites']
  localStorage.setItem("Favourites",fvstr)
}

export const updateRecommendationFromFireBase = async ()=>{
  let email = localStorage.getItem("email")
  const docRef = doc(db,"users",`${email}`)
  let docSnap = await getDoc(docRef)
  let fvstr = docSnap.data()['Recommended']
  localStorage.setItem("recommendedMovies",fvstr)
}




