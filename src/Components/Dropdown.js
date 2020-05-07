import React from "react";

const Dropdown = (props) => {
  const { name, label, value, options } = props;
  return (
    <div className={name}>
      <label>
        {label}
        <select value={value} onChange={props.onChange} name={name}>
          {options.map((option) => (
            <option value={option} key={"row" + option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Dropdown;
