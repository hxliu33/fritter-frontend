<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFreetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/freets',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'isAnon', label: 'Check this box if you would like your freet to be anonymous', value: false}
      ],
      title: 'Create a freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
