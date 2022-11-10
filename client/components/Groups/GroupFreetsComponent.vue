<!-- Component for viewing all freets in a specific Group -->

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'GroupFreetComponent',
  mixins: [FreetComponent],
  methods: {
    async deleteFreet() {
        /**
         * Removes this freet from the group and deletes it.
         */
        const params = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin', // Sends express-session credentials with request
            body: JSON.stringify({freetId: this.freet._id}),
            url: `/api/groups/${$store.state.group.id}/post/remove`,
            callback: () => {
                this.$store.commit('alert', {
                    message: 'Successfully deleted freet!', status: 'success'
                });
            }
        }

        this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(params.url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshGroupFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>