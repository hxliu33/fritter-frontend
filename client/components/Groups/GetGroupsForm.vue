<!-- Form for getting suggested groups to join (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'GetGroupsForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/groups/member',
      method: 'GET',
      title: 'Get groups',
      fields: [],
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
            this.$store.commit('updateGroups');
        } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    }
  }
};
</script>