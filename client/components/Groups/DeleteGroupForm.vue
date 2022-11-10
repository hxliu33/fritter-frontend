<!-- Form for deleting a group (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      url: `/api/groups/${this.$store.state.group.id}`,
      method: 'DELETE',
      title: 'Delete Group',
      fields: [],
      content: 'Deleting your account is permanent and irreversible. Proceed only if you understand these consequences.',
      callback: () => {
        this.$store.commit('refreshGroups');
        this.$router.push({name: 'Home'}); // Goes to Home page after signing out
        this.$store.commit('alert', {
          message: 'Your group has been deleted!', status: 'success'
        });
      }
    };
  }
};
</script>