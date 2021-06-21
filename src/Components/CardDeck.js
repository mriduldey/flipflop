import React from "react";
import Card from "./Card/Card";

const CardDeck = ({
  rowNumber,
  colNumber,
  error,
  selectedCardIndex,
  onClick,
  viewFaces,
}) => {
  const createCard = i => {
    const findErrorCard = () => {
      return error && selectedCardIndex === i;
    };
    return (
      <Card
        key={`card${i}`}
        onClick={() => onClick(i)}
        face={viewFaces[i]}
        error={findErrorCard()}
      />
    );
  };

  const createCardDeckRow = i => {
    const cardDeckRow = [];
    for (let j = 0; j < colNumber; j++) {
      cardDeckRow.push(createCard(i + j));
    }
    return cardDeckRow;
  };

  const createCardDeck = () => {
    const cardDeckComponent = [];
    for (let i = 0; i < rowNumber; i++) {
      cardDeckComponent.push(
        <div
          className="card-deck-row d-flex justify-content-center align-items-center"
          key={`row-${i}`}
        >
          {createCardDeckRow(colNumber * i)}
        </div>
      );
    }
    return cardDeckComponent;
  };

  return (
    <div
      className={`card-deck card-deck-${rowNumber}-${colNumber} d-flex flex-column align-items-center justify-content-center rounded-3 p-2`}
    >
      {createCardDeck()}
    </div>
  );
};

export default CardDeck;
