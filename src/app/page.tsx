import React from "react";
import Movies from "../components/main_components/Movies";
import movies from "./interface/users";
import SparkleTitle from "../components/designFont/SparkleTitle";

function page() {
  return (
    <>
      <SparkleTitle />
      <div className="flex justify-center md:p-20">
        <div className="grid grid-cols-4 gap-5">
          {movies.map((movie) => (
            <Movies key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
}

export default page;
