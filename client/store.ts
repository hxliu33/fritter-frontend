import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    groups: [], // all of a user's group IDs and names
    group: { // data on the users current group
      id: '',
      name: '',
      freets: [],
      members: [],
      admin: [],
      isPrivate: null,
    },
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    font: null, // current font the user is viewing content in
    sessionTimeElapsed: 0, // amount of time passed since the user entered Freets or Groups pages
    pauseThreshold: null, // amount of time in minutes before the user gets a pop-up to stop
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateCurrentGroup(state, newGroup) {
      /**
       * Update the user's most recently viewed group.
       * @param groupId - GroupId to set as most recent
       */
      state.group = {
        id: newGroup._id,
        name: newGroup.name,
        freets: newGroup.posts,
        members: newGroup.members,
        admin: newGroup.administrators,
        isPrivate: newGroup.isPrivate,
      };
    },
    resetGroupInfo(state) {
      /**
       * Update the stored group info.
       * @param newGroup - Updates group's members, admin, and privacy info in store
       */
      state.group = {
        id: '',
        name: '',
        freets: [],
        members: [],
        admin: [],
        isPrivate: null,
      };
    },
    addGroupMember(state, member) {
      state.group.members.push(member);
    },
    addGroupAdmin(state, administrator) {
      state.group.admin.push(administrator);
    },
    updateGroupPrivacy(state, isPrivate) {
      /** 
       * Update the stored current group's privacy setting.
       */
      state.group.isPrivate = isPrivate;
    },
    updateGroupFreets(state, freets) {
      /**
       * Update the stored freets to the provided group freets.
       * @param freets - Freets to store
       */
      state.group.freets = freets;
    },
    updateGroups(state, groups) {
      state.groups = groups.map((group) => {
        return {id: group._id, value: group.name};
      });
    },
    setPauseThreshold(state, threshold) {
      /**
       * Update the stored minimum pause threshold to the provided number.
       * @param threshold - Pause threshold in minutes
       */
      state.pauseThreshold = threshold;
    },
    setTimeElapsed(state, time) {
      /**
       * Update the session time elapsed
       * @param time - Time elapsed of user on Groups or Freets pages
       */
      state.sessionTimeElapsed = time;
    },
    setFont(state, font) {
      /**
       * Update the stored font to the specified one.
       * @param font - new font to set
       */
      state.font = font;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshGroupFreets(state) {
      /**
       * Request the server for the currently available freets in the group.
       */
      const url = `/api/groups/${state.group.id}`;
      const res = await fetch(url).then(async r => r.json());
      state.group.freets = res.group.posts;
    },
    async refreshGroups(state) {
      /**
       * Request the server for all the groups the user is a member of
       */
      const url = '/api/groups/member';
      const res = await fetch(url).then(async r => r.json());
      state.groups = res.map((group) => {
        return {id: group._id, value: group.name};
      }); 
    },
  },
  getters: {
    groupAdminUsernames: state => {
      return state.group.admin.map(a => a.username);
    },
    isGroupAdmin: (state, getters) => {
      return getters.groupAdminUsernames.includes(state.username);
    },
    shouldPause: state => {
      if (!state.pauseThreshold) {
        return false;
      }
      return state.sessionTimeElapsed >= state.pauseThreshold * 180000; //pause threshold converted to ms
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
