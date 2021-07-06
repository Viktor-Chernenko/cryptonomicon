<template>
  <div id="app">
    <div class="container mx-auto flex flex-col items-center p-4">
      <div class="container">
        <section>
          <div class="flex">
            <div class="max-w-xs">
              <label
                for="wallet"
                class="block text-sm font-medium text-gray-700"
                >Тикер</label
              >
              <div class="mt-1 relative rounded-md shadow-md">
                <input
                  v-model="tickerName"
                  type="text"
                  @keyup="
                    hintsNamesCryptocurrencyAdding();
                    messageAboutPreviouslyAddedTicker = false;
                  "
                  @keyup.enter="addTicket()"
                  name="wallet"
                  id="wallet"
                  class="
                    block
                    w-full
                    pr-10
                    border-gray-300
                    text-gray-900
                    focus:outline-none focus:ring-gray-500 focus:border-gray-500
                    sm:text-sm
                    rounded-md
                  "
                  placeholder="Например DOGE"
                />
              </div>
              <div
                class="flex p-1 rounded-md flex-wrap"
                v-if="tickersNameListHints.length"
              >
                <span
                  class="
                    inline-flex
                    items-center
                    px-2
                    m-1
                    rounded-md
                    text-xs
                    font-medium
                    bg-gray-300
                    text-gray-800
                    cursor-pointer
                  "
                  @click="addTicket(tickerName)"
                  v-for="(tickerName, index) in tickersNameListHints"
                  :key="index"
                >
                  {{ tickerName }}
                </span>
                <hr class="w-full border-t border-gray-400" />
              </div>
              <div
                class="text-sm text-red-600"
                v-if="messageAboutPreviouslyAddedTicker"
              >
                Такой тикер уже добавлен
              </div>
            </div>
          </div>
          <button
            type="button"
            @click="addTicket()"
            class="
              my-4
              inline-flex
              items-center
              py-2
              px-4
              border border-transparent
              shadow-sm
              text-sm
              leading-4
              font-medium
              rounded-full
              text-white
              bg-gray-600
              hover:bg-gray-700
              transition-colors
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-gray-500
            "
          >
            <!-- Heroicon name: solid/mail -->
            <svg
              class="-ml-0.5 mr-2 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="#ffffff"
            >
              <path
                d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              ></path>
            </svg>
            Добавить
          </button>
        </section>
        <div class="filter flex items-start">
          <input
            type="text"
            v-model="filter"
            class="
              filter__input
              pr-10
              mr-10
              border-gray-300
              text-gray-900
              focus:outline-none focus:ring-gray-500 focus:border-gray-500
              sm:text-sm
              rounded-md
            "
          />
          <div class="filter-btns">
            <button
              type="button"
              @click="pageListTickers -= 1"
              :class="{
                'opacity-10':
                  pageListTickers === 0 || filteredTickers.length === 0,
              }"
              class="
                transition-opacity
                duration-300
                inline-flex
                items-center
                py-2
                px-4
                mr-3
                border border-transparent
                shadow-sm
                text-sm
                leading-4
                font-medium
                rounded-full
                text-white
                bg-gray-600
                hover:bg-gray-700
                transition-colors
                duration-300
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-gray-500
              "
            >
              Назад
            </button>
            <button
              type="button"
              @click="pageListTickers += 1"
              :class="{
                'opacity-10':
                  pageListTickers === maxItemsFilterTicketsList ||
                  filteredTickers.length === 0,
              }"
              class="
                transition-opacity
                duration-300
                inline-flex
                items-center
                py-2
                px-4
                border border-transparent
                shadow-sm
                text-sm
                leading-4
                font-medium
                rounded-full
                text-white
                bg-gray-600
                hover:bg-gray-700
                transition-colors
                duration-300
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-gray-500
              "
            >
              Вперед
            </button>
          </div>
        </div>
        <div>
          <hr class="w-full border-t border-gray-600 my-4" />
          <dl
            v-if="filteredTickers.length"
            class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            <div
              v-for="item in filteredTickers"
              :key="item.id"
              @click="changeActiveTicket(item)"
              :class="{
                'border-4': activeItemGraph === item,
              }"
              class="
                bg-white
                overflow-hidden
                shadow
                rounded-lg
                border-purple-800 border-solid
                cursor-pointer
              "
            >
              <div class="px-4 py-5 sm:p-6 text-center">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ item.name }} - USD
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {{ item.course }}
                </dd>
              </div>
              <div class="w-full border-t border-gray-200"></div>
              <button
                class="
                  flex
                  items-center
                  justify-center
                  font-medium
                  w-full
                  bg-gray-100
                  px-4
                  py-4
                  sm:px-6
                  text-md text-gray-500
                  hover:text-gray-600 hover:bg-gray-200 hover:opacity-20
                  transition-all
                  focus:outline-none
                "
                @click.stop="removeTicker(item.id)"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#718096"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path></svg
                >Удалить
              </button>
            </div>
          </dl>
          <div v-else>
            <h3
              class="
                text-lg
                leading-6
                font-medium
                text-gray-900
                my-8
                text-red-500
                font-bold
              "
            >
              Nothing was found
            </h3>
          </div>
          <hr class="w-full border-t border-gray-600 my-4" />
        </div>

        <section v-if="activeItemGraph" class="relative">
          <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
            VUE - USD
          </h3>
          <div class="flex items-end border-gray-600 border-b border-l h-64">
            <div
              v-for="(item, index) in normalizeGraph"
              class="bg-purple-800 border w-10 h-40"
              :key="index"
              :style="{ height: `${item}%` }"
            ></div>
          </div>
          <button
            type="button"
            class="absolute top-0 right-0"
            @click="activeItemGraph = null"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              version="1.1"
              width="30"
              height="30"
              x="0"
              y="0"
              viewBox="0 0 511.76 511.76"
              style="enable-background: new 0 0 512 512"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                  fill="#718096"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { loadTickers } from "./api/tickers";

