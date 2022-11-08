<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-dialog
    v-model="show"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ title }}
        <v-spacer />
      </v-card-title>
      <v-card-text v-show="!!message" class="pl-6 pr-6 pt-1 pb-2">
        {{ message }}
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn
          text
          @click.native="cancel"
        >
          {{ $t("Actions.cancel") }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="accent"
          @click.native="agree"
        >
          {{ $t("Common.true") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
    name: "ConfirmDialog",
    data: () => ({
        dialog: false,
        resolve: null,
        reject: null,
        message: null,
        title: null,
        options: {
            color: "primary",
            width: 450,
            zIndex: 200,
            helpkey: undefined
        }
    }),
    computed: {
        show: {
            get() {
                return this.dialog;
            },
            set(value) {
                this.dialog = value;
                if (value === false) {
                    this.cancel();
                }
            }
        }
    },
    methods: {
        open(title, message, options) {
            this.dialog = true;
            this.title = title;
            this.message = message;
            this.options = Object.assign(this.options, options);
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        },
        agree() {
            this.resolve(true);
            this.dialog = false;
        },
        cancel() {
            this.resolve(false);
            this.dialog = false;
        }
    }
};
</script>
