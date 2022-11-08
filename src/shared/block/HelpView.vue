<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-card
    v-if="showHelpView"
    class="mb-6"
    :class="{'pm-transparent': !$vuetify.theme.dark}"
    :outlined="!$vuetify.theme.dark"
  >
    <v-card-title primary-title>
      <span class="text-h6">
        {{ helpTitle }}
      </span>
      <v-spacer />
      <v-btn
        icon
        @click="hideView"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="text-subtitle-2">
      <div v-html="helpText" />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "HelpView",
    props: {
        helpkey: {
            type: String,
            required: true
        }
    },
    computed: {
        showHelpView() {
            return !this.getSetting("ui_helpview_" + this.helpkey) &&
              this.getHelp(this.helpkey);
        },
        helpTitle() {
            return this.getHelpTitle(this.helpkey);
        },
        helpText() {
            return this.getHelpText(this.helpkey);
        },
        ...mapGetters("settings", [
            "getSetting"
        ]),
        ...mapGetters("help", [
            "getHelp",
            "getHelpText",
            "getHelpTitle"
        ])
    },
    methods: {
        hideView() {
            this.setLocalSetting({key: "ui_helpview_" + this.helpkey, value: true});
        },
        ...mapActions("settings", [
            "setLocalSetting"
        ])
    }
};
</script>
