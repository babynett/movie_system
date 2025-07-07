"use client";
//child component for movie list
import { useEffect, useState } from "react";
import type { Movies } from "@/app/interface/users";
import { Card } from "../ui/card";
import { Heart } from "phosphor-react";

//you have to call the Props first
interface Props {
  movie: Movies;
}

const Movies = ({ movie }: Props) => {
  const [updateState, setUpdateState] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const showState = () => {
    setUpdateState((prev) => {
      const newState = !prev;
      return newState;
    });
  };

  const toggleRating = () => {
    setUpdateState((prev) => !prev);
    setHasInteracted(true); // mark that the user interacted
  };

  useEffect(() => {
    if (!hasInteracted) return;
    console.log(
      `${movie.title} has been ${updateState ? "added to favorites" : "removed from favorites"}`
    );
  }, [updateState, movie.title]); //  Proper dependency tracking

  return (
    <>
      <Card className="mb-6 p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{movie.title}</h2>
        <p className="text-gray-700 mb-4">{movie.description}</p>
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
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};
export default Movies;
