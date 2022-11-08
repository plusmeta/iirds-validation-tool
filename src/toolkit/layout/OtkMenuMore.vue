<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <div>
    <v-menu
      eager
      offset-y
      nudge-left
      min-width="350"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :disabled="!isReady"
          v-on="on"
        >
          <v-icon>
            mdi-dots-vertical
          </v-icon>
        </v-btn>
      </template>
      <v-list v-if="isReady">
        <v-list-item
          href="https://iirds.org"
          target="_blank"
        >
          <v-list-item-icon class="mr-4">
            <img
              :src="getLogo"
              width="75px"
              height="25px"
            >
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-overline">
              Validation Tool {{ version }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list-item class="py-2">
          <v-list-item-action>
            <v-switch
              :input-value="getSetting('ui_shortcuts')"
              color="primary"
              :disabled="isInternetExplorer"
              @change="setLocalSetting({key: 'ui_shortcuts', value: !!$event})"
            />
          </v-list-item-action>
          <v-list-item-title>{{ $t('Actions.showShortcuts') }}</v-list-item-title>
          <v-list-item-action>
            <v-icon>mdi-apple-keyboard-shift</v-icon>
          </v-list-item-action>
        </v-list-item>

        <v-list-item class="py-2">
          <v-list-item-action>
            <v-switch
              :input-value="isDarkTheme"
              color="primary"
              @change="changeTheme(!!$event)"
            />
          </v-list-item-action>
          <v-list-item-title>{{ $t('Actions.useDarkMode') }}</v-list-item-title>
          <v-list-item-action>
            <v-icon>
              mdi-theme-light-dark
            </v-icon>
          </v-list-item-action>
        </v-list-item>

        <v-divider />

        <v-list-item
          class="py-2"
          :disabled="isInternetExplorer"
          @click="restoreSettings"
        >
          <v-list-item-action>
            <v-icon>
              mdi-cog-counterclockwise
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $t("Actions.restoreSettings") }}
          </v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item
          :href="getFeedbackLink"
          class="py-2"
        >
          <v-list-item-action>
            <v-icon>
              mdi-mail
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $t("Actions.giveFeedback") }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          class="py-2"
          href="https://github.com/plusmeta/iirds-validation-tool"
          target="_blank"
        >
          <v-list-item-action>
            <v-icon>
              mdi-github
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $t("App.sourcecode") }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          class="py-2"
          @click="showLicenseDialog = true"
        >
          <v-list-item-action>
            <v-icon>
              mdi-license
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $t("App.license") }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <LicenseInfoDialog
      v-if="showLicenseDialog"
      @close="showLicenseDialog = false"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import util from "@/util";

import LicenseInfoDialog from "@/shared/dialog/LicenseInfoDialog";

export default {
    name: "OtkMenuMore",
    components: {
        LicenseInfoDialog
    },
    data() {
        return {
            showLicenseDialog: false,
            feebdackAddress: "info@tekom.de",
            feedbackSubject: "[iiRDS-OT] Feedback",
            version: `v${process.env.VUE_APP_VERSION}`
        };
    },
    computed: {
        getFeedbackLink() {
            return `mailto:${this.feebdackAddress}?subject=${this.feedbackSubject}`;
        },
        isInternetExplorer() {
            return util.isIE();
        },
        ...mapGetters("settings", [
            "isReady",
            "getLogo",
            "getSetting",
            "isDarkTheme"
        ])
    },
    methods: {
        async restoreSettings() {
            if (await this.$confirm.open(
                this.$t("Actions.restoreSettings"),
                this.$t("Actions.restoreSettingsInfo"))) {
                this.setCurrentProgressLocal(1);
                if (this.$matomo) this.$matomo.forgetConsentGiven();
                this.resetSettings(true);
                this.$notify.send(this.$t("Otk.settingsRestored"), "success", 2);
            }
        },
        ...mapActions("settings", [
            "setLocalSetting",
            "resetSettings",
            "changeTheme"
        ]),
        ...mapActions("projects", [
            "setCurrentProgressLocal"
        ])
    }

};
</script>
