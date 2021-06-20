import React from "react";

const TimeBar = ({
  handleTimeIcon,
  timeRemainingString,
  timeRemaining,
  maxTime,
}) => {
  return (
    <div className="time-bar row mb-3">
      <div className="col">
        <i className={`${handleTimeIcon()}`}></i>
      </div>
      <div className="col position-relative d-flex align-items-center">
        <span className="mb-0 position-absolute top-0 translate-top">
          {timeRemainingString}
        </span>
        <progress
          id="timebar"
          className={`${timeRemaining === maxTime ? "time-full" : ""}`}
          value={timeRemaining}
          max={maxTime}
        ></progress>
      </div>
    </div>
  );
};

export default TimeBar;
