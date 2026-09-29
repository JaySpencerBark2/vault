<template>
  <div class="dashboard-wrapper">
    <v-toolbar flat class="mb-4 dashboard-toolbar" density="comfortable">
      <v-toolbar-title class="text-h6 d-flex align-center">
        <v-icon size="20" class="mr-2">mdi-account-group</v-icon>
        Group Vaults
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-plus" variant="flat" :disabled="!myGroups.length" @click="createGroupVault">New Group Vault</v-btn>
    </v-toolbar>

    <v-container fluid>
      <v-row v-if="!myGroups.length">
        <v-col cols="12">
          <v-card class="pa-6 text-center" elevation="1">
            <v-icon size="32" class="mb-2 text-medium-emphasis">mdi-account-group-outline</v-icon>
            <div class="text-medium-emphasis">You are not a member of any group yet.</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="vault in vaults"
          :key="vault.vh_vaultheadSyskey"
          cols="12" sm="6" lg="4"
          class="d-flex"
        >
          <v-card v-if="!isUnlocked[vault.vh_vaultheadSyskey]" class="vault-card flex-grow-1" elevation="2">
            <v-card-item>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon color="warning" size="20" class="mr-2">mdi-lock</v-icon>
                  <span class="font-weight-medium text-truncate">{{ vault.vh_vaultName }}</span>
                </div>
                <v-chip size="x-small" color="primary" variant="tonal" label>{{ vault.gr_groupName }}</v-chip>
              </div>
            </v-card-item>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                v-model="passwords[vault.vh_vaultheadSyskey]"
                label="Password"
                :type="showPassword[vault.vh_vaultheadSyskey] ? 'text' : 'password'"
                density="comfortable"
                variant="outlined"
                :append-inner-icon="showPassword[vault.vh_vaultheadSyskey] ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="togglePasswordVisibility(vault.vh_vaultheadSyskey)"
                hide-details
                autocomplete="off"
              />
              <v-btn block color="primary" class="mt-3" @click="unlockVault(vault.vh_vaultheadSyskey)" prepend-icon="mdi-lock-open-variant">
                Unlock
              </v-btn>
            </v-card-text>
          </v-card>

          <v-card v-else class="vault-card flex-grow-1" elevation="3">
            <v-card-item>
              <div class="d-flex align-center justify-space-between flex-wrap">
                <div class="d-flex align-center mr-2">
                  <v-icon color="success" size="20" class="mr-2">mdi-lock-open-variant</v-icon>
                  <span class="font-weight-medium text-truncate">{{ vault.vh_vaultName }}</span>
                  <v-chip size="x-small" color="primary" variant="tonal" class="ml-2" label>{{ vault.gr_groupName }}</v-chip>
                </div>
                <div class="d-flex align-center actions-inline">
                  <v-chip size="x-small" color="primary" variant="tonal" class="mr-2" label>
                    {{ (vaultLines[vault.vh_vaultheadSyskey] || []).length }} records
                  </v-chip>
                  <v-btn icon size="small" variant="text" color="primary" :title="'Add Entry'" @click="addItem(vault.vh_vaultheadSyskey)">
                    <v-icon size="20">mdi-plus</v-icon>
                  </v-btn>
                  <v-btn icon size="small" variant="text" color="error" :title="'Lock Vault'" @click="lockVault(vault.vh_vaultheadSyskey)">
                    <v-icon size="20">mdi-lock</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-card-item>
            <v-divider></v-divider>
            <v-data-table
              :headers="vaultLinesHeader"
              :items="vaultLines[vault.vh_vaultheadSyskey] || []"
              density="comfortable"
              class="vault-table"
              hide-default-footer
            >
              <template #item.status="{ item }">
                <v-chip v-if="item.vl_expired" color="grey" size="small" variant="tonal">Expired</v-chip>
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex">
                  <v-tooltip text="View" location="bottom">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon size="small" variant="text" color="primary" @click="viewRecord(item)">
                        <v-icon size="18">mdi-eye</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Delete" location="bottom">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon size="small" variant="text" color="error" @click="deleteRecord(item)">
                        <v-icon size="18">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </template>
              <template #no-data>
                <div class="pa-4 text-medium-emphasis text-center text-caption">No records yet</div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <create-list-item
    ref="refCreateItem"
    @refreshVaultLines="handleNewVaultLines"
  />
  <create-group-vault-dialog
    ref="createGroupVaultDialog"
    @newGroupVaultHandler="newGroupVaultHandler"
  />
  <view-record
    ref="viewRecordDialog"
    @refreshVaultLines="handleNewVaultLines"
  />
