<route lang="yaml">
meta:
  requiresAdmin: true
</route>

<template>
  <div class="dashboard-wrapper">
    <v-toolbar flat class="mb-4 dashboard-toolbar" density="comfortable">
      <v-toolbar-title class="text-h6 d-flex align-center">
        <v-icon size="20" class="mr-2">mdi-account-group</v-icon>
        Groups
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" variant="flat" @click="createGroup">New Group</v-btn>
    </v-toolbar>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card elevation="2">
            <v-data-table :headers="groupsHeader" :items="groups" density="comfortable" class="vault-table">
              <template #item.gr_groupName="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="20" class="mr-2 text-medium-emphasis">mdi-account-group-outline</v-icon>
                  {{ item.gr_groupName }}
                </div>
              </template>
              <template #item.members="{ item }">
                <v-chip size="small" color="primary" variant="tonal" label>
                  {{ memberCounts[item.gr_groupSyskey] ?? 0 }}
                </v-chip>
              </template>
              <template #item.actions="{ item }">
                <v-tooltip text="Manage Members" location="bottom">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon size="small" variant="text" color="primary" @click="manageMembers(item)">
                      <v-icon size="18">mdi-account-edit</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
              <template #no-data>
                <div class="pa-4 text-medium-emphasis text-center text-caption">No groups yet</div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <create-group-dialog ref="createGroupDialog" @groupCreated="handleGroupCreated"></create-group-dialog>
    <add-group-member-dialog ref="addGroupMemberDialog" @membersChanged="fetchMemberCounts"></add-group-member-dialog>
  </div>
</template>

<script>
import CreateGroupDialog from "@/components/CreateGroupDialog.vue";
import AddGroupMemberDialog from "@/components/AddGroupMemberDialog.vue";

export default {
  components: {
    CreateGroupDialog,
    AddGroupMemberDialog,
  },
  data: () => {
    return {
      groups: [],
      memberCounts: {},
      groupsHeader: [
        { title: "Group Name", value: "gr_groupName" },
        { title: "Members", value: "members" },
        { title: "", value: "actions" },
      ],
    };
  },

  methods: {
    createGroup() {
      this.$refs.createGroupDialog.openDialog();
    },

    manageMembers(group) {
      this.$refs.addGroupMemberDialog.openAddMemberDialog(group.gr_groupSyskey);
    },

    async fetchGroups() {
      try {
        let response = await fetch("http://localhost:3000/groups/get/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }

        this.groups = await response.json();
        await this.fetchMemberCounts();
      } catch (error) {
        console.log(error);
      }
    },

    async fetchMemberCounts() {
      try {
        let counts = {};
        for (let group of this.groups) {
          let response = await fetch(
            `http://localhost:3000/groups/get/members/${group.gr_groupSyskey}`,
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

          let members = await response.json();
          counts[group.gr_groupSyskey] = members.length;
        }
        this.memberCounts = counts;
      } catch (error) {
        console.log(error);
      }
    },

    async handleGroupCreated() {
      this.$toast.open({
        message: "Group created successfully!",
        type: "success",
        color: "success",
        position: "top-right",
        duration: 3000,
        closeOnClick: true,
        dismissible: true,
      });
      await this.fetchGroups();
    },
  },
  async mounted() {
    await this.fetchGroups();
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
