"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Heart, Star } from "phosphor-react";

const FavoritePage = () => {
  return (
    <div>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                My Favorite Movies
              </h1>
              <p className="text-muted-foreground">
                Favorites in your collection
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Card className="flex flex-col justify-between p-4 bg-card hover:shadow-lg transition-shadow duration-300 h-full">
              <div>
                {/* <img
                  src={penggy}
                  alt="heh"
                  className="w-full h-auto rounded mb-4"
                  height={}
                /> */}
                <img
                  src="/assets/pinggu.jpg"
                  alt="Placeholder"
                  className="w-full h-auto rounded mb-4"
                />
                <h2 className="text-lg font-bold text-card-foreground mb-2 line-clamp-2">
                  Hello
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  Hello
                </p>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={16} color="#D9A299" weight="fill" />
                  <span className="text-sm text-muted-foreground">10/10</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border cursor-pointer">
                <Heart weight="duotone" size={28} color="#D9A299" />
                <span className="text-sm text-muted-foreground">
                  Remove from Favorites
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;
