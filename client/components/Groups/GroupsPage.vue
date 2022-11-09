<!-- Page for groups and group management -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <header>
          <h2>Groups for @{{ $store.state.username }}</h2>
        </header>
        <GetGroupsForm />
        <GroupInfoComponent
          v-if="$store.state.group.id"
        />
      </section>
      <CreateGroupForm />
      <section class="actions"
        v-if="$store.state.group.id"
      >
        <AddMemberForm />
        <AddAdminForm
          v-if="$store.getters.isGroupAdmin"
        />
        <ChangePrivacyForm
          v-if="$store.getters.isGroupAdmin"
        />
      </section>
      <section
        v-if="$store.state.group.id"
      >
        <CreateGroupFreetForm />
        <section>
            <h3>Group Freets</h3>
            <section
            v-if="$store.state.group.freets.length"
            >
            <GroupFreetsComponent
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
import GetGroupsForm from '@/components/Groups/GetGroupsForm.vue';
import GroupInfoComponent from '@/components/Groups/GroupInfoComponent.vue';
import CreateGroupForm from '@/components/Groups/CreateGroupForm.vue';
import AddMemberForm from '@/components/Groups/AddMemberForm.vue';
import AddAdminForm from '@/components/Groups/AddAdminForm.vue';
import ChangePrivacyForm from '@/components/Groups/ChangePrivacyForm.vue';
import GroupFreetsComponent from '@/components/Groups/GroupFreetsComponent.vue';
import CreateGroupFreetForm from '@/components/Groups/CreateGroupFreetForm.vue';

export default {
  name: 'GroupsPage',
  components: {
    GetGroupsForm, 
    GroupInfoComponent,
    CreateGroupForm, 
    AddMemberForm,
    AddAdminForm,
    ChangePrivacyForm,
    GroupFreetsComponent, 
    CreateGroupFreetForm,
  },
  data() {
    return {
        timer: null,
        lastTime: null,
    }
  },
  async beforeMount() {
    this.lastTime = Date.now();
  },
  //get group info etc in mounted
  mounted() {
    this.$store.commit('refreshGroups');
    this.timer = setInterval(() => {
        const timeElapsed = this.$store.state.sessionTimeElapsed + Date.now() - this.lastTime;
        this.$store.commit('setTimeElapsed', timeElapsed);
        this.lastTime = Date.now();
    }, 2000); // every 2 seconds
  },

  beforeDestroy() {
    const timeElapsed = this.$store.state.sessionTimeElapsed + Date.now() - this.lastTime;
    this.$store.commit('setTimeElapsed', timeElapsed);
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

section .actions {
  display: flex;
  flex-direction: row;
}
</style>