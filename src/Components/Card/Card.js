import React from "react";
import "./style.css";
import batman from "./batman.png";

const Card = (props) => {
  const { face } = props;
  const isClicked = () => {
    return face.isFlipped ? "isClicked" : "";
  };

  const cardErrorClass = () => {
    const { error } = props;
    return error ? `scene-error` : "";
  };

  return (
    <div className={`scene ${cardErrorClass()}`}>
      <div className={`card ${isClicked()}`} onClick={props.onClick}>
        <div className="card-face face-front">{face.dataItem}</div>
        <div className="card-face face-back">
          <img width="47px" height="57px" src={batman} alt="Front" />
        </div>
      </div>
    </div>
  );
};

export default Card;
