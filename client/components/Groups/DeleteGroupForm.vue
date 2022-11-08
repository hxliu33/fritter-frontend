<!-- Form for deleting a group (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/groups/`{}`',
      method: 'DELETE',
      title: 'Delete Group',
      fields: [],
      content: 'Taking a break? See you later.',
      callback: () => {
        this.$router.push({name: 'Home'}); // Goes to Home page after signing out
        this.$store.commit('alert', {
          message: 'You are now signed out!', status: 'success'
        });
      }
    };
  }
};
</script>