<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2022 plusmeta GmbH
  License: MIT
-->

<template>
  <v-flex style="overflow-x: auto;">
    <v-sheet
      v-if="file.text"
      height="300"
      min-width="400"
      class="pa-0 mx-auto"
      color="grey lighten-1"
      style="overflow-x: auto;"
    >
      <codemirror
        ref="xmlcode"
        :value="getCode"
        :options="getOptions"
        @change="highlightLine"
        @ready="highlightLine"
      />
    </v-sheet>
    <v-skeleton-loader
      v-show="!file.text"
      class="mx-auto"
      height="300"
      width="400"
      type="image"
    />
    <v-row no-gutters>
      <v-col cols="10">
        <p v-if="file.text" class="font-monospace mt-2">
          Violation found in line {{ getLineNr }} of {{ getFileName }}
        </p>
      </v-col>
      <v-col cols="2" style="text-align: right">
        <v-btn
          icon
          :disabled="mode"
          class="my-0"
          @click="changeMode"
        >
          <v-icon small>
            mdi-xml
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-flex>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "PlusPreviewXML",
    props: {
        file: {
            type: Object,
            required: true
        },
        size: {
            type: Number,
            required: false,
            default: 0.5
        }
    },
    data() {
        return {
            mode: false
        };
    },
    computed: {
        getFileName() {
            return this.getMetadataValueByURI(this.file.uuid, "plus:OriginalFileName");
        },
        getCode() {
            return (this.mode) ? this.getMetadataValueByURI(this.file.uuid, "plus:Elements") : this.getMetadataValueByURI(this.file.uuid, "plus:Lines");
        },
        getLine() {
            const lines = this.getCode.split("\n");
            return (lines.length >= 3) ? lines[3] : lines[lines.length - 1];
        },
        getLineNr() {
            return this.getMetadataValueByURI(this.file.uuid, "plus:LineNr") || 1;
        },
        getOptions() {
            return {
                firstLineNumber: Number(this.getLineNr) - 3,
                lineNumbers: !this.mode
            };
        },
        ...mapGetters("storage", [
            "getMetadataValueByURI",
        ]),
    },
    created() {
        const lineText = this.getMetadataValueByURI(this.file.uuid, "plus:Lines");
        const splitLines = lineText.split("\n");
        this.mode = splitLines.length === 1;
    },
    methods: {
        changeMode() {
            this.mode = true;
        },
        highlightLine(editor) {
            const from = {line: 3, ch: 1};
            const to = {line: 3, ch: this.getLine.length};
            editor.doc.markText(from, to, {className: "highlighted"});
        }
    }
};
</script>

<style>
    .v-skeleton-loader__image {
        height: 100% !important;
        min-height: 400px;
    }
    .vm-markdown-html {
        padding: 0 !important;
    }
    .vm-markdown-html pre {
        margin: 0 !important;
        border-radius: 0 !important;
    }
    .highlighted {
        text-decoration-line: underline;
        text-decoration-style: wavy;
        text-decoration-color: red;

    }
</style>