<!-- Form for getting user's groups (dropdown) -->

<script>
import Dropdown from '@/components/common/Dropdown.vue';

export default {
  name: 'GetGroupsForm',
  mixins: [Dropdown],
  data() {
    return {
      title: 'Your groups',
      choices: this.$store.state.groups,
      current: this.$store.state.group.name,
      purpose: 'groups',
      callback: () => {
        const message = `Viewing group ${this.$store.state.group.name}!`;
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>