const URL = "https://min-api.cryptocompare.com/data/pricemulti";
const CURRENCY = "USD";

export const loadTickers = (tickersNameString) => {
  return fetch(`${URL}?fsyms=${tickersNameString}&tsyms=${CURRENCY}`)
    .then((result) => {
      return result.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
