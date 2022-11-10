<!-- Form for joining groups (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'JoinGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      method: 'PUT',
      hasBody: true,
      setGroup: true,
      fields: [
        {id: 'name', label: 'Group Name', value: ''},
      ],
      title: 'Join a group (by its ID)', 
      callback: () => {
        const message = 'Successfully joined a group!';
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
            method: this.method,
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin' // Sends express-session credentials with request
        };
        try {
            const r = await fetch(`/api/groups/${this.fields[0].value}/join`, options);
            if (!r.ok) {
                // If response is not okay, we throw an error and enter the catch block
                const res = await r.json();
                throw new Error(res.error);
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