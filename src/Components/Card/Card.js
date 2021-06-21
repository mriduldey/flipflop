import React from "react";
import "./style.css";
import batman from "./batman.png";

const Card = props => {
  const { face } = props;
  const isClicked = () => {
    return face.isFlipped ? "isClicked" : "";
  };

  const cardErrorClass = () => {
    const { error } = props;
    return error ? `scene-error` : "";
  };

  return (
    <div
      className={`scene ${cardErrorClass()} d-flex justify-content-center align-items-center rounded-3 m-2`}
    >
      <div
        className={`card ${isClicked()} position-relative`}
        onClick={props.onClick}
      >
        <div className="card-face face-front position-absolute w-100 h-100 rounded-3 text-center">
          {face.dataItem}
        </div>
        <div className="card-face face-back position-absolute w-100 h-100 rounded-3 text-center">
          <img className="rounded-3" src={batman} alt="Front" />
        </div>
      </div>
    </div>
  );
};

export default Card;
