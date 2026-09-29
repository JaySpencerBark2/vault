<template>
  <div>
  <v-container class="justify-center align-center">
    <v-card>
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            label="Email"
            prepend-icon="mdi-email"
            type="email"
            clearable
            required
          />
          <v-text-field
            v-model="password"
            label="Password"
            prepend-icon="mdi-lock"
            clearable
            type="password"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        let response = await fetch("http://localhost:3000/login/", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            username: this.email,
            password: this.password,
          }),
        });

        if (response.ok) {
          this.$router.push('/dashboard');
        } else {
          this.$toast.open({
            message: "Invalid credentials",
            type: "is-danger",
            color: "red",
            position: "top",
            duration: 3000,
            closeOnClick: true,
            dismissible: true,
          });
          this.$router.push('/');
         
          throw new Error("Invalid credentials");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
