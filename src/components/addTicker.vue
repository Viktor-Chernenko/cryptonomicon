<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="tickerName"
            type="text"
            @keyup="hintsNamesCryptoCurrencyAdding()"
            @keyup.enter="addNewTicker"
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
            @click="addNewTicker"
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
      @click="addNewTicker"
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
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
      "
    >
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
</template>

<script>
export default {
  name: "addTicker",

  data: () => ({
    tickerName: "",
    tickersNameListHints: [],
    tickersNameList: [],
  }),

  props: {
    tickers: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  methods: {
    addNewTicker() {
      if (!this.messageAboutPreviouslyAddedTicker) {
        this.$emit("addNewTicker", this.tickerName);
        this.tickersNameListHints = [];
        this.tickerName = null;
      }
    },

    // Подсказки имён криптовалюты при вводе в input
    hintsNamesCryptoCurrencyAdding() {
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
    messageAboutPreviouslyAddedTicker() {
      if (!this.tickerName) {
        return false;
      }
      return this.tickers.some((item) => {
        return item.name === this.tickerName.toUpperCase();
      });
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
  },
};
</script>
