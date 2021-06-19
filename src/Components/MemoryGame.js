import React from "react";
import CardDeck from "./CardDeck";
import SettingsModal from "./SettingsModal";
import "./theme.css";

const actualCardFaces = [1, 2, 3, 4, 5, 6, 7, 8];

let viewFaces = actualCardFaces.concat(actualCardFaces);

viewFaces = viewFaces.map((element, index) => {
  return {
    id: index,
    dataItem: element,
    isFlipped: true,
  };
});

const shuffle = array => {
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
const defaultTheme = "Cyan";

const GAME_PRE_START = "GAME_PRE_START";
const GAME_START_UNFLIPPED = "GAME_START_UNFLIPPED";
const GAME_MIDDLE_FLIPPED = "GAME_MIDDLE_FLIPPED";
const GAME_END = "GAME_END";

class MemoryGame extends React.Component {
  state = {
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
    themeOptions: ["Blue", "Dark", "Bright", "Cyan", "Brick"],
    currentTheme: defaultTheme,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { error, clickedCardIndex, gameStatus, currentTheme } = this.state;

    // for card flipping with click.........................

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
    const { gameStatus: prevGameStatus } = prevState;

    console.log("current status: ", gameStatus);
    console.log("previous status: ", prevGameStatus);

    if (gameStatus === GAME_START_UNFLIPPED) {
      console.log("game status: ", GAME_START_UNFLIPPED);
      let viewFaces = JSON.parse(JSON.stringify(this.state.viewFaces));

      viewFaces.forEach(viewFace => {
        viewFace.isFlipped = true;
      });

      setTimeout(
        () =>
          this.setState(() => ({
            viewFaces: viewFaces,
            gameStatus: GAME_MIDDLE_FLIPPED,
          })),
        5000
      );
    }

    // end game when life ends and starting timebar when game starts

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
        clearInterval(this.timeID);
        this.setState(() => ({ gameStatus: GAME_END }));
      }
    }

    // ...........................................................................

    if (gameStatus === GAME_END) {
      clearInterval(this.timeID);
    }

    // Theme update.....................................

    let root = document.documentElement;

    if (currentTheme === "Blue") {
      root.style.setProperty("--primary", "#6b9080");
      root.style.setProperty("--secondary", "#a4c3b2");
      root.style.setProperty("--light-tone", "#eaf4f4");
      root.style.setProperty("--lighter-tone", "#f6fff8");
      root.style.setProperty("--error-color", "red");
    } else if (currentTheme === "Dark") {
      root.style.setProperty("--primary", "#0b0b0d");
      root.style.setProperty("--secondary", "#474a56");
      root.style.setProperty("--light-tone", "#929aab");
      root.style.setProperty("--lighter-tone", "#d3d5fd");
      root.style.setProperty("--error-color", "red");
    } else if (currentTheme === "Bright") {
      root.style.setProperty("--primary", "#f60c86");
      root.style.setProperty("--secondary", "#11cbd7");
      root.style.setProperty("--light-tone", "#9feed1");
      root.style.setProperty("--lighter-tone", "#9feed1");
      root.style.setProperty("--error-color", "#11cbd7");
    } else if (currentTheme === "Cyan") {
      root.style.setProperty("--primary", "#006c9a");
      root.style.setProperty("--secondary", "#00bebe");
      root.style.setProperty("--light-tone", "#00f3e4");
      root.style.setProperty("--lighter-tone", "#9ff9c1");
      root.style.setProperty("--error-color", "#00f3e4");
    } else {
      root.style.setProperty("--primary", "#031f41");
      root.style.setProperty("--secondary", "#1b1b2f57");
      root.style.setProperty("--light-tone", " #963041");
      root.style.setProperty("--lighter-tone", "#1f4068");
      root.style.setProperty("--error-color", "#d6475f");
    }
  }

  handleTime = () => {
    const { timeRemaining } = this.state;
    console.log("Inside timebar function");
    this.setState(() => ({
      timeRemaining: timeRemaining - 1,
    }));
  };

  handleClick = i => {
    const cardFaces = JSON.parse(JSON.stringify(this.state.viewFaces));
    const cardFace = cardFaces[i];
    const { flippedForMatch, gameStatus, life } = this.state;
    if (gameStatus === GAME_MIDDLE_FLIPPED) {
      if (flippedForMatch && cardFace.isFlipped) {
        const cardFaceMatched = cardFaces.find(card => {
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
      viewFaces.forEach(viewFace => {
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

  renderLifeList = life => {
    let lifeArray = [];
    for (let i = 0; i < life; i += 1) {
      lifeArray.push(
        <li className="px-2" key={i}>
          <i className="far fa-heart"></i>
        </li>
      );
    }

    return lifeArray;
  };

  handleDropdown = e => {
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

      const shuffle = array => {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      };

      shuffle(viewFaces);

      let newBoardColOptions = isRowChange
        ? cardNumberOptions.filter(col => {
            return value % 2 === 0 ? true : col % 2 === 0 ? true : false;
          })
        : boardColOptions;

      let newBoardRowOptions = !isRowChange
        ? cardNumberOptions.filter(col => {
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

  handleTimeIcon = () => {
    const { gameStatus } = this.state;
    const iconClass =
      gameStatus === GAME_PRE_START || gameStatus === GAME_START_UNFLIPPED
        ? "fas fa-hourglass-start"
        : gameStatus === GAME_MIDDLE_FLIPPED
        ? "far fa-hourglass game-started"
        : "fas fa-hourglass-end";
    return iconClass;
  };

  handleTheme = e => {
    const value = e.target.value;
    this.setState(() => ({ currentTheme: value }));
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
      gameStatus,
      themeOptions,
      currentTheme,
    } = this.state;
    console.log("rendering");
    return (
      <div
        className={`memory-game-wrapper ${currentTheme.toLocaleLowerCase()}-theme d-flex flex-column flex-md-row vh-100`}
      >
        <div className="status d-flex flex-md-column justify-content-between align-items-center justify-content-md-between align-items-md-center p-3">
          <div className="game-control d-flex flex-column justify-content-center align-items-center">
            <p className="mb-1">{this.gameStatusInfo()}</p>
            <button type="submit" onClick={() => this.handleGameControl()}>
              <i className="fas fa-play"></i>
            </button>
          </div>

          <p className="point">
            Point:{" "}
            {
              pairMatched * 10 - (5 - life) * 5
              /*10 points for each matching pait, -5 points for each error*/
            }
          </p>
          <div
            className="settings"
            data-bs-toggle="modal"
            data-bs-target="#settings-modal"
          >
            <i className="fas fa-cog"></i>
          </div>
        </div>
        <div className="card-deck-wrapper container d-flex flex-column align-items-center w-100 mt-5">
          <div className="time-bar row mb-3">
            <div className="col">
              <i className={`${this.handleTimeIcon()}`}></i>
            </div>
            <div className="col position-relative d-flex align-items-center">
              <span className="mb-0 position-absolute top-0 translate-top">{`${
                gameStatus === GAME_MIDDLE_FLIPPED ? `${timeRemaining}s` : " "
              }`}</span>
              <progress
                id="timebar"
                className={`${timeRemaining === 120 ? "time-full" : ""}`}
                value={timeRemaining}
                max="120"
              ></progress>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <CardDeck
                rowNumber={rowNumber}
                colNumber={colNumber}
                onClick={i => this.handleClick(i)}
                viewFaces={viewFaces}
                error={error}
                selectedCardIndex={clickedCardIndex}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="score">
                <ul className="life-list list-unstyled d-flex py-3">
                  {this.renderLifeList(life)}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <SettingsModal
          handleDropdown={this.handleDropdown}
          handleTheme={this.handleTheme}
          boardRowOptions={boardRowOptions}
          rowNumber={rowNumber}
          boardColOptions={boardColOptions}
          colNumber={colNumber}
          themeOptions={themeOptions}
          currentTheme={currentTheme}
        />
      </div>
    );
  }
}

export default MemoryGame;
