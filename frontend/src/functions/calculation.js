export const roundNumber = (num, decimal) => {
  const roundedNumber =
    Math.ceil(num * Math.pow(10, decimal)) / Math.pow(10, decimal);

  return roundedNumber;
};
