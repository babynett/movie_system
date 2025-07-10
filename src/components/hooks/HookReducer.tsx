"use client";
import React, { useState } from "react";
import { useReducer } from "react";

type Action = {
  color: string;
};

const colorChange = (color: string, action: Action): string => {
  switch (action.color) {
    case action.color:
      return action.color;
    default:
      return "";
  }
};

const HookReducer = () => {
  //similar to useState
  // const [isCount, setIsCount] = useState(0) => isCount is the variable where we will place the value and setIsCount will set the value
  //for useReducer we will use state, dispatch
  const [isColor, isColorDispatch] = useReducer(colorChange, "");
  const [input, setInput] = useState("");

  return (
    <>
      <div className="flex justify-evenly items-center h-[40rem] bg-[#FFF2EB]">
        <div className="flex flex-col items-center gap-5">
          <h1>Color Change</h1>

          <div className="flex gap-5">
            <input
              type="text"
              placeholder="Type any color hex"
              className="border-black border p-4 rounded-md"
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <button
              onClick={() => {
                isColorDispatch({ color: input }); //object
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <div>
          <h1>Box will change color</h1>
          <br />
          <div
            className="border border-black p-20 rounded-md"
            style={{ backgroundColor: isColor }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default HookReducer;
