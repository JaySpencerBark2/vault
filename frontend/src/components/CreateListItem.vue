<template>
  <div>
    <v-dialog v-model="openDialog">
      <v-card>
        <v-card-title class="text-center" >
          Create Vault Record
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Record Name"
                  :rules ="[v => !!v || 'Record Name is required']"
                  required
                  v-model="vaultLine.vl_lineName"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Record"
                  required
                  :rules ="[v => !!v || 'Record value is required']"
                  v-model="vaultLine.vl_lineContent"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  label="Record Description"
                  v-model="vaultLine.vl_lineDescription"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :v-model="vaultLine.vl_expiresAt"
                  label="Expiration Date (Optional)"
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeCreateListItemDialog" color="error"> Cancel </v-btn>
          <v-btn color="primary" @click="createListItem"> Create </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      openDialog: false,
      vaultLine: {},
      headerSykey: "",
    };
  },

  methods: {
    openCreateListItemDialog(Sykey) {
      this.openDialog = true;
      console.log(Sykey);
      this.headerSykey = Sykey;
    },

    closeCreateListItemDialog() {
      this.openDialog = false;
    },

    async createListItem() {
      try {
        let isValid = await this.$refs.form.validate();
        if(!isValid.valid) {
          return;
        }
        let request = await fetch(
          `http://localhost:3000/dashboard/create/line/${this.headerSykey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(this.vaultLine),
          }
        );

        if (!request.ok) {
          throw new Error("Failed to create list item");
        }

        if(!request.ok){
          throw new Error("Failed to create list item")
        }

        this.$emit("refreshVaultLines", this.headerSykey);
        this.openDialog = false;

      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
