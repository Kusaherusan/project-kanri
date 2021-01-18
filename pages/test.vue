<template>
    <v-data-table :headers="headers" :items="desserts" item-key="name" class="elevation-1 pa-6">
        <template v-slot:top>

            <!-- v-container, v-col and v-row are just for decoration purposes. -->
            <v-container fluid>
                <v-row>

                    <v-col cols="6">
                        <v-row class="pa-6">
                            <!-- Filter for dessert name-->
                            <v-text-field v-model="dessertFilterValue" type="text" label="Name"></v-text-field>
                        </v-row>
                    </v-col>

                    <v-col cols="6">
                        <v-row class="pa-6">
                            <!-- Filter for calories -->
                            <v-select
                                    :items="caloriesList"
                                    v-model="caloriesFilterValue"
                                    label="Calories"
                            ></v-select>
                        </v-row>
                    </v-col>

                </v-row>
            </v-container>

        </template>
    </v-data-table>
</template>

<script>
  // Table info.

  export default {
    data() {
      return {
        // We need some values for our select.
        caloriesList: [
          {text: "All", value: null},
          {text: "Only 237", value: 237},
          {text: "Only 305", value: 305},
        ],
        // Filter models.
        dessertFilterValue: '',
        caloriesFilterValue: null,
        // Table data.
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%',
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
        ],
      }
    },
    computed: {
      headers() {
        return [
          {
            text: 'Dessert (100g serving)',
            align: 'left',
            sortable: false,
            value: 'name',
            filter: this.nameFilter,
          },
          {
            text: 'Calories',
            value: 'calories',
            filter: this.caloriesFilter,
          },
          {text: 'Fat (g)', value: 'fat'},
          {text: 'Carbs (g)', value: 'carbs'},
          {text: 'Protein (g)', value: 'protein'},
          {text: 'Iron (%)', value: 'iron'},
        ]
      },
    },
    methods: {
      /**
       * Filter for dessert names column.
       * @param value Value to be tested.
       * @returns {boolean}
       */
      nameFilter(value) {
        // If this filter has no value we just skip the entire filter.
        if (!this.dessertFilterValue) {
          return true;
        }
        // Check if the current loop value (The dessert name)
        // partially contains the searched word.
        return value.toLowerCase().includes(this.dessertFilterValue.toLowerCase());
      },
      /**
       * Filter for calories column.
       * @param value Value to be tested.
       * @returns {boolean}
       */
      caloriesFilter(value) {
        // If this filter has no value we just skip the entire filter.
        if (!this.caloriesFilterValue) {
          return true;
        }
        // Check if the current loop value (The calories value)
        // equals to the selected value at the <v-select>.
        return value === this.caloriesFilterValue;
      }
    }
  }
</script>