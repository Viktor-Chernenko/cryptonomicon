const URL = "wss://streamer.cryptocompare.com/v2";
const CURRENCY = "USD";
const API_KEY =
  "55034197a6c68922f370c33260b1a45d1dad97942494236b810f39dfca3fc8fb";

let tickersSocket = new WebSocket(`${URL}?api_key=${API_KEY}`);

export function updateTickers(tickers) {
  tickersSocket.onmessage = function (event) {
    const tickersData = JSON.parse(event.data);

    if (tickersData.TYPE == 5 && tickersData.PRICE) {
      tickers.forEach((ticker) => {
        if (ticker.name === tickersData.FROMSYMBOL) {
          let newPrice = tickersData.PRICE;
          newPrice =
            newPrice < 1
              ? (newPrice * 100).toFixed() / 100
              : newPrice.toFixed(2);
          ticker.course = newPrice;
        }
      });
    }
  };

  return tickers;
}

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (tickersSocket.readyState === WebSocket.OPEN) {
    tickersSocket.send(stringifiedMessage);
    return;
  }

  tickersSocket.addEventListener(
    "open",
    () => {
      tickersSocket.send(stringifiedMessage);
    },
    { once: true }
  );
}

export const socketSendAddTickers = (ticker) => {
  const msg = {
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker.name}~${CURRENCY}`],
  };
  sendToWebSocket(msg);
};

export const socketSendRemoveTickers = (ticker) => {
  const msg = {
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker.name}~${CURRENCY}`],
  };
  sendToWebSocket(msg);
};
