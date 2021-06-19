import React from "react";
import Dropdown from "./Dropdown";

const SettingsModal = ({
  handleDropdown,
  handleTheme,
  boardRowOptions,
  rowNumber,
  boardColOptions,
  colNumber,
  themeOptions,
  currentTheme,
}) => {
  return (
    <div className="modal" id="settings-modal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modal title</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="board-control">
              <Dropdown
                label="Pick row number: "
                name="row-options"
                options={boardRowOptions}
                value={rowNumber}
                onChange={e => handleDropdown(e)}
              />
              <Dropdown
                label="Pick column number: "
                name="col-options"
                options={boardColOptions}
                value={colNumber}
                onChange={e => handleDropdown(e)}
              />
              <Dropdown
                label="Choose theme: "
                name="theme"
                options={themeOptions}
                value={currentTheme}
                onChange={e => handleTheme(e)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
