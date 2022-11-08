<!-- Component for creating freets in a specific Group -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateGroupFreetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/freets',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''}
      ],
      title: 'Create a freet in this group',
      callback: () => {
        // try {
        //     const r = await fetch(`/api/groups/${$store.state.group.id}/post/remove`, options);
        //     if (!r.ok) {
        //         const res = await r.json();
        //         throw new Error(res.error);
        //     }

        //     this.$store.commit('refreshGroupFreets');
        // } catch (e) {
        //     this.$set(this.alerts, e, 'error');
        //     setTimeout(() => this.$delete(this.alerts, e), 3000);
        // }
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  },
    methods: {
        async submit() {
        /**
            * Submits a form with the specified options from data().
            */
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin' // Sends express-session credentials with request
        };
        options.body = JSON.stringify(Object.fromEntries(
            this.fields.map(field => {
                const {id, value} = field;
                field.value = '';
                return [id, value];
            })
        ));

        try {
            const r = await fetch(this.url, options);
            if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
                const res = await r.json();
                throw new Error(res.error);
            }
            const text = await r.text();
            const res = text ? JSON.parse(text) : {freetId: null};

            const params = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin', // Sends express-session credentials with request
                body: JSON.stringify({freetId: res.freet._id}),
            }

            r = await fetch(`/api/groups/${$store.state.group.id}/post`, params);
            if(!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
            }

            $store.commit('refreshGroupFreets');

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