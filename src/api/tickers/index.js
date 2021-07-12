const URL = "wss://streamer.cryptocompare.com/v2";
const CURRENCY = "USD";
let CourseBTC = null;
const API_KEY =
  "55034197a6c68922f370c33260b1a45d1dad97942494236b810f39dfca3fc8fb";

let tickersSocket = new WebSocket(`${URL}?api_key=${API_KEY}`);

export function updateTickers(tickers) {
  tickersSocket.onmessage = function (event) {
    const tickersData = JSON.parse(event.data);

    if (tickersData.TYPE == 5 && tickersData.PRICE) {
      if (tickersData.FROMSYMBOL === "BTC") {
        CourseBTC = tickersData.PRICE;
      }

      tickers.forEach((ticker) => {
        if (ticker.name === tickersData.FROMSYMBOL && tickersData.PRICE) {
          if (tickersData.TOSYMBOL == CURRENCY) {
            let newPrice = tickersData.PRICE;
            newPrice =
              newPrice < 1 ? newPrice.toPrecision(2) : newPrice.toFixed(2);
            ticker.course = newPrice;
            ticker.isNoValidation = false;
          } else if (tickersData.TOSYMBOL == "BTC" && CourseBTC) {
            let newPrice = tickersData.PRICE * CourseBTC;
            newPrice =
              newPrice < 1 ? newPrice.toPrecision(2) : newPrice.toFixed(2);
            ticker.course = newPrice;
            ticker.isNoValidation = false;
          }
        }
      });
    }

    if (tickersData.TYPE == 500 && tickersData.MESSAGE === "INVALID_SUB") {
      if (!CourseBTC) {
        getCourseBTC();
      }

      const nameCurrency = tickersData.PARAMETER.slice(-3);
      const tickerName = tickersData.PARAMETER.slice(9, -4);

      tickers.forEach((ticker) => {
        if (ticker.name === tickerName) {
          if (nameCurrency === "BTC") {
            socketSendRemoveTickers(ticker);
            ticker.course = "-";
            ticker.isNoValidation = true;
          } else {
            ticker.thereIsNoValidationToUSD = true;
            socketSendAddTickers(ticker);
          }
        }
      });
    }
  };

  return tickers;
}

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (tickersSocket.readyState != WebSocket.OPEN) {
    tickersSocket.addEventListener("open", () => {
      tickersSocket.send(stringifiedMessage);
    });
  }

  if (tickersSocket.readyState === WebSocket.OPEN) {
    tickersSocket.send(stringifiedMessage);
    return;
  }
}

function getCourseBTC() {
  const msg = {
    action: "SubAdd",
    subs: [`5~CCCAGG~BTC~${CURRENCY}`],
  };
  sendToWebSocket(msg);
}

export const socketSendAddTickers = (ticker) => {
  if (ticker.name === "BTC" && CourseBTC && ticker.course != "-") {
    return;
  }

  let msg;

  if (ticker.thereIsNoValidationToUSD) {
    msg = {
      action: "SubAdd",
      subs: [`5~CCCAGG~${ticker.name}~BTC`],
    };
  } else {
    msg = {
      action: "SubAdd",
      subs: [`5~CCCAGG~${ticker.name}~${CURRENCY}`],
    };
  }

  sendToWebSocket(msg);
};

export const socketSendRemoveTickers = (ticker) => {
  let msg;

  if (ticker.thereIsNoValidationToUSD) {
    msg = {
      action: "SubRemove",
      subs: [
        `5~CCCAGG~${ticker.name}~BTC`,
        `5~CCCAGG~${ticker.name}~${CURRENCY}`,
      ],
    };
  } else {
    msg = {
      action: "SubRemove",
      subs: [`5~CCCAGG~${ticker.name}~${CURRENCY}`],
    };
  }
  sendToWebSocket(msg);
};

export const tickersSocketClosed = () => {
  if (tickersSocket.readyState === WebSocket.OPEN) {
    tickersSocket.close();
  }
};