</template>

<script>
import ViewRecord from "@/components/ViewRecord.vue";
import CreateGroupVaultDialog from "@/components/CreateGroupVaultDialog.vue";
import globalFunctions from "@/classes/globalFunctions.js";
import CreateListItem from "@/components/CreateListItem.vue";

export default {
  components: {
    CreateGroupVaultDialog,
    CreateListItem,
  },
  data: () => {
    return {
      myGroups: [],
      vaults: [],
      passwords: {},
      isUnlocked: {},
      showPassword: {},
      vaultLinesHeader: [
        { title: "Record Name", value: "vh_lineName" },
        { title: "Status", value: "status" },
        { title: "", value: "actions" }
      ],
      vaultLines: {},
    };
  },

  methods: {
    createGroupVault() {
      this.$refs.createGroupVaultDialog.openDialog(this.myGroups);
    },

    async fetchMyGroups(userSyskey) {
      try {
        let response = await fetch(
          `http://localhost:3000/group-vaults/get/my/groups/${userSyskey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }

        this.myGroups = await response.json();
      } catch (error) {
        console.log(error);
      }
    },

    async fetchVaults() {
      try {
        let user = await globalFunctions.getCurrentLoggedInUser();
        await this.fetchMyGroups(user.us_syskey);

        let response = await fetch(
          `http://localhost:3000/group-vaults/get/all/${user.us_syskey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vaults");
        }

        let data = await response.json();
        this.vaults = data;
      } catch (error) {
        console.log(error);
      }
    },

    async unlockVault(syskey) {
      try {
        let payload = {
          vh_vaultPassword: this.passwords[syskey],
          vh_vaultheadSyskey: syskey,
        };

        let response = await fetch("http://localhost:3000/dashboard/unlock/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            payload,
          }),
        });

        if (!response.ok || response.status === 401) {
          this.$toast.open({
            message: "Invalid password",
            type: "error",
            color: "red",
            position: "top",
            duration: 3000,
            closeOnClick: true,
            dismissible: true,
          });
          throw new Error("Failed to unlock vault");
        }

        if (response.status === 200) {
          this.isUnlocked[syskey] = true
          await this.getVaultLines(syskey);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getVaultLines(syskey) {
      try {
        let response = await fetch(
          `http://localhost:3000/dashboard/get/line/${syskey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vault lines");
        }

        let data = await response.json();
        this.vaultLines[syskey] = data;
      } catch (error) {
        console.log(error);
      }
    },

    async handleNewVaultLines(headerSykey) {
      this.$toast.open({
        message: 'Vault lines refreshed successfully!',
        type: 'success',
        color: 'success',
        position: 'top-right',
        duration: 3000,
        closeOnClick: true,
        dismissible: true,
      });
      await this.getVaultLines(headerSykey);
    },

    lockVault(syskey) {
      this.isUnlocked[syskey] = false;
    },

    togglePasswordVisibility(syskey) {
      this.showPassword[syskey] = !this.showPassword[syskey];
    },

    async addItem(headerSykey) {
      this.$refs.refCreateItem.openCreateListItemDialog(headerSykey);
    },

    async newGroupVaultHandler() {
      this.$toast.open({
        message: 'Group vault created successfully!',
        type: 'success',
        color: 'success',
        position: 'top-right',
        duration: 3000,
        closeOnClick: true,
        dismissible: true,
      });
      await this.fetchVaults();
    },

    viewRecord(item) {
      this.$refs.viewRecordDialog.openViewRecordDialog(item);
    },

  },
  async mounted() {
    await this.fetchVaults();
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
.vault-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.vault-table :deep(tbody tr:hover) {
  background: rgba(var(--v-theme-primary), 0.04);
  cursor: pointer;
}
.actions-inline > * + * { margin-left: 4px; }
@media (max-width: 600px) {
  .dashboard-toolbar { border-radius: 0; }
}
</style>
