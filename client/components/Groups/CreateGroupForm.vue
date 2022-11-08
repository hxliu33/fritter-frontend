<!-- Form for creating groups (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/groups',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'name', label: 'Group Name', value: ''},
        {id: 'isPrivate', label: 'Check this box if you would like your group to be private', value: ''}
      ],
      title: 'Create a group', 
      //set group in store?
      callback: () => {
        const message = 'Successfully created a group!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>