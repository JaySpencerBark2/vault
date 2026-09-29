<template>
    <v-app>
        <v-container>
            <v-row align="center" justify="center">
                <v-col cols="12" md="8">
                    <v-card class="mx-auto" max-width="400">
                        <v-card-title class="headline">Welcome to Vuetify</v-card-title>
                        <v-card-text>
                            <p>This is a simple Vuetify welcome page. Feel free to customize it as you like.</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" @click="goToAbout">Learn More</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
export default {
    name: 'Home',
    methods: {
        goToAbout() {
            this.$router.push('/about');
        }
    }
}
</script>

<style scoped>
.v-card {
    margin-top: 50px;
}
</style>