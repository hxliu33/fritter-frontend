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
        <section class="alerts">
            <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
    </form>
</template>

<script>
import Vue from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

Vue.component('v-select', vSelect);

export default {
    name: 'Dropdown',
    hasBody: false, //Whether or not request has a body
    url: '', //Url to submit form to
    alerts: {}, // Displays success/error messages encountered during selection change
    callback: null, //Function to run after successful form submission
    //necessary inputs: choices: [], title: '', current: '', purpose: ''
    methods: {
        async onChange(selection) {
            if (this.purpose === 'groups') {
                // send API request
                const params = {
                    method: 'GET',
                }
                this.url = `/api/groups/info/${selection.id}`;
                this.request(params);
            } else if (this.purpose === 'fonts') {
                // send API request
                const params = {
                    method: 'PATCH',
                    field: {fontId: selection.id, fontName: selection.value},
                };
                this.request(params);
                this.$store.commit('setFont', selection);
            }
        },
        async request(params) {
            //send API request
            const options = {
                method: params.method,
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin', // Sends express-session credentials with request
            }
            if (this.hasBody) {
                options.body = JSON.stringify(params.field);
            }

            try {
                const r = await fetch(this.url, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }

                if (this.purpose === 'groups') {
                    const text = await r.text();
                    const res = text ? JSON.parse(text) : {group: null};
                    if (!res.group) {
                        this.$store.commit('resetGroupInfo');
                    } else {
                        const group = {
                        id: res.group._id,
                        name: res.group.name,
                        freets: res.group.posts,
                        members: res.group.members,
                        admin: res.group.administrators,
                        isPrivate: res.group.isPrivate,
                        };
                        this.$store.commit('updateCurrentGroup', group);
                    }
                }

                if (this.callback) {
                    this.callback();
                }
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
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

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}
</style>
