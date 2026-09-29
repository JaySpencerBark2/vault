<route lang="yaml">
meta:
  requiresAdmin: true
</route>

<template>
  <div class="dashboard-wrapper">
    <v-toolbar flat class="mb-4 dashboard-toolbar" density="comfortable">
      <v-toolbar-title class="text-h6 d-flex align-center">
        <v-icon size="20" class="mr-2">mdi-account-multiple</v-icon>
        Users
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" variant="flat" @click="createUser">New User</v-btn>
    </v-toolbar>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card elevation="2">
            <v-data-table :headers="usersHeader" :items="users" density="comfortable" class="vault-table">
              <template #item.us_username="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="20" class="mr-2 text-medium-emphasis">mdi-account-circle</v-icon>
                  {{ item.us_username }}
                </div>
              </template>
              <template #item.admin="{ item }">
                <v-switch
                  :model-value="item.admin"
                  color="primary"
                  density="compact"
                  hide-details
                  @update:model-value="v => toggleAdmin(item, v)"
                ></v-switch>
              </template>
              <template #item.actions="{ item }">
                <v-tooltip text="Delete User" location="bottom">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="small" variant="text" color="error" @click="deleteUser(item)">
                      <v-icon size="18">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
              <template #no-data>
                <div class="pa-4 text-medium-emphasis text-center text-caption">No users yet</div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <create-user-dialog ref="createUserDialog" @userCreated="handleUserCreated"></create-user-dialog>
  </div>
</template>

<script>
import CreateUserDialog from "@/components/CreateUserDialog.vue";

export default {
  components: {
    CreateUserDialog,
  },
  data: () => {
    return {
      users: [],
      usersHeader: [
        { title: "Username", value: "us_username" },
        { title: "Admin", value: "admin" },
        { title: "", value: "actions" },
      ],
    };
  },

  methods: {
    createUser() {
      this.$refs.createUserDialog.openDialog();
    },

    async fetchUsers() {
      try {
        let response = await fetch("http://localhost:3000/users/get/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        this.users = await response.json();
      } catch (error) {
        console.log(error);
      }
    },

    async toggleAdmin(user, admin) {
      try {
        let response = await fetch(
          `http://localhost:3000/users/toggle/admin/${user.us_syskey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ admin }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        await this.fetchUsers();
      } catch (error) {
        console.log(error);
      }
    },

    async deleteUser(user) {
      try {
        let response = await fetch(
          `http://localhost:3000/users/delete/${user.us_syskey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        await this.fetchUsers();
      } catch (error) {
        console.log(error);
      }
    },

    async handleUserCreated() {
      this.$toast.open({
        message: "User created successfully!",
        type: "success",
        color: "success",
        position: "top-right",
        duration: 3000,
        closeOnClick: true,
        dismissible: true,
      });
      await this.fetchUsers();
    },
  },
  async mounted() {
    await this.fetchUsers();
  },
};
</script>
<style scoped>
.dashboard-wrapper {
  padding-bottom: 48px;
}
.dashboard-toolbar {
  background: linear-gradient(90deg, var(--v-theme-primary) 0%, var(--v-theme-primary-darken-1) 100%);
  color: white;
  border-radius: 8px;
}
.vault-table :deep(tbody tr:hover) {
  background: rgba(var(--v-theme-primary), 0.04);
}
@media (max-width: 600px) {
  .dashboard-toolbar { border-radius: 0; }
}
</style>
