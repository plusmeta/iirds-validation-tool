<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-app>
    <Topbar />
    <v-main>
      <v-progress-linear
        v-if="!isReady"
        indeterminate
        color="primary"
        style="position: absolute"
      />
      <v-fade-transition mode="out-in">
        <div :class="{'light-bg': !$vuetify.theme.dark}">
          <router-view v-if="isReady" />
        </div>
      </v-fade-transition>
    </v-main>
    <BottomNav v-if="isReady" />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Topbar from "@/toolkit/layout/OtkTopbar";
import BottomNav from "@/toolkit/layout/OtkBottomNav";

import template from "@/store/projects/template";

export default {
    name: "OtkMain",
    components: { Topbar, BottomNav },
    computed: {
        ...mapGetters("settings", [
            "isReady"
        ])
    },
    async created() {
        this.startApplication(false);
        await this.$auth.ready(true);

        try {
            await this.fetchProperties();
            await this.initWorkflowsLocal();
            await this.resetSettings();

            let newProject = template.project({ workflow: "iirds-validation-tool" });
            await this.startNewProjectLocal(newProject);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.debug(e);
        } finally {
            this.startApplication(true);
        }
    },
    methods: {
        ...mapActions("settings", [
            "resetSettings",
            "startApplication"
        ]),
        ...mapActions("workflows", [
            "initWorkflowsLocal"
        ]),
        ...mapActions("projects", [
            "startNewProjectLocal"
        ]),
        ...mapActions("properties", [
            "fetchProperties"
        ])
    }
};
</script>

<style>
  .light-bg {
      background-image: url('/images/iiRDS_curve.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: top center;
      min-height: 100%;
      position: relative;
  }
</style>
