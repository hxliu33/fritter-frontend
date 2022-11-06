<!-- Reusable component representing a dropdown selector -->

<template>
    <form>
        <h3>{{ title }}</h3>
        <v-select
            :options="choices"
            label="value"
            :clearable="false"
            :placeholder="current"
            @input="onChange"
        ></v-select>
    </form>
</template>

<script>
import Vue from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

Vue.component('v-select', vSelect);

export default {
    name: 'Dropdown',
    //necessary inputs: choices: [], title: '', stored: '', purpose: ''
    methods: {
        onChange(value) {
            if (this.purpose === 'groups') {
                // send API request
                // commit groups list change to store
            } else if (this.purpose === 'fonts') {
                // send API request
                this.$store.commit('setFont', value);
            }
        },
        async request(params) {
            //send API request
        }
    },
}
</script>
  

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}
</style>
