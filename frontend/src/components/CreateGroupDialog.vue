<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon size="20" class="mr-2">mdi-account-group</v-icon>
          <span class="headline">Create Group</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="group.gr_groupName"
                    label="Group Name"
                    clearable
                    :rules="[v => !!v || 'Group name is required']"
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
          <v-btn color="primary" variant="flat" prepend-icon="mdi-check" @click="createGroup">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    group: { gr_groupName: "" },
  }),
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    async createGroup() {
      try {
        let isValid = await this.$refs.form.validate();
        if (!isValid.valid) {
          return;
        }
        let response = await fetch("http://localhost:3000/groups/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(this.group),
        });

        if (!response.ok) {
          throw new Error("Failed to create group");
        }

        this.$emit("groupCreated");
        this.closeDialog();
      } catch (error) {
        console.log(error);
      }
    },

    openDialog() {
      this.group = { gr_groupName: "" };
      this.dialog = true;
    },
  },
};
</script>
