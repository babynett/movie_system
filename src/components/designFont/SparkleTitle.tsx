"use client";
import React from "react";
import { SparklesCore } from "../ui/sparkles";

export default function SparklesPreview() {
  return (
    <>
      <div className="h-[50rem] relative w-full bg-[#D9A299] flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FAF7F3"
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white md:mb-5">
            Don&apos;t know what movie to watch?
          </h1>
          <p className="md:text-lg text-lg lg:text-xl font-semibold text-center text-white">
            Find some movies the entire world loves
          </p>

          <button className="z-5 bg-[#fff] px-4 py-2 rounded md:mt-5 font-semibold">
            Explore Popular Movies!
          </button>
        </div>
      </div>
    </>
  );
}
