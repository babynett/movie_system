"use client";
//child component for movie list
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Heart } from "phosphor-react";
import { number } from "framer-motion";

const API_BASE_URL = "https://api.themoviedb.org/3";

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  // add other properties if needed
};

const Movies = () => {
  // create an error message if the data in the api is being called
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState<number[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      // console.log("env:", process.env);
      setIsLoading(true);
      setErrorMessage("");

      if (!API_KEY) {
        console.error("API key is missing");
        setErrorMessage("API key is missing");
        return;
      }

      const API_OPTIONS = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      };
      try {
        //first call the endpoint
        const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        //if there is an endpoint, try to call it by using a response var
        const response = await fetch(endpoint, API_OPTIONS);
        const data = await response.json();

        if (data.response === "False") {
          setErrorMessage(data.Error || "Failed to fetch movies");
          setMovieList([]);
          return;
        }
        setMovieList(data.results.slice(0, 12));
        return;

        // console.log("Fetched movies:", data);
      } catch (error) {
        console.error(`Heh error: ${error}`);
        setErrorMessage("Error fetching movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const toggleRating = (movieId: number) => {
    setIsFavorite((prev) => {
      return prev.includes(movieId)
        ? prev.filter((id) => id !== movieId) // remove if already favorited
        : [...prev, movieId]; // add if not
    });
  };

  useEffect(() => {
    console.log("Favorites updated:", isFavorite);
  }, [isFavorite]);

  const changeStatus = (movieId: number) => {
    return isFavorite.find((id) => movieId == id) ? true : false;
  };

  return (
    <>
      <section className="mb-6 p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
        {isLoading ? <p>Loading...</p> : <p>{errorMessage}</p>}
        <Card className=" p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
          <h1 className="font-semibold">Most Popular Movies</h1>
        </Card>
        <div className="flex justify-center md:p-10">
          <div className="grid grid-cols-4 gap-5">
            {movieList.map((movie) => (
              <Card
                key={movie.id}
                className="flex flex-col justify-between p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300 h-full"
              >
                <div>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto rounded mb-4"
                  />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {movie.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{movie.overview}</p>
                </div>

                <div
                  className="flex items-center justify-between mt-auto pt-4 border-t cursor-pointer"
                  onClick={() => toggleRating(movie.id)}
                >
                  <Heart
                    weight="duotone"
                    size={32}
                    color={changeStatus(movie.id) ? "red" : "gray"}
                  />
                  <span className="text-sm ml-2">
                    {changeStatus(movie.id)
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 
            <Card className="mb-6 p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
   
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Heart
              weight="duotone"
              size={32}
              color={updateState ? "red" : "gray"}
              onClick={toggleRating}
            />
            <span className="text-sm text-gray-700" onClick={showState}>
              {updateState ? "Remove from Favorites" : "Add to Favorites"}
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
      </Card> */}
    </>
  );
};
export default Movies;
