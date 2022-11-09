<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <label :for="field.id">{{ field.label }}:</label>
        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else-if="field.id === 'password'"
          type="password"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else-if="field.id === 'minutes'"
          type="number"
          :min="1"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else-if="field.id === 'isAnon' || field.id === 'isPrivate'"
          type="checkbox"
          :name="field.id"
          v-model="field.value"
        />
        <input 
          v-else
          type="text"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button
      type="submit"
    >
      {{ title }}
    </button>
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

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      setThreshold: false, // Whether or not the pause threshold should be updated after form submission
      createPause: false, // Whether or not the pause setting should be created
      createFont: false, // Whether or not the font setting should be created
      getThreshold: false, // Whether or not the pause threshold needs to be fetched
      getFont: false, // Whether or not the font needs to be fetched
      setGroup: false, // Whether or not the stored group should be set
      addToGroup: false, // Whether or not to add a post to a group
      alerts: {}, // Displays success/error messages encountered during form submission
      // returnId: false, // Whether or not to return created freet's ID
      callback: null, // Function to run after successful form submission
    };
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
        }

        if (this.refreshFreets) {
          this.$store.commit('refreshFreets');
        }

        if (this.setThreshold) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {pause: null};
          this.$store.commit('setPauseThreshold', res.pause ? res.pause.threshold : null);
        }

        if (this.setGroup) {
          const text = JSON.parse(await r.text());
          const group = {
            id: text.group._id,
            name: text.group.name,
            freets: text.group.posts,
            members: text.group.members,
            admin: text.group.administrators,
            isPrivate: text.group.isPrivate,
          };
          this.$store.commit('updateCurrentGroup', group);
        }

        if (this.createPause) {
          const options = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin', // Sends express-session credentials with request
            body: JSON.stringify({threshold: 120}),
          };

          const res = await fetch('/api/pause', options);
          if (!res.ok) {
            const errorRes = await res.json();
            throw new Error(errorRes.error);
          }
          const text = await res.text();
          const info = text ? JSON.parse(text) : {pause: null};
          this.$store.commit('setPauseThreshold', info.pause ? info.pause.threshold : null);
          this.$store.commit('setTimeElapsed', 0);
        }

        if (this.createFont) {
          const options = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin', // Sends express-session credentials with request
          };
          const res = await fetch('/api/font', options);
          if (!res.ok) {
            const errorRes = await res.json();
            throw new Error(errorRes.error);
          }
          const text = JSON.parse(await res.text());
          const font = {id: text.fontSwitch.currentFontId, value: text.fontSwitch.currentFontName};
          this.$store.commit('setFont', font);
        }

        if (this.getThreshold) {
          const options = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin', // Sends express-session credentials with request
          };
          const res = await fetch('/api/pause', options);
          if (!res.ok) {
            const errorRes = await res.json();
            throw new Error(errorRes.error);
          }
          const text = JSON.parse(await res.text());
          this.$store.commit('setPauseThreshold', text ? text.threshold : null);
        }

        if (this.getFont) {
          const options = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin', // Sends express-session credentials with request
          };
          const res = await fetch('/api/font', options);
          if (!res.ok) {
            const errorRes = await res.json();
            throw new Error(errorRes.error);
          }
          const text = JSON.parse(await res.text());
          const font = {id: text.currentFontId, value: text.currentFontName};
          this.$store.commit('setFont', font);
        }

        if (this.addToGroup) {
          const options = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin', // Sends express-session credentials with request
          }

          const text = await r.text();
          const info = text ? JSON.parse(text) : {freet: null};
          options.body = info.freet ? info.freet._id : null;

          const res = await fetch(`/api/groups/${$store.state.group.id}/post`, options);
          if (!res.ok) {
            const errorRes = await res.json();
            throw new Error (errorRes.error);
          }

          this.$store.commit('refreshGroupFreets');
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
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

textarea {
   font-family: inherit;
   font-size: inherit;
}
</style>
