<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-container
    fluid
    class="pa-6 skeleton-container fill-height"
  >
    <!-- show skeleton as placeholder while loading -->
    <v-skeleton-loader type="image" />
  </v-container>
</template>

<style>
  div.skeleton-container {
    height: 100%;
    min-height: 100%;
  }
  div.v-skeleton-loader {
    height: 100%;
    width: 100%;
  }
  div.v-skeleton-loader__image.v-skeleton-loader__bone {
    width: 100% !important;
    height: 80% !important;
    min-height: 550px;
  }
</style>
