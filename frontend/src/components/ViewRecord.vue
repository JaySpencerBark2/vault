<template>
  <div>
    <v-dialog v-model="openViewDialog">
      <v-card class="text-center">
        <v-card-title> Record Name: {{ record.vh_lineName }} </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="6" xm="6">
                <v-text-field
                  label="Record"
                  v-model="record.vh_lineContent"
                  :type="showRecord ? 'text' : 'password'"
                  :append-inner-icon="showRecord ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="toggleShowRecord"
                  hide-details="auto"
                >
                  <template #append>
                    <v-icon
                      class="mr-2"
                      size="20"
                      @click.stop="copyToClipboard"
                      :title="copied ? 'Copied!' : 'Copy'"
                      :color="copied ? 'success' : undefined"
                      >{{ copied ? "mdi-check" : "mdi-content-copy" }}</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="6" xm="6">
                <v-text-field
                  label="Expires At"
                  v-model="record.vl_expiresAt"
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <!-- Note for jay add descript in crud and otehr stuff not finsiehd-->
        <v-card-actions>
          <v-btn text @click="closeViewRecordDialog">Close</v-btn>
          <v-btn text color="primary" @click="editRecord">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { th } from 'vuetify/locale';

export default {
  data: () => {
    return {
      openViewDialog: false,
      closeViewDialog: false,
      record: { 
        vh_lineContent: "", 
        vh_lineName: "",
        vl_expiresAt: "",
      },
      showRecord: false,
      copied: false,
    };
  },

  methods: {
    openViewRecordDialog(record) {
      this.record = {
        vh_lineContent: record?.vh_lineContent,
        vh_lineName: record?.vh_lineName,
        vh_lineSyskey: record?.vh_lineSyskey,
      };
      this.showRecord = false;
      this.copied = false;
      this.openViewDialog = true;
    },

    closeViewRecordDialog() {
      this.openViewDialog = false;
    },

    toggleShowRecord() {
      this.showRecord = !this.showRecord;
    },

    async copyToClipboard() {
      const txt = this.record?.vh_lineContent;
      if (!txt) return;
      try {
        await navigator.clipboard.writeText(txt);
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      } catch (e) {
        console.error("Copy failed", e);
      }
    },

    async editRecord() {
      try{
        let response = await fetch( `http://localhost:3000/dashboard/update/line/${this.record.vh_lineSyskey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(this.record)
        });
        if (!response.ok) {
          throw new Error("Failed to update record", e);
        } 

        this.$emit("refreshVaultLines", this.record.vh_vaultheadSyskey);
        this.openViewDialog = false;


      }catch(e){
        console.log(e);
        this.$toast.open({
          message: "Failed to update record.",
          type: "error",
          position: "top-right",
          duration: 3000,
          dismissible: true,
          className: "toast-over-dialog",
        });
      }

    },
  },
};
</script>
