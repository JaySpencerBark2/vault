<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon size="20" class="mr-2">mdi-account-edit</v-icon>
          <span class="headline">Manage Members</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row align="center">
            <v-col cols="8">
              <v-select
                v-model="selectedUserSyskey"
                :items="availableUsers"
                item-title="us_username"
                item-value="us_syskey"
                label="Add User"
                density="comfortable"
                variant="outlined"
                clearable
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" :disabled="!selectedUserSyskey" @click="addMember">Add</v-btn>
            </v-col>
          </v-row>
          <v-list class="mt-2">
            <v-list-item v-for="member in members" :key="member.us_syskey">
              <template #prepend>
                <v-icon size="20" class="mr-2 text-medium-emphasis">mdi-account-circle</v-icon>
              </template>
              <v-list-item-title>{{ member.us_username }}</v-list-item-title>
              <template #append>
                <v-tooltip text="Remove" location="bottom">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="small" variant="text" color="error" @click="removeMember(member)">
                      <v-icon size="18">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
            </v-list-item>
            <v-list-item v-if="!members.length">
              <v-list-item-title class="text-medium-emphasis text-caption">No members yet</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    groupSyskey: "",
    allUsers: [],
    members: [],
    selectedUserSyskey: null,
  }),
  computed: {
    availableUsers() {
      let memberSyskeys = this.members.map(m => m.us_syskey);
      return this.allUsers.filter(u => !memberSyskeys.includes(u.us_syskey));
    },
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },

    async fetchAllUsers() {
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

        this.allUsers = await response.json();
      } catch (error) {
        console.log(error);
      }
    },

    async fetchMembers() {
      try {
        let response = await fetch(
          `http://localhost:3000/groups/get/members/${this.groupSyskey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        this.members = await response.json();
      } catch (error) {
        console.log(error);
      }
    },

    async addMember() {
      try {
        let response = await fetch("http://localhost:3000/groups/add/member/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            gm_groupSyskey: this.groupSyskey,
            gm_userSyskey: this.selectedUserSyskey,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add member");
        }

        this.selectedUserSyskey = null;
        await this.fetchMembers();
        this.$emit("membersChanged");
      } catch (error) {
        console.log(error);
      }
    },

    async removeMember(member) {
      try {
        let response = await fetch("http://localhost:3000/groups/remove/member/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            gm_groupSyskey: this.groupSyskey,
            gm_userSyskey: member.us_syskey,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to remove member");
        }

        await this.fetchMembers();
        this.$emit("membersChanged");
      } catch (error) {
        console.log(error);
      }
    },

    async openAddMemberDialog(groupSyskey) {
      this.groupSyskey = groupSyskey;
      this.selectedUserSyskey = null;
      await this.fetchAllUsers();
      await this.fetchMembers();
      this.dialog = true;
    },
  },
};
</script>
