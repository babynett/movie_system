"use client";
import React from "react";
import { useReducer } from "react";

interface State {
  count: number;
}

type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "multiply" }
  | { type: "decreaseFifty" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "multiply":
      return { count: state.count * 2 };
    case "decreaseFifty":
      return { count: state.count - 50 };
    default:
      return state;
  }
};

const HookReducer = () => {
  //similar to useState
  // const [isCount, setIsCount] = useState(0) => isCount is the variable where we will place the value and setIsCount will set the value
  //for useReducer we will use state, dispatch
  const [state, dispatch] = useReducer(reducer, { count: 0 }); //reducer is the function that will have different types

  return (
    <>
      <div className="flex justify-center items-center h-[40rem] bg-[#FFF2EB]">
        <div className="flex flex-col items-center gap-5">
          <p>Count: {state.count}</p>
          <div className="flex gap-5">
            <button onClick={() => dispatch({ type: "increment" })}>+</button>
            <button onClick={() => dispatch({ type: "decrement" })}>-</button>
            <button onClick={() => dispatch({ type: "multiply" })}>*</button>
            <button onClick={() => dispatch({ type: "decreaseFifty" })}>
              -50
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HookReducer;
