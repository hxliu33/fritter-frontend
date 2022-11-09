<!-- Form for updating pause threshold setting -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'PauseForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/pause/threshold',
      method: 'PATCH',
      hasBody: true,
      setThreshold: true,
      title: 'Update minimum pause threshold (minutes)',
      fields: [
        {id: 'minutes', label: 'Threshold', value: this.$store.state.pauseThreshold},
      ],
      callback: () => {
        const message = 'Successfully changed threshold!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>