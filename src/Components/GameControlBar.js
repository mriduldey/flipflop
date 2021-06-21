import React from "react";

const GameControlbar = ({gameStatusInfo, handleGameControl, pairMatched, life}) => {
  return (
    <div className="status d-flex flex-md-column justify-content-between align-items-center justify-content-md-between align-items-md-center p-3">
      <div className="game-control d-flex flex-column justify-content-center align-items-center">
        <p className="mb-1">{gameStatusInfo()}</p>
        <button type="submit" onClick={() => handleGameControl()}>
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
  );
};

export default GameControlbar;
