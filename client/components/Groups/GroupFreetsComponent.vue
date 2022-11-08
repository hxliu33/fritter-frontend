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
    }
  }
};
</script>