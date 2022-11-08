<template>
  <div id="app" class="fonts">
    <div
      :class="$store.state.font.id"
    >
      <header>
        <NavBar />
      </header>
      <router-view />
      <button id="show-modal" @click="showModal = true">Show Modal</button>
      <!-- use the modal component, pass in the prop -->
      <modal v-if="showModal" @close="showModal = false">
        <!--
        you can use custom content here to overwrite
        default content
        -->
        <h3 slot="header">custom header</h3>
      </modal>
    </div>

    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                default header
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                default body
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                default footer
                <button class="modal-default-button" @click="$emit('close')">
                  OK
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';

// register modal component
Vue.component("modal", {template: "#modal-template"});


export default {
  name: 'App',
  components: {NavBar},
  // data( {
  //   showModal: false,
  // })
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/users/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const user = res.user;
      this.$store.commit('setUsername', user ? user.username : null);
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
}

main {
  padding: 0 5em 5em;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

 .modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.alerts {
    position: absolute;
    z-index: 99;
    bottom: 0;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 10%);
    width: 100%;
    text-align: center;
}

.alerts article {
    border-radius: 5px;
    padding: 10px 20px;
    color: #fff;
}

.alerts p {
    margin: 0;
}

.alerts .error {
    background-color: rgb(166, 23, 33);
}

.alerts .success {
    background-color: rgb(45, 135, 87);
}

.fonts .arial {
    font-family: Arial, Helvetica, sans-serif;
}

.fonts .cambria {
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.fonts .courier-new {
    font-family: 'Courier New', Courier, monospace;
}

.fonts .georgia {
    font-family: Georgia, 'Times New Roman', Times, serif;
}

.fonts .gill-sans {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.fonts .impact {
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}

.fonts .lucida-sans {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.fonts .times-new-roman {
    font-family:'Times New Roman', Times, serif;
}

.fonts .trebuchet-ms {
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.fonts .verdana {
    font-family: Verdana, Geneva, Tahoma, sans-serif; 
}
</style>
