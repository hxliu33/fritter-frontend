<template >
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
            <div class="modal-container">

                <div class="modal-header">
                    <h3>
                        Wait!
                    </h3>
                </div>

                <div class="modal-body">
                    You've been scrolling for a while now... 
                    Consider taking a break for a little.
                    We'll miss you, but we understand!
                </div>

                <div class="modal-footer">
                    <button class="modal-default-button" @click="logout">
                    Close Fritter
                    </button>
                    <button class="modal-button" @click="ignore">
                    Ignore and Reset
                    </button>
                </div>
            </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue';
// register modal component
Vue.component("modal", {template: "#modal-template"});

export default {
    name: 'PopUp',
    data() {
        return {
            callback: () => {
                this.$store.commit('setFont', {id: 'verdana', value: 'Verdana'}); //reset font
                this.$store.commit('setTimeElapsed', 0); //reset time elapsed
                this.$store.commit('setPauseThreshold', null); //remove pause threshold    
                this.$store.commit('setUsername', null);
                this.$router.push({name: 'Home'});
                this.$store.commit('alert', {
                    message: 'You are now signed out!', status: 'success'
                });
            }, 
        }
    },
    methods: {
        ignore() {
            /**
             * Ignores warning by closing popup and resetting time elapsed
             */
            this.$emit('close');
            this.$store.commit('setTimeElapsed', 0);
        },
        async logout() {
            /**
             * Logs user out of account
             */
            this.$emit('close');
            const options = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin', // Sends express-session credentials with request
            };
            
            try {
                const r = await fetch('/api/users/session', options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }

                if (this.callback) {
                    this.callback();
                }

            } catch (e) {
                this.$store.commit('alert', {
                    message: e, status: 'error'
                })
            }
        },
    }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 30rem;
  margin: 0px auto;
  padding: 2rem 2rem;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin: 1rem 1rem;
  color: #42b983;
}

.modal-body {
  margin: 1rem 1rem;
}

.modal-footer {
  margin: 0.5rem auto;
  padding: 0.2rem 0.2rem;
  text-align: center;
}

.modal-default-button {
  align-items: flex-start;
  background-color: blue;
  color: #fff;
  margin-right: 1rem;
  padding: 1rem;
  font-weight: bold;
}

.modal-button {
  align-items: flex-end;
  background-color: lightsteelblue;
  color: #fff;
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

</style>