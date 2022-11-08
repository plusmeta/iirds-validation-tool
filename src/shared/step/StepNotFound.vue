<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-container
    fluid
    class="pa-6 skeleton-container fill-height"
  >
    <v-sheet
      class="notfound py-12"
      style="margin:auto; text-align:center"
    >
      <img
        src="/images/crash.svg"
        alt="404"
        style="max-height: 400px"
      >
      <div class="my-6 text-h5" style="font-size: 36px !important; font-weight: 100">
        {{ $t("App.siteNotFound") }}
      </div>
      <p class="my-6 font-monospace">
        <!-- Show user full path of wrong route to allow for screenshot analysis -->
        Error: {{ $route.fullPath }}
      </p>
      <v-btn
        color="info"
        class="mt-8"
        :to="{path: '/'}"
      >
        {{ $t('App.backToStart') }}
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script>
import * as Sentry from "@sentry/browser";

export default {
    name: "NotFound",
    created() {
        // Log 404 event with warning level if Sentry is active for further investigation
        if (!!+process.env.VUE_APP_SENTRY_IS_ACTIVE) {
            Sentry.captureMessage(`RouteNotFound (404): ${this.$route.fullPath}`, "warning");
        }
    }
};
</script>

<style>
  div.skeleton-container {
    height: 100%;
    min-height: 100%;
  }
  .notfound {
    width: 100% !important;
    height: 90% !important;
    min-height: 550px;
  }
</style>
