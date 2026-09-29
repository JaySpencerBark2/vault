<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon size="20" class="mr-2">mdi-account-group</v-icon>
            <span class="headline">Create Group Vault</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="vault.vh_groupSyskey"
                    :items="groups"
                    item-title="gr_groupName"
                    item-value="gr_groupSyskey"
                    label="Group"
                    :rules="[v => !!v || 'Group is required']"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="vault.vh_vaultName"
                    label="Vault Name"
                    clearable
                    :rules="[v => !!v || 'Record name is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="vault.vh_vaultPassword"
                    label="Vault Password"
                    clearable
                    type="password"
                    :rules="[v => !!v || 'Record name is required']"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="vault.vh_vaultPasswordConfrim"
                    label="Confirm Password"
                    :rules="[
                      (v) =>
                        v === vault.vh_vaultPassword || 'Passwords must match',
                    ]"
                    clearable
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
            <v-btn color="primary" variant="flat" prepend-icon="mdi-check" @click="createVault">Create</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import globalFunctions from "@/classes/globalFunctions.js";
export default {
  data: () => ({
    dialog: false,
    groups: [],
    vault: {},
  }),
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    async createVault() {
      try {
        let isValid = await this.$refs.form.validate();
        if(!isValid.valid) {
          return;
        }
        let user = await globalFunctions.getCurrentLoggedInUser();
        this.vault.vh_userSyskey = user.us_syskey;
        let response = await fetch("http://localhost:3000/dashboard/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(this.vault),
        });

        if (!response.ok) {
          throw new Error("Failed to create group vault");
        }

        this.$emit("newGroupVaultHandler");
        this.closeDialog();
      } catch (error) {
        console.log(error);
      }
    },

    openDialog(groups) {
      this.groups = groups || [];
      this.vault = {};
      this.dialog = true;
    },
  },
};
</script>
