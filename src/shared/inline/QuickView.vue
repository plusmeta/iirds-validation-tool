<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-tooltip top>
    <template v-slot:activator="{ on: tooltip }">
      <v-menu
        v-model="peek"
        :right="!left"
        :left="left"
        transition="scale-transition"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on: menu }">
          <v-btn
            :loading="loading"
            icon
            class="mr-2"
            :disabled="!isPreviewable"
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon>{{ getIcon }}</v-icon>
          </v-btn>
        </template>
        <v-card
          v-if="!loading"
          class="pa-0"
          :max-width="400"
        >
          <v-list class="pa-0">
            <v-list-item>
              <v-list-item-icon>
                <v-icon x-large>
                  mdi-eye
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="subtitle-2">
                  <span class="d-inline-block text-truncate" style="max-width: 300px;">
                    {{ sourceName || getPropertyLabelById(objectType) }}
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle
                  v-if="sourceType"
                  class="overline grey--text"
                >
                  {{ $t("Common.preview") }} {{ getPropertyLabelById(sourceType) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-text
            v-if="sourceType === 'application/xml'"
            class="pa-0"
          >
            <PreviewXML :file="getObject" />
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
    <span>{{ $t("Common.preview") }}</span>
  </v-tooltip>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import PreviewXML from "@/shared/block/PreviewXML";

export default {
    name: "QuickView",
    components: {
        PreviewXML
    },
    props: {
        uuid: {
            type: String,
            required: true
        },
        sourceType: {
            type: String,
            default: null,
            required: false
        },
        sourceName: {
            type: String,
            default: null,
            required: false
        },
        objectType: {
            type: String,
            required: true
        },
        left: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            peek: false,
            loading: false
        };
    },
    computed: {
        isPreviewable() {
            return ["application/pdf", "text/html", "application/xml"].includes(this.sourceType) || this.isOffice;
        },
        getIcon() {
            if (this.peek && this.isPreviewable) {
                return "mdi-eye";
            } else if (!this.peek && this.isPreviewable) {
                return "mdi-eye-outline";
            } else {
                return "mdi-eye-off-outline";
            }
        },
        getObject() {
            return this.getObjectByUuid(this.uuid) ?? {};
        },
        ...mapGetters("storage", ["getObjectByUuid"]),
        ...mapGetters("properties", ["getPropertyLabelById"])
    },
    watch: {
        async peek(val) {
            if (!val) return;

            try {
                this.loading = true;
                if (!this.getObjectByUuid(this.uuid)) {
                    await this.loadObjectByUuid(this.uuid);
                }
            } finally {
                this.loading = false;
            }
        }
    },
    methods: {
        ...mapActions("storage", [
            "loadObjectByUuid"
        ])
    }
};
</script>
