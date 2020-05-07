import React from "react";
import Card from "./Card/Card";

const CardDeck = (props) => {
  const { rowNumber, colNumber } = props;
  const createCard = (i) => {
    const { viewFaces } = props;

    const findErrorCard = () => {
      const { error, selectedCardIndex } = props;
      return error && selectedCardIndex === i;
    };
    return (
      <Card
        key={`card${i}`}
        onClick={() => props.onClick(i)}
        face={viewFaces[i]}
        error={findErrorCard()}
      />
    );
  };

  const createCardDeckRow = (i) => {
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
        <div className="card-deck-row" key={`row-${i}`}>
          {createCardDeckRow(colNumber * i)}
        </div>
      );
    }

    return cardDeckComponent;
  };

  return (
    <div className={`card-deck card-deck-${rowNumber}-${colNumber}`}>
      {createCardDeck()}
    </div>
  );
};

export default CardDeck;
