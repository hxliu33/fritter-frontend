<!-- Form for getting suggested groups to join (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'SuggestedGroupsForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/groups/join',
      method: 'GET',
      title: 'Get suggested groups',
      fields: [],
      content: 'Wondering which groups to join?',
      display: false,
    };
  },
  methods: {
    async submit() {
        try {
            const r = await fetch(this.url);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.$store.commit('updateSuggestedGroups', res.groups);
        } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    }
  }
};
</script>