<!-- Page for groups and group management -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <header>
          <h2>Groups for @{{ $store.state.username }}</h2>
        </header>
      </section>
      <section
        v-if="$store.state.getters.isGroupAdmin"
      >
        <CreateGroupFreetForm />
        <section>
            <h3>Group Freets</h3>
            <section
            v-if="$store.state.group.freets.length"
            >
            <GroupFreetComponent
                v-for="freet in $store.state.group.freets"
                :key="freet.id"
                :freet="freet"
            />
            </section>
            <article
                v-else
            >
            <h4>No freets found.</h4>
            </article>
        </section>
      </section>
    </main>
  </template>
  

<script>
import GroupFreetsComponent from '@/components/Groups/GroupFreetsComponent.vue';
import CreateGroupFreetForm from '@/components/Groups/CreateGroupFreetForm.vue';

export default {
  name: 'GroupsPage',
  components: {GroupFreetsComponent, CreateGroupFreetForm},
  data() {
    return {
        timer: null,
        lastTime: null,
    }
  },
  beforeMount() {
    this.timer = $store.state.sessionTimeElapsed;
    this.lastTime = Date.now();
  },
  //get group info etc in mounted
  mounted() {
    // this.$refs.getGroupFreetsForm.submit();
    this.timer = setInterval(() => {
        const timeElapsed = this.$store.state.sessionTimeElapsed + Date.now() - this.lastTime;
        //send PATCH request
        this.$store.commit('updateTimeElapsed', timeElapsed);
        this.lastTime = Date.now();
    }, 180000); // every minute
  },

  beforeDestroy() {
    const timeElapsed = this.$store.state.sessionTimeElapsed + Date.now() - this.lastTime;
    //send PATCH request
    clearInterval(this.timer);
    this.lastTime = null;
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}
</style>