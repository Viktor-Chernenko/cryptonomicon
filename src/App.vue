<template>
  <div id="app">
    <div class="container mx-auto flex flex-col items-center p-4">
      <div class="container">
        <add-ticker :tickers="tickers" @addNewTicker="addTicker" />
        <filter-tickers
          :pageListTickers="pageListTickers"
          :maxItemsFilterTicketsList="maxItemsFilterTicketsList"
          :filteredTickers="filteredTickers"
          @changeValueFilter="updateFilter"
          @changeValuePageListTickers="updatePageListTickers"
        />

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
                'bg-red-100': item.isNoValidation === true,
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
        <section
          v-if="activeItemGraph && activeItemGraph.isNoValidation != true"
          class="relative"
        >
          <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
            {{ activeItemGraph.name }} - USD
          </h3>
          <div
            class="flex items-end border-gray-600 border-b border-l h-64"
            ref="graph"
          >
            <div
              v-for="(item, index) in normalizeGraph"
              class="bg-purple-800 border h-40"
              :key="index"
              :style="{ height: `${item}%`, width: `${graphElementWidth}px` }"
              graphElementWidth
              ref="graphElement"
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
import {
  socketSendAddTickers,
  updateTickers,
  socketSendRemoveTickers,
  tickersSocketClosed,
} from "./api/tickers";

import addTicker from "./components/addTicker.vue";
import filterTickers from "./components/filterTickers.vue";

export default {
  name: "App",

  components: {
    addTicker,
    filterTickers,
  },

  data: () => ({
    filter: "",

    maxGraphElement: 1,
    graphElementWidth: 36,
    activeItemGraph: null,

    tickers: [],

    pageListTickers: 0,
  }),

  methods: {
    // удаление тикера
    removeTicker(tickerId) {
      let removeItem;
      this.tickers = this.tickers.filter((item) => {
        if (item.id == tickerId) {
          removeItem = item;
        }
        return item.id != tickerId;
      });

      if (this.activeItemGraph?.id === tickerId) {
        (this.graph = []), (this.activeItemGraph = null);
      }

      localStorage.setItem("ListTickers", JSON.stringify(this.tickers));

      socketSendRemoveTickers(removeItem);
    },

    // обновление фильтра
    updateFilter(newValue) {
      this.filter = newValue;
    },

    updatePageListTickers(newValue) {
      this.pageListTickers = newValue;
    },

    // смена элемента для отслеживания с помощью графика
    changeActiveTicket(item) {
      this.activeItemGraph = item;
      this.graph = [];
      this.graph.push(this.activeItemGraph.course);
    },

    // вычисление максимального числа элементов графика
    calculatedMaxElementGraph() {
      if (!this.$refs.graph) {
        return;
      }

      this.maxGraphElement = Math.floor(
        this.$refs.graph.clientWidth / this.graphElementWidth
      );
      while (this.graph.length > this.maxGraphElement) {
        this.graph.shift();
      }
    },

    // добавление тикера
    addTicker(name) {
      if (name) {
        const newTicker = {
          id: Math.random(),
          name: name.toUpperCase(),
          course: "-",
        };

        this.tickers.unshift(newTicker);
        socketSendAddTickers(newTicker);
      }

      localStorage.setItem("ListTickers", JSON.stringify(this.tickers));
    },
  },

  computed: {
    // Нормализация высоты элементов графика
    normalizeGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      return this.graph.map((price) => {
        if (maxValue === minValue) {
          return 50;
        }

        return 50 + ((price - minValue) * 50) / (maxValue - minValue);
      });
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
      if (newValue && newValue.length) {
        updateTickers(this.tickers);
      }

      if (newValue && !newValue.length) {
        tickersSocketClosed();
      }
    },

    activeItemGraph() {
      this.graph = [];
      this.$nextTick(function () {
        this.calculatedMaxElementGraph();
      });
    },

    "activeItemGraph.course"(newValue) {
      this.graph.push(newValue);
      while (this.graph.length > this.maxGraphElement) {
        this.graph.shift();
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

    (function loadTickersLocalStorage() {
      let ListTickers = JSON.parse(localStorage.getItem("ListTickers"));

      if (ListTickers) {
        ListTickers = ListTickers.reduce((acc, ticker) => {
          ticker.course = "-";
          acc.push(ticker);
          delete ticker["isNoValidation"];
          delete ticker["thereIsNoValidationToUSD"];

          return acc;
        }, []);
        if (ListTickers) {
          vue.tickers = ListTickers;
          ListTickers.forEach((ticker) => {
            socketSendAddTickers(ticker);
          });
        }
      }
    })();

    window.addEventListener("resize", this.calculatedMaxElementGraph);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.calculatedMaxElementGraph);
  },
};
</script>

<style lang="scss">
body {
  background: #f7fafc;
}
</style>
