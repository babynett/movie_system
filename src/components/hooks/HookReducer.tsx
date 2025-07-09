"use client";
import React, { useState } from "react";
import { useReducer } from "react";

interface State {
  color: string;
}

type Action = {
  color: string;
};

const colorChange = (color: string, action: Action): string => {
  switch (action.color) {
    case "pink":
      return "pink";
    case "yellow":
      return "yellow";
    case "blue":
      return "blue";
    case "green":
      return "green";
    case "purple":
      return "purple";
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
          <h1>Choose any from the colors below :</h1>
          <ul>
            <li>Pink</li>
            <li>Yellow</li>
            <li>Blue</li>
            <li>Green</li>
            <li>Purple</li>
          </ul>
          <div className="flex gap-5">
            <input
              type="text"
              placeholder="Choose from colors"
              className="border-black border p-4 rounded-md"
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <button
              onClick={() => {
                isColorDispatch({ color: input });
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
