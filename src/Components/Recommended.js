import React, { useEffect, useState } from 'react'
import { Audio } from 'react-loader-spinner';
import { Link, json } from 'react-router-dom';
import axios from 'axios';
import { updateFavsFromFireBase, updateRecommendationFromFireBase } from '../firebase';
import { updateFavsToFireBase } from '../firebase';
import { movie } from './GetMovies';

export default function Recommended() {

    let [recommendedMovies,setRecommendation] = useState([])
    let [FavouritesArray,setFavouritesArray] = useState(JSON.parse(localStorage.getItem("Favourites")))

    async function fetchMovieData(){
        updateRecommendationFromFireBase()
        let rmMovies = []
        if( (localStorage.getItem("recommendedMovies") == "undefined") || (localStorage.getItem("recommendedMovies") == undefined) )
            rmMovies = []
        else
            rmMovies = JSON.parse(localStorage.getItem("recommendedMovies"))
        let movieObjList = []
        for(let i = 0; i < rmMovies.length; i++)
        {
            let resp = await axios.get(`https://api.themoviedb.org/3/movie/${rmMovies[i]}?language=en-US&api_key=d2d5c04da9b8133f121a383dc3cb2d2a`)
            let data = resp.data
            let tobj = { ...data }
            movieObjList.push(tobj)
        }
        setRecommendation(movieObjList)
    }

    useEffect(()=>{fetchMovieData()},[]) // whenever you want to use an async function in useEffect, call it using arrow function bcz async function returns a promise which will give you destory is not fucntion upon unmounting(leaving) this component

    const addToFav = (movieID) => {
        let fv = localStorage.getItem("Favourites")
        let fvArr = []
        if (fv == undefined) {
            fvArr = [String(movieID)]
            fv = JSON.stringify(fvArr)
            localStorage.setItem("Favourites", fv)
        }
        else {
            fvArr = JSON.parse(fv)
            fvArr.push(String(movieID))
            fv = JSON.stringify(fvArr)
            localStorage.setItem("Favourites", fv)
        }
        updateFavsToFireBase()
        setFavouritesArray([...fvArr])
    }

    const rmvFromFav = (movieID) => {
        let fv = localStorage.getItem("Favourites")
        let fvArr = JSON.parse(fv)
        movieID = String(movieID)
        let ind = 0;
        while ((ind < fvArr.length) && (fvArr[ind] != movieID)) {
            ind += 1;
        }
        fvArr.splice(ind, 1)
        fv = JSON.stringify(fvArr)
        localStorage.setItem("Favourites", fv)
        updateFavsToFireBase()
        setFavouritesArray([...fvArr])
    }

    const sendRecommendationRequest = ()=>{
        let btn = document.getElementById('recommendButton')
        btn.disabled = true
        btn.innerHTML = '<div className="spinner-border" role="status" />'
        let data = JSON.stringify({
            "email": `${localStorage.getItem('email')}`
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://mre-xk2c7lhiqq-uc.a.run.app',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            btn.innerText = 'recommendations computed'
          })
          .catch((error) => {
            console.log(error);
          });
          
          
        btn.innerText = "It may take 10 to 15 minutes for recommendations to be computed"

    }

    return (
        <>

                <h1 style={{ color: "white" }}></h1>
                 <div class="d-grid gap-2 d-md-block">
                     <button class="btn btn-warning" id='recommendButton'  type="button" onClick={sendRecommendationRequest} >Refresh Recommendation</button>
                 </div>
                {
                    (recommendedMovies.length == 0) ?
                        <div className="text-primary" role="status" style={{marginLeft:"35vw",marginTop:"20vh"}}>
                            <h2 style={{color:"white"}}> No Recommendations found !!</h2>
                        </div> :
                        <div>
                            <h1 style={{ color: "white" }}>Movie recommendation based on your Favourites list </h1>
                            <div className="movieList" >
                                {
                                    recommendedMovies.map((movieObj) => (
                                        <div className='full-card' key={movieObj.id}>
                                            <Link to={`/moviepage/${movieObj.id}`} >
                                                <div className="card mb-3 movie-card" style={{ maxWidth: "617px", backgroundColor: "black" }}>
                                                    <div className="row g-0" style={{ backgroundColor: "black" }}>
                                                        <div className="col-md-4" style={{ backgroundColor: "black" }}>
                                                            <img src={`https://image.tmdb.org/t/p/original${movieObj.poster_path}`} className="img-fluid rounded-start" alt="..." />
                                                        </div>

                                                        <div className="col-md-8">
                                                            <div className="card-body">
                                                                <h5 className="card-title">{movieObj.original_title}</h5>
                                                                <p className="card-text">{movieObj.overview}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="d-grid gap-2">
                                                {
                                                    (FavouritesArray.includes(String(movieObj.id))) ?
                                                        <button className="btn btn-outline-danger rmv-from-fav" type="button" onClick={() => rmvFromFav(movieObj.id)} >Remove From Favourites</button>
                                                        :
                                                        <button className="btn btn-outline-danger add-to-fav" type="button" onClick={() => addToFav(movieObj.id)}>Add To Favourites</button>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                }
        </>
    )
}



        // (recomIDs == undefined) ?
        //     <>
        //         <center style={{ color: "white" }}>
        //             <h1>Our recommendation engine is trying to find movies you may like</h1>
        //             <h2>It may take 10 to 20 minutes</h2>
        //             <div style={{ marginLeft: "45vw", marginTop: "10vh" }}>
        //                 <Audio height="80" width="80" radius="10" color="blue" ariaLabel="loading" wrapperStyle wrapperClass />
        //             </div>
        //         </center>
        //     </>
        //     :
        //     <>
 
                
        //     </>
