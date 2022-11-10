<!-- Form for changing a group's privacy setting (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangePrivacyForm',
  mixins: [BlockForm],
  data() {
    return {
      url: `/api/groups/${this.store.state.group.id}?isPrivate=${this.fields.value}`,
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'isPrivate', label: 'Check this box if you would like your group to be private', value: ''},
      ],
      title: 'Change the group\'s privacy setting', 
      callback: () => {
        this.$store.commit('refreshCurrentGroup');
        const message = 'Successfully changed the group\'s privacy setting!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>