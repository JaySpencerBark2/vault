<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon size="20" class="mr-2">mdi-account-plus</v-icon>
          <span class="headline">Create User</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="user.us_username"
                    label="Username"
                    clearable
                    :rules="[v => !!v || 'Username is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="user.us_password"
                    label="Password"
                    clearable
                    type="password"
                    :rules="[v => !!v || 'Password is required']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="user.admin"
                    label="Admin"
                    color="primary"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" prepend-icon="mdi-check" @click="createUser">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    user: { us_username: "", us_password: "", admin: false },
  }),
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    async createUser() {
      try {
        let isValid = await this.$refs.form.validate();
        if (!isValid.valid) {
          return;
        }
        let response = await fetch("http://localhost:3000/users/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(this.user),
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        this.$emit("userCreated");
        this.closeDialog();
      } catch (error) {
        console.log(error);
      }
    },

    openDialog() {
      this.user = { us_username: "", us_password: "", admin: false };
      this.dialog = true;
    },
  },
};
</script>
