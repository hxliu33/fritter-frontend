<!-- Form for adding a group member (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddMemberForm',
  mixins: [BlockForm],
  data() {
    return {
      url: `/api/groups/${this.$store.state.group.id}/member`,
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username to Add', value: ''},
      ],
      title: 'Add a group member', 
      callback: () => {
        this.$store.commit('addGroupMember', fields[0].value);
        const message = 'Successfully added a group member!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>