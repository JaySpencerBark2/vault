<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-safe-square-outline</v-icon>
       My Vaults
      <v-spacer></v-spacer>
      <v-btn color="primary" class="ml-auto" @click="createVault">
        <v-icon class="mr-1">mdi-plus</v-icon>
        Create New Vault
      </v-btn>
        </v-card-title>
    </v-card>

    <v-container align="center" justify="center">
      <v-row align="center" justify="center">
        <v-col
          align="center"
          cols="12"
          md="6"
          v-for="vault in vaults"
          :key="vault.vh_vaultheadSyskey"
        >
          <v-card v-if="!isUnlocked[vault.vh_vaultheadSyskey]">
            <v-card-title> Vault Name: {{ vault.vh_vaultName }} </v-card-title>
            <v-card-text>
              <v-row align="center" justify="center">
                <v-col cols="6" md="6">
                  <v-text-field
                    v-model="passwords[vault.vh_vaultheadSyskey]"
                    label="Vault Password"
                    clearable
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    @click="unlockVault(vault.vh_vaultheadSyskey)"
                  >
                    <v-icon>mdi-lock-open</v-icon>
                    Unlock
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card v-else>
            <v-row>
              <v-col cols="12">
                <v-card-title>
                  Vault Name: {{ vault.vh_vaultName }}
                </v-card-title>
                <v-data-table
                  :headers="vaultLinesHeader"
                  :items="vaultLines[vault.vh_vaultheadSyskey] || []"
                >
                    <template v-slot:item.actions="{ item }">
                    <v-btn
                      @click="viewRecord(item)"
                      class="mr-2"
                      color="primary"
                    >
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    &nbsp;
                    &nbsp;
                    <v-btn
                      @click="deleteRecord(item)"
                      color="error" 
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-card-text>
                  <v-btn color="purple" @click="addItem(vault.vh_vaultheadSyskey)">
                    <v-icon>mdi-plus</v-icon>
                    Add Entry
                  </v-btn>
                </v-card-text>
              </v-col>
              <v-col cols="6">
                <v-card-text>
                  <v-btn color="primary" @click="lockVault(vault.vh_vaultheadSyskey)">
                    <v-icon> mdi-lock </v-icon>
                    Lock
                  </v-btn>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
  
    </v-container>
  </div>
  <create-list-item
    ref="refCreateItem"
   @refreshVaultLines="handleNewVaultLines"
  ></create-list-item>
  <create-vault-dialog
    ref="createVaultDialog"
    @newVaultHandler="newVaultHandler"
  ></create-vault-dialog>
  <view-record
    ref="viewRecordDialog"
    @refreshVaultLines="handleNewVaultLines"
  ></view-record>
</template>

<script>
import ViewRecord from "@/components/ViewRecord.vue";
import CreateVaultDialog from "@/components/CreateVaultDialog.vue";
import globalFunctions from "@/classes/globalFunctions.js";
import CreateListItem from "@/components/CreateListItem.vue";

export default {
  components: {
    CreateVaultDialog,
    CreateListItem,
  },
  data: () => {
    return {
      vaults: [],
      passwords: {},
      isUnlocked: {}, 
      vaultLinesHeader: [
        { title: "Record Name", value: "vh_lineName" },
        { title: "", value: "actions" }
      ],
      vaultLines: {}, 
    };
  },

  methods: {
    createVault() {
      this.$refs.createVaultDialog.openDialog();
    },

    async fetchVaults() {
      try {
        let user = await globalFunctions.getCurrentLoggedInUser();
        let response = await fetch(
          `http://localhost:3000/dashboard/get/all/${user.us_syskey}`,
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

    async addItem(headerSykey) {
      this.$refs.refCreateItem.openCreateListItemDialog(headerSykey);
    },

    async newVaultHandler() {
      this.$toast.open({
        message: 'Vault created successfully!',
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