<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container
    v-shortkey.once="['u']"
    fluid
    @dragover.prevent="showOverlay"
    @drop.prevent="dropFile"
    @shortkey="$refs.fileInput.click()"
  >
    <form ref="fileForm">
      <input
        ref="fileInput"
        style="display:none;"
        type="file"
        multiple
        @change="addFiles($refs.fileInput.files)"
      >
    </form>

    <v-container fluid class="drop-overlay drop-overlay-container">
      <v-fade-transition>
        <v-container
          v-show="showDragOverlay"
          fluid
          class="drop-overlay drop-overlay-inner"
        >
          <v-row
            class="drop-overlay drop-overlay-item transition-fast-in-fast-out fill-height flex-column"
            align="center"
            justify="center"
          >
            <v-icon :size="96" color="grey">
              mdi-cloud-upload-outline
            </v-icon>
            <div class="title my-6">
              {{ $t('Objects.dropFilesToAdd') }}
            </div>
          </v-row>
        </v-container>
      </v-fade-transition>

      <v-card :outlined="!$vuetify.theme.dark">
        <v-data-table
          v-model="selected"
          :hide-default-header="!items.length"
          :hide-default-footer="!items.length"
          :headers="itemsHeaders"
          :items="items"
          :search="search"
          item-key="uuid"
          :loading="loading"
          show-select
        >
          <template v-slot:top>
            <v-toolbar
              :class="{'elevation-0': !$vuetify.theme.dark, 'pt-2': true}"
              min-height="80"
            >
              <v-flex
                v-shortkey.once="['t']"
                class="pb-2"
                @shortkey="$refs.type.focus()"
              >
                <v-autocomplete
                  v-show="!!items.length"
                  ref="type"
                  :value="filter"
                  :items="getObjectTypeFilterValues"
                  :label="$t('Objects.all')"
                  :multiple="false"
                  prepend-icon="mdi-filter"
                  single-line
                  hide-details
                  clearable
                  @change="(v) => filter = v"
                >
                  <template v-slot:item="{ item }">
                    <span>{{ item.text }} </span>
                    <v-spacer />
                    <v-chip small color="accent">
                      {{ item.count }}
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-flex>

              <v-spacer />

              <v-flex
                v-shortkey.once="['f']"
                class="pb-2"
                @shortkey="$refs.search.focus()"
              >
                <v-text-field
                  v-show="!!items.length"
                  ref="search"
                  v-model="search"
                  prepend-icon="mdi-magnify"
                  :disabled="loading"
                  :label="$t('Common.search')"
                  single-line
                  hide-details
                  clearable
                />
              </v-flex>

              <v-spacer />

              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-if="isMaxMemory"
                    icon
                    v-on="on"
                  >
                    <v-icon color="warning">
                      mdi-alert
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("App.maxMemory") }}</span>
              </v-tooltip>

              <div
                v-shortkey.once="['s']"
                @shortkey="showSettingsMenu = !showSettingsMenu"
              >
                <v-menu
                  v-model="showSettingsMenu"
                  left
                  offset-y
                  :min-width="350"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mr-4"
                      v-on="on"
                    >
                      <v-icon :class="{turn: showSettingsMenu}">
                        mdi-cog
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-subheader>
                      {{ $t('Common.view') }}
                      <v-divider />
                    </v-subheader>

                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>
                          mdi-table-eye
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>
                        <v-autocomplete
                          :value="getSetting('ui_addobjects_columns')"
                          :items="allColumnHeaders"
                          small
                          multiple
                          @change="setLocalSetting({key: 'ui_addobjects_columns', value: uniqueValues($event)})"
                        >
                          <template v-slot:selection="{ index }">
                            <span v-if="!index">
                              {{ $tc('Common.columns', getSetting('ui_addobjects_columns').length) }}
                            </span>
                          </template>
                        </v-autocomplete>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-fab-transition>
                    <v-btn
                      v-show="selected.length"
                      color="error"
                      class="elevation-0 mr-4"
                      fab
                      small
                      v-on="on"
                      @click="deleteSelectedObjects"
                    >
                      <v-icon>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-fab-transition>
                </template>
                <span>{{ $t("Actions.deleteSelectedObjects") }}</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="success"
                    class="elevation-0"
                    fab
                    :disabled="isMaxMemory"
                    v-on="on"
                    @click="$refs.fileInput.click()"
                  >
                    <v-icon large>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("Actions.addObject") }}</span>
              </v-tooltip>
            </v-toolbar>
          </template>

          <template v-slot:item.name="{ item }">
            <v-progress-circular
              v-if="processing.includes(item.uuid)"
              indeterminate
              class="ml-1 mr-5"
              color="grey"
              :size="20"
            />
            <QuickView
              v-if="!processing.includes(item.uuid)"
              :uuid="item.uuid"
              :source-type="(item.source || {}).type"
              :source-name="(item.source || {}).name"
              :object-type="item.type"
            />
            <span :class="{'grey--text': processing.includes(item.uuid)}">{{ item.name }}</span>
          </template>

          <template v-slot:no-data>
            <v-container
              fluid
              class="pa-5"
            >
              <div
                class="pa-2 mb-2"
                style="border: 3px dashed grey;"
                @click="$refs.fileInput.click()"
              >
                <div class="my-1" style="font-size: 80px">
                  {{ $t('Validate.addObjects') }}
                </div>
                <v-icon :size="140" color="grey">
                  mdi-package-variant-closed-check
                </v-icon>
                <p class="my-2" style="font-size: 24px">
                  {{ $t('Validate.noObjectsExplainer') }}
                </p>
              </div>
            </v-container>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { tap, debounceTime } from "rxjs/operators";

import QuickView from "@/shared/inline/QuickView";

