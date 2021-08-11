<template>
  <div class="filter flex items-start">
    <input
      type="text"
      v-model="filter"
      @keyup="changeValueFilter"
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
        @click="changeValuePageListTickers('-')"
        :class="{
          'opacity-10': pageListTickers === 0 || filteredTickers.length === 0,
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
        @click="changeValuePageListTickers('+')"
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
</template>

<script>
export default {
  name: "filterTickers",

  data: () => ({
    filter: "",
  }),

  props: {
    pageListTickers: {
      type: Number,
      required: true,
      default: 0,
    },

    maxItemsFilterTicketsList: {
      type: Number,
      required: true,
      default: 6,
    },
    filteredTickers: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  methods: {
    changeValueFilter() {
      this.$emit("changeValueFilter", this.filter);
    },

    changeValuePageListTickers(value) {
      /* eslint-disable */ 
      const newValuePageListTickers =
        value === "-"
          ? this.valuePageListTickers - 1
          : value === "+"
            ? this.valuePageListTickers + 1
            : 0;

      this.$emit("changeValuePageListTickers", newValuePageListTickers);
    },
  },

  computed: {
    valuePageListTickers() {
      return this.pageListTickers;
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 600px) {
  .filter {
    flex-direction: column;

    &__input {
      margin-bottom: 20px;
    }
  }
}
</style>