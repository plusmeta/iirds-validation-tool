<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-app-bar
    dense
    dark
    color="primary"
    app
  >
    <v-toolbar-title>
      <img
        :src="getLogoForTheme('dark')"
        alt="Validation Tool"
        title="Validation Tool"
        width="75px"
        height="25px"
        class="ml-6 mr-4 mt-2"
      >
    </v-toolbar-title>
    <v-toolbar-title class="text-overline">
      Validation Tool
    </v-toolbar-title>

    <div v-shortkey.push="['shift']" @shortkey="toggleShortcuts" />
    <v-spacer />

    <!-- Right-hand Menus -->
    <MenuLanguage />
    <MenuMore />
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import MenuLanguage from "@/toolkit/layout/OtkMenuLanguage";
import MenuMore from "@/toolkit/layout/OtkMenuMore";

export default {
    name: "OtkTopbar",
    components: { MenuLanguage, MenuMore },
    data() {
        return {
            initital: false
        };
    },
    computed: {
        ...mapGetters("settings", [
            "getLogoForTheme",
            "getSetting"
        ]),
        ...mapGetters("workflows", [
            "getCurrentWorkflowStep"
        ])
    },
    methods: {
        toggleShortcuts() {
            if (!this.initital && !this.getSetting("ui_shortcuts")) {
                this.initital = true;
                this.setLocalSetting({ key: "ui_shortcuts", value: true });
            } else if (this.initital === true) {
                this.initital = false;
                this.setLocalSetting({ key: "ui_shortcuts", value: false });
            }
        },
        ...mapActions("settings", [
            "setLocalSetting"
        ])
    }
};
</script>