import template from "@/store/storage/template";
import util from "@/util";
import match from "@/util/match";
import config from "@/config";

import iirds from "@/util/import/iirds";

export default {
    name: "OtkStepAddObjects",
    components: {
        QuickView
    },
    data() {
        return {
            loading: false,
            search: null,
            filter: undefined,
            selected:  [],
            processing: [],
            showHelp: true,
            showDragOverlay: false,
            showSettingsMenu: false
        };
    },
    domStreams: ["toggleOverlay$"],
    subscriptions() {
        return {
            onDragOver:
                this.toggleOverlay$.pipe(
                    tap(() => {
                        this.showDragOverlay = true;
                    }),
                    debounceTime(150),
                    tap(() => {
                        this.showDragOverlay = false;
                    })
                )
        };
    },
    computed: {
        getCurrentObjects() {
            return this.getCurrentObjectsByType(this.filter);
        },
        getObjectTypeFilterValues() {
            return Object.entries(this.getCurrentObjectTypes).map(([key, value]) => {
                return {
                    text: this.getPropertyLabelById(key) || key,
                    value: key,
                    count: value
                };
            }).sort((a,b) => a.text.localeCompare(b.text));
        },
        items() {
            return this.getCurrentObjects
                .filter(object => !!object)
                .filter(object => object.type !== "iirds:Container")
                .map(object =>
                    Object.assign(util.deepCopy(object), {
                        uuid: object.uuid,
                        name: object.name,
                        type: object.type,
                        typeLabel: this.getPropertyLabelById(object.type) || this.$t("Common.unknown"),
                        size: object.source?.size || 0,
                        sourcetype: this.getPropertyLabelById(object.source?.type) || this.$t("Common.unknown"),
                        sourcename: object.source?.name,
                        object
                    })
                );
        },
        allColumnHeaders() {
            return [
                {
                    text: this.$t("Objects.label"),
                    align: "left",
                    value: "name",
                    disabled: true,
                    sortable: true
                },
                {
                    text: this.$t("Objects.type"),
                    align: "left",
                    value: "typeLabel",
                    sortable: true
                },
                {
                    text: this.$t("Objects.sourceName"),
                    align: "left",
                    value: "sourcename",
                    sortable: true
                },
                {
                    text: this.$t("Objects.sourceType"),
                    align: "left",
                    value: "sourcetype",
                    sortable: true
                }
            ];
        },
        itemsHeaders () {
            return this.allColumnHeaders.filter((header) => {
                return this.getSetting("ui_addobjects_columns").includes(header.value);
            });
        },
        isMaxMemory() {
            return Number(this.getActiveSourceMbs) > Number(config.maxObjectMemory);
        },
        ...mapGetters("settings", [
            "getSetting"
        ]),
        ...mapGetters("projects", [
            "getCurrentProjectUuid"
        ]),
        ...mapGetters("storage", [
            "getCurrentObjectsByType",
            "getCurrentObjectTypes",
            "getActiveSourceMbs"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById"
        ])
    },
    watch: {
        getCurrentObjects() {
        // make sure that a set filter doesn't show an empty object list
            if (this.getCurrentObjects.length === 0 && this.filter) {
                this.filter = undefined;
            }
            // https://github.com/plusmeta/iirds-validation-tool/issues/22
            let currentUuids = this.getCurrentObjects.map(o => o.uuid);
            this.selected = this.selected.filter(uuid => currentUuids.includes(uuid));
        }
    },
    methods: {
        ...util,
        async deleteSelectedObjects() {
            if (await this.$confirm.open(
                this.$t("Actions.deleteSelectedObjects"),
                this.$t("Actions.deleteObjectsInfo")
            )) {
                const objectUuids = this.selected.map(item => item.uuid);
                await this.deleteObjects(objectUuids);
            }
        },
        async addFiles(uploadedFiles) {
            const batchSizeInMb = Array.from(uploadedFiles).reduce((size, file) => {
                size += file.size;
                return size;
            }, 0) / (1000 * 1000);

            if ((batchSizeInMb + this.getActiveSourceMbs) > config.maxObjectMemory) {
                return this.$notify.send(this.$t("App.filesTooLarge"), "warning", 5);
            }

            try {
                this.loading = true;
                let objectUuids = await Promise.all([...uploadedFiles].map(this.handleFile));
            } finally {
                this.$refs.fileForm.reset();
                this.loading = false;
            }
        },
        async handleFile(file) {
            let mimeType = match.mimeType(this.$store, file.type, file.name);
            let objectType = match.objectType(this.$store, file.type, file.name, this.objecttype);

            let object = template.object({
                type: objectType,
                name: file.name,
                source: {
                    type: mimeType,
                    data: file,
                    size: file.size,
                    name: file.name,
                    uri: undefined
                }
            });

            this.processing.push(object.uuid);

            this.saveObjectLocal(object);
            this.addObjectsToProject({
                projectUuid: this.getCurrentProjectUuid,
                objectUuids: [object.uuid]
            });

            let analyzePayload = [
                this.getCurrentProjectUuid,
                object.uuid,
                object.source.data,
                object.source.name,
                this.$store
            ];

            await iirds.analyze(...analyzePayload);

            this.processing.splice(this.processing.indexOf(object.uuid), 1);
            return object.uuid;
        },
        async dropFile(event) {
            const files = event.dataTransfer.files;
            this.showDragOverlay = false;
            await util.waitForUI();

            this.addFiles(files);
        },
        showOverlay(e) {
            this.toggleOverlay$.next(e);
        },
        ...mapActions("storage", [
            "deleteObjects",
            "saveObjectLocal"
        ]),
        ...mapActions("projects", [
            "addObjectsToProject"
        ]),
        ...mapActions("settings", [
            "setLocalSetting"
        ])
    }
};
</script>
