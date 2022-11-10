<!-- Form for adding a group administrator (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddAdminForm',
  mixins: [BlockForm],
  data() {
    return {
      url: `/api/groups/${this.$store.state.group.id}/admin`,
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username to Add', value: ''},
      ],
      title: 'Add a group administrator', 
      callback: () => {
        this.$store.commit('refreshCurrentGroup');
        const message = 'Successfully added a group administrator!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>