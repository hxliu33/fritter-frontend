<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
    <section>
      <header>
        <h2>Display settings</h2>
      </header>
      <FontSwitchForm />
    </section>
    <section>
      <header>
        <h2>Pause settings</h2>
      </header>
      <PauseForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import FontSwitchForm from '@/components/Account/FontSwitchForm.vue';
import PauseForm from '@/components/Account/PauseForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    FontSwitchForm,
    PauseForm,
  },
};
</script>