export default {
  name: "App",

  data: () => ({
    filter: "",
    tickerName: null,
    messageAboutPreviouslyAddedTicker: false,
    activeItemGraph: null,
    tickers: [],
    graph: [],
    intervalUpdateGraph: false,
    intervalUpdateTickersСurrency: false,
    tickersNameViewedList: "",
    tickersNameListHints: [],
    pageListTickers: 0,
  }),

  methods: {
    // удаление тикера
    removeTicker(tickerId) {
      this.tickers = this.tickers.filter((item) => {
        return item.id != tickerId;
      });

      if (this.activeItemGraph?.id === tickerId) {
        (this.graph = []), (this.activeItemGraph = null);
      }

      localStorage.setItem("ListTickers", JSON.stringify(this.tickers));
    },

    // смена элемента для отслеживания с помощью графика
    changeActiveTicket(item) {
      this.activeItemGraph = item;
      this.graph = [];
      this.graph.push(this.activeItemGraph.course);
    },

    // Получение курса криптовалют
    async getAListOfPrices() {
      const dataTickersСurrency = await loadTickers(this.tickersNameViewedList);
      Object.keys(dataTickersСurrency).forEach((item) => {
        const index = this.tickers.findIndex((el) => el.name === item);
        const newCurrency =
          dataTickersСurrency[item].USD < 1
            ? dataTickersСurrency[item].USD.toPrecision(2)
            : dataTickersСurrency[item].USD.toFixed(2);
        this.tickers[index].course = newCurrency;
      });
    },

    // Обновление цен
    updateTickersСurrency(stop) {
      clearInterval(this.intervalUpdateTickersСurrency);
      if (stop) {
        clearInterval(this.intervalUpdateTickersСurrency);
        return;
      } else {
        this.intervalUpdateTickersСurrency = setInterval(
          this.getAListOfPrices,
          2000
        );
      }
    },

    // Добавления нового значения курса в отслеживаемый с помощью графика элемент
    addGraphItem() {
      this.graph.push(this.activeItemGraph.course);
      if (this.graph.length > 25) {
        this.graph.shift();
      }
    },

    // Обновление графика
    updateGraph(stop) {
      clearInterval(this.intervalUpdateGraph);
      if (stop) {
        clearInterval(this.intervalUpdateGraph);
        return;
      } else {
        this.intervalUpdateGraph = setInterval(this.addGraphItem, 2000);
      }
    },

    // добавление тикера
    addTicket(name = this.tickerName) {
      if (name) {
        this.messageAboutPreviouslyAddedTicker = this.tickers.some((item) => {
          return item.name === name;
        });

        if (!this.messageAboutPreviouslyAddedTicker) {
          const newTicker = {
            id: Math.random(),
            name: name.toUpperCase(),
            course: "-",
          };

          this.tickers.unshift(newTicker);
          this.tickersNameListHints = [];
          this.tickerName = null;
        }
      }

      localStorage.setItem("ListTickers", JSON.stringify(this.tickers));
    },

    // Подсказки имён криптовалюты при вводе в input
    hintsNamesCryptocurrencyAdding() {
      let valueInput = this.tickerName.toUpperCase();

      let listSimilarNames = this.tickersNameList.filter((item) => {
        return item.indexOf(valueInput) > -1;
      });

      listSimilarNames.sort((next, prev) => {
        return next.length - prev.length;
      });

      this.tickersNameListHints = [...listSimilarNames.splice(0, 4)];
    },
  },

  computed: {
    // Нормализация высоты элементов графика
    normalizeGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      return this.graph.map(
        (price) => 50 + ((price - minValue) * 50) / (maxValue - minValue)
      );
    },

    // Получаем максимальное число элементов в отфильтрованном списке
    maxItemsFilterTicketsList() {
      const filteredList = this.tickers.filter((item) =>
        item.name.includes(this.filter.toUpperCase())
      );

      let maxPage;

      if (filteredList.length % 6 === 0) {
        maxPage = filteredList.length / 6 - 1;
      } else {
        maxPage = Math.floor(filteredList.length / 6);
      }

      return maxPage;
    },

    // Фильтрация списка тикеров
    filteredTickers() {
      const startItem = 6 * this.pageListTickers;
      const endItem = 6 * this.pageListTickers + 6;

      const filteredList = this.tickers.filter((item) =>
        item.name.includes(this.filter.toUpperCase())
      );

      return filteredList.slice(startItem, endItem);
    },
  },

  watch: {
    tickers(newValue) {
      const tickersName = newValue.reduce((acc, ticker) => {
        acc.push(ticker.name);
        return acc;
      }, []);

      this.tickersNameViewedList = tickersName.join();

      if (newValue.length) {
        this.updateTickersСurrency(false);
      } else {
        this.updateTickersСurrency(true);
      }
    },

    graph() {
      this.updateGraph(false);
    },

    activeItemGraph(newValue) {
      if (!newValue) {
        this.updateGraph(true);
      }
    },

    pageListTickers(newValue) {
      const filteredList = this.tickers.filter((item) =>
        item.name.includes(this.filter.toUpperCase())
      );
      let maxPage;

      if (filteredList.length % 6 === 0) {
        maxPage = filteredList.length / 6 - 1;
      } else {
        maxPage = Math.floor(filteredList.length / 6);
      }

      if (newValue < 0) {
        this.pageListTickers = 0;
      }

      if (newValue > maxPage) {
        this.pageListTickers = maxPage;
      }

      if (this.filteredTickers.length === 0) {
        this.pageListTickers = 0;
      }
    },

    filter() {
      this.pageListTickers = 0;
    },
  },

  mounted() {
    let vue = this;

    (async function loadListCryptocurrency() {
      const f = await fetch(
        `https://min-api.cryptocompare.com/data/all/coinlist?summary=true&api_key=693b7faab687442509f13b97369bf90104019f8db4ee9c1838a73ed3a600e133`
      );

      const tickersList = await f.json();

      vue.tickersNameList = Object.values(tickersList.Data).reduce(
        (acc, item) => {
          acc.push(item.Symbol);
          return acc;
        },
        []
      );
    })();

    (function loadTickersLocalStorage() {
      let ListTickers = JSON.parse(localStorage.getItem("ListTickers"));

      ListTickers = ListTickers.reduce((acc, ticker) => {
        ticker.course = "-";
        acc.push(ticker);
        return acc;
      }, []);
      if (ListTickers) {
        vue.tickers = ListTickers;
      }
    })();
  },
};
</script>

<style lang="scss">
body {
  background: #f7fafc;
}
</style>
