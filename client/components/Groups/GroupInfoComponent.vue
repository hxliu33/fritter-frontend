<!-- Component for viewing a group's information (ID, name, admin, members, privacy setting) -->

<template>
    <main>
        <h3>Group Info</h3>
        <article>
            <section>
                <h4>Group ID: </h4>
                <p>{{ this.$store.state.group.id }}</p>
                <h4>Group Name: </h4>
                <p>{{ this.$store.state.group.name }}</p>
                <h4>Privacy Setting: </h4>
                <p>{{this.$store.state.group.isPrivate ? 'Private' : 'Public'}}</p>
            </section>
            <section>
                <h4>Members: </h4>
                <ul>
                    <li 
                        v-for="member in this.$store.state.group.members"
                    >{{member}}</li>
                </ul>
            </section>
            <section>
                <h4>Administrators: </h4>
                <ul>
                    <li 
                        v-for="admin in this.$store.state.group.admin"
                    >{{admin}}</li>
                </ul>
            </section>
        </article>
    </main>
</template>

<script>

export default {
  name: 'GroupInfoComponent',
};
</script>

<style scoped>
main {
    border: 1px solid #111;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    margin-bottom: 14px;
    position: relative;
}

main h3,
main > * {
  margin: 0 0;
}

main article {
    flex-direction: row;
    display: flex;
    justify-content:space-between;
}

article section {
    flex-direction: column;
}
</style>