<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Create Vault</span>
          </v-card-title>
          <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-row>
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
            <v-btn color="error" @click="closeDialog">Cancel</v-btn>
            <v-btn color="primary" @click="createVault">Create</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import globalFunctions from "@/classes/globalFunctions.js"; // Removed unused import
export default {
  data: () => ({
    dialog: false,
    vault: {},
  }),
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    async createVault() {
      try {

        //strange vutify 3 stuff here really wierd
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
          throw new Error("Failed to create vault");
        }

        this.$emit("newVaultHandler");
        this.closeDialog();
      } catch (error) {
        console.log(error);
      }
    },

    openDialog() {
      this.dialog = true;
    },
  },
};
</script>
