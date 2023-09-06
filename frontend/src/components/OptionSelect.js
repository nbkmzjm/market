import React from 'react';

export default function OptionSelect(props) {
  //   const { selectedOption } = props;
  const { options } = props;
  console.log(options);
  return (
    <>
      {options.map((option) => (
        <option
          key={option.id}
          value={option.id}
          //   selected={option.displayName === selectedOption.displayName}
        >
          {option.account}
        </option>
      ))}
    </>
  );
}
