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

        <section>
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
        </section>

        <graph-tickers
          :activeItemGraph="activeItemGraph"
          @hideGraph="hideGraph"
        />
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
import graphTickers from "./components/graphTickers.vue";

export default {
  name: "App",

  components: {
    addTicker,
    filterTickers,
    graphTickers,
  },

  data: () => ({
    filter: "",

    activeItemGraph: false,

    tickers: [],

    pageListTickers: 0,
  }),

  methods: {
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

    // обновление номера страницы элементов
    updatePageListTickers(newValue) {
      this.pageListTickers = newValue;
    },

    // смена элемента для отслеживания с помощью графика
    changeActiveTicket(item) {
      this.activeItemGraph = item;
    },

    // Прекращение отображение графика
    hideGraph(closed) {
      if (closed) {
        this.activeItemGraph = false;
      }
    },
  },

  computed: {
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
  },
};
</script>

<style lang="scss">
body {
  background: #f7fafc;
}
</style>
