import React from "react";
import CardDeck from "./CardDeck";
import Dropdown from "./Dropdown";

const actualCardFaces = [1, 2, 3, 4, 5, 6, 7, 8];

let viewFaces = actualCardFaces.concat(actualCardFaces);

viewFaces = viewFaces.map((element, index) => {
  return {
    id: index,
    dataItem: element,
    isFlipped: true,
  };
});

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

shuffle(viewFaces);

const defaultRowNumber = 4;
const defaultColNumber = 4;
const cardNumberOptions = [3, 4, 5, 6];
const defaultTimeRemaining = 120;

const GAME_PRE_START = "GAME_PRE_START";
const GAME_START_UNFLIPPED = "GAME_START_UNFLIPPED";
const GAME_MIDDLE_FLIPPED = "GAME_MIDDLE_FLIPPED";
const GAME_END = "GAME_END";

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewFaces: viewFaces,
      rowNumber: defaultRowNumber,
      colNumber: defaultColNumber,
      flippedForMatch: false,
      clickedCardIndex: undefined,
      pairMatched: 0,
      error: false,
      life: 5,
      gameStatus: GAME_PRE_START,
      boardRowOptions: cardNumberOptions,
      boardColOptions: cardNumberOptions,
      timeRemaining: defaultTimeRemaining,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // for card flipping with click.........................
    const { error, clickedCardIndex } = this.state;
    if (error) {
      const cardFaces = JSON.parse(JSON.stringify(this.state.viewFaces));
      cardFaces[clickedCardIndex].isFlipped = true;
      setTimeout(
        () => this.setState(() => ({ viewFaces: cardFaces, error: false })),
        900
      );
    }
    //....................................................................

    //controlling game life cycle.........................................
    const { gameStatus } = this.state;
    const { gameStatus: prevGameStatus } = prevState;

    console.log("current status: ", gameStatus);
    console.log("previous status: ", prevGameStatus);

    if (gameStatus === GAME_START_UNFLIPPED) {
      console.log("game status: ", GAME_START_UNFLIPPED);
      let viewFaces = JSON.parse(JSON.stringify(this.state.viewFaces));

      viewFaces.forEach((viewFace) => {
        viewFace.isFlipped = true;
      });

      setTimeout(
        () =>
          this.setState(() => ({
            viewFaces: viewFaces,
            gameStatus: GAME_MIDDLE_FLIPPED,
          })),
        2000
      );
    }

    // end game when life ends

    if (gameStatus === GAME_MIDDLE_FLIPPED) {
      const { life, timeRemaining } = this.state;
      const { timeRemaining: prevTimeRemaining } = prevState;
      console.log(
        "previous time remaining................:   ",
        prevTimeRemaining
      );
      console.log("current time remaining................:   ", timeRemaining);
      if (timeRemaining !== 0) {
        if (prevGameStatus === GAME_START_UNFLIPPED) {
          this.timeID = setInterval(() => this.handleTime(), 1000);
        }
      } else {
        clearInterval(this.timeID);
        this.setState(() => ({
          gameStatus: GAME_END,
        }));
      }

      if (life === 0) {
        this.setState(() => ({ gameStatus: GAME_END }));
      }
    }
  }

  handleTime = () => {
    const { timeRemaining } = this.state;
    console.log("Inside timebar function");
    this.setState(() => ({
      timeRemaining: timeRemaining - 1,
    }));
  };

  handleClick = (i) => {
    const cardFaces = JSON.parse(JSON.stringify(this.state.viewFaces));
    const cardFace = cardFaces[i];
    const { flippedForMatch, gameStatus, life } = this.state;
    if (gameStatus === GAME_MIDDLE_FLIPPED) {
      if (flippedForMatch && cardFace.isFlipped) {
        const cardFaceMatched = cardFaces.find((card) => {
          if (
            card.id !== cardFace.id &&
            !card.isFlipped &&
            card.dataItem === cardFace.dataItem
          ) {
            cardFace.isFlipped = false;
            const { rowNumber, colNumber, pairMatched } = this.state;

            //finding the number of pair already matched before next pair match: to find all the cards
            // have been flipped or not
            const isGameEnd = pairMatched === (rowNumber * colNumber) / 2 - 1;
            ////////////////

            this.setState(() => ({
              viewFaces: cardFaces,
              flippedForMatch: false,
              pairMatched: pairMatched + 1,
              error: false,
              clickedCardIndex: i,
              gameStatus: isGameEnd ? GAME_END : GAME_MIDDLE_FLIPPED,
            }));
            return true;
          }

          return false;
        });

        if (!cardFaceMatched) {
          cardFace.isFlipped = false;
          this.setState(() => ({
            viewFaces: cardFaces,
            error: true,
            clickedCardIndex: i,
            life: life - 1,
          }));
        }
      } else {
        cardFace.isFlipped = false;
        this.setState(() => ({
          viewFaces: cardFaces,
          flippedForMatch: true,
          clickedCardIndex: i,
        }));
      }
    }
  };

  handleGameControl = () => {
    const { gameStatus } = this.state;
    if (gameStatus === GAME_PRE_START || gameStatus === GAME_END) {
      let viewFaces = JSON.parse(JSON.stringify(this.state.viewFaces));
      viewFaces.forEach((viewFace) => {
        viewFace.isFlipped = false;
      });

      shuffle(viewFaces);

      this.setState(() => ({
        viewFaces: viewFaces,
        gameStatus: GAME_START_UNFLIPPED,
        pairMatched: 0,
        flippedForMatch: false,
        clickedCardIndex: undefined,
        error: false,
        life: 5,
        timeRemaining: defaultTimeRemaining,
      }));
    }
  };

  gameStatusInfo = () => {
    const { gameStatus } = this.state;
    return gameStatus === GAME_PRE_START
      ? "Start Game"
      : gameStatus === GAME_START_UNFLIPPED
      ? "Remember the Cards"
      : gameStatus === GAME_MIDDLE_FLIPPED
      ? "Flip and Match the Cards"
      : "Game over! play again?";
  };

  renderLifeList = (life) => {
    let lifeArray = [];
    for (let i = 0; i < life; i += 1) {
      lifeArray.push(
        <li key={i}>
          <i className="far fa-heart"></i>
        </li>
      );
    }

    return lifeArray;
  };

  handleDropdown = (e) => {
    const {
      rowNumber,
      colNumber,
      gameStatus,
      boardColOptions,
      boardRowOptions,
    } = this.state;

    if (gameStatus === GAME_PRE_START || gameStatus === GAME_END) {
      const value = e.target.value;

      const targetName = e.target.getAttribute("name");

      const isRowChange = targetName === "row-options";

      const newColNumber = isRowChange ? colNumber : value;
      const newRowNumber = isRowChange ? value : rowNumber;

      const halfNumberCards = (newColNumber * newRowNumber) / 2;
      let actualCardFaces = [];
      for (let i = 0; i < halfNumberCards; i++) {
        actualCardFaces.push(i);
      }

      let viewFaces = actualCardFaces.concat(actualCardFaces);

      viewFaces = viewFaces.map((element, index) => {
        return {
          id: index,
          dataItem: element,
          isFlipped: true,
        };
      });

      const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      };

      shuffle(viewFaces);

      let newBoardColOptions = isRowChange
        ? cardNumberOptions.filter((col) => {
            return value % 2 === 0 ? true : col % 2 === 0 ? true : false;
          })
        : boardColOptions;

      let newBoardRowOptions = !isRowChange
        ? cardNumberOptions.filter((col) => {
            return value % 2 === 0 ? true : col % 2 === 0 ? true : false;
          })
        : boardRowOptions;

      this.setState(() => ({
        viewFaces: viewFaces,
        rowNumber: newRowNumber,
        colNumber: newColNumber,
        boardColOptions: newBoardColOptions,
        boardRowOptions: newBoardRowOptions,
      }));
    }
  };

  render() {
    const {
      rowNumber,
      colNumber,
      viewFaces,
      error,
      pairMatched,
      clickedCardIndex,
      life,
      boardColOptions,
      boardRowOptions,
      timeRemaining,
    } = this.state;
    console.log("rendering");
    return (
      <div className="memory-game-wrapper">
        <div className="status">
          <div className="score">
            <ul className="life">{this.renderLifeList(life)}</ul>
            <p className="point">
              Point:{" "}
              {
                pairMatched * 10 - (5 - life) * 5
                /*10 points for each matching pait, -5 points for each error*/
              }
            </p>
          </div>
          <div className="game-control">
            <p>{this.gameStatusInfo()}</p>
            <button type="submit" onClick={() => this.handleGameControl()}>
              <i className="fas fa-play"></i>
            </button>
          </div>
          <div className="board-control">
            <Dropdown
              label="Pick row number: "
              name="row-options"
              options={boardRowOptions}
              value={rowNumber}
              onChange={(e) => this.handleDropdown(e)}
            />
            <Dropdown
              label="Pick column number: "
              name="col-options"
              options={boardColOptions}
              value={colNumber}
              onChange={(e) => this.handleDropdown(e)}
            />
          </div>
        </div>
        <div className="card-deck-wrapper">
          <div className="time-bar">
            <label for="timebar">Time remaining:</label>
            <progress id="timebar" value={timeRemaining} max="120"></progress>
          </div>
          <CardDeck
            rowNumber={rowNumber}
            colNumber={colNumber}
            onClick={(i) => this.handleClick(i)}
            viewFaces={viewFaces}
            error={error}
            selectedCardIndex={clickedCardIndex}
          />
        </div>
      </div>
    );
  }
}

export default MemoryGame;