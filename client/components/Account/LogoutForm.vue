<!-- Form for signing out (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LogoutForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'DELETE',
      setUsername: true,
      title: 'Sign out',
      fields: [],
      content: 'Taking a break? See you later.',
      callback: () => {
        this.$store.commit('setFont', {id: 'verdana', value: 'Verdana'}); //reset font
        this.$store.commit('updateGroups', []);
        this.$store.commit('resetGroupInfo');
        this.$store.commit('setTimeElapsed', 0); //reset time elapsed
        this.$store.commit('setPauseThreshold', null); //remove pause threshold
        this.$router.push({name: 'Home'}); // Goes to Home page after signing out
        this.$store.commit('alert', {
          message: 'You are now signed out!', status: 'success'
        });
      }
    };
  }
};
</script>
