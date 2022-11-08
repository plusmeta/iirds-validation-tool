<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container>
    <v-card
      class="elevation-4 mb-2"
      :color="(isValid) ? 'success' : 'error'"
    >
      <v-card-text>
        <v-row
          class="white--text" justify="center"
          align="center"
        >
          <v-col cols="auto">
            <v-icon
              class="text-h2"
              left
              color="white"
            >
              {{ (isValid) ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
          </v-col>
          <v-col cols="auto">
            <h2>
              {{ (isValid) ? `${$t('Otk.valid')} iiRDS ${getCurrentProjectRelationById('detectedVersion')}` : $t('Otk.notValid') }}
            </h2>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <p class="mb-0">
              <span class="font-weight-bold">{{ $tc('Otk.violationsDetected', getViolationTypes) }}</span>
              <span class="font-monospace">&nbsp;{{ getValidationSource }}</span>
            </p>

            <p class="mb-0">
              <span class="font-weight-bold">{{ getViolations.length }}</span>
              <span v-if="getViolations.length > 99" class="font-weight-bold">+</span>
              <span class="font-weight-bold">&nbsp;{{ $tc('Otk.violationInstancesDetected', getViolations.length) }}</span>
              <span>&nbsp;&nbsp;({{ getCurrentProjectRelationById('totalRulesChecked') }}</span>
              <span>&nbsp;{{ $t('Otk.rulesChecked') }})</span>
            </p>
          </v-col>
          <v-spacer />
          <v-col
            cols="auto"
          >
            <v-btn
              color="white"
              outlined
              @click="startFromStart()"
            >
              <v-icon left>
                mdi-restore
              </v-icon>
              {{ $t('Otk.checkAgain') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card v-if="!isValid" :outlined="!$vuetify.theme.dark">
      <v-data-iterator
        :items="getCurrentObjects"
        :items-per-page="7"
        :search="search"
        :footer-props="{
          'items-per-page-options': [7,25,50],
          'show-first-last-page': true,
          'show-current-page': true
        }"
        must-sort
        sort-by="name"
        item-key="uuid"
      >
        <template v-slot:header>
          <v-toolbar :class="{'elevation-0': !$vuetify.theme.dark}">
            <v-row
              class="px-2"
              justify="center"
              align="center"
            >
              <template v-if="$vuetify.breakpoint.mdAndUp">
                <v-col
                  v-shortkey.once="['t']"
                  @shortkey="$refs.type.focus()"
                >
                  <v-autocomplete
                    ref="type"
                    v-model="filter"
                    :items="getObjectTypeFilterValues"
                    :label="$t('Validate.all')"
                    prepend-icon="mdi-filter"
                    single-line
                    hide-details
                    clearable
                    full-width
                    dense
                    style="min-width: 200px;"
                  >
                    <template v-slot:item="{ item }">
                      <span>{{ item.text }} </span>
                      <v-spacer />
                      <v-chip small color="accent">
                        {{ item.count }}
                      </v-chip>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-spacer />
              </template>
              <v-col
                v-shortkey.once="['f']"
                @shortkey="$refs.search.focus()"
              >
                <v-text-field
                  ref="search"
                  v-model="search"
                  prepend-icon="mdi-magnify"
                  :label="$t('Common.search')"
                  single-line
                  hide-details
                  clearable
                  dense
                  style="min-width: 200px;"
                />
              </v-col>
              <template v-if="$vuetify.breakpoint.mdAndUp">
                <v-spacer />
                <v-col
                  v-shortkey.once="['s']"
                  class="d-flex justify-end"
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
                        class="mr-1"
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
                        <v-list-item-action>
                          <v-switch
                            :input-value="getSetting('ui_assign_preview')"
                            flat
                            color="primary"
                            @change="setLocalSetting({key: 'ui_assign_preview', value: !!$event})"
                          />
                        </v-list-item-action>
                        <v-list-item-title>{{ $t('Common.preview') }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </template>
            </v-row>
          </v-toolbar>
        </template>
        <template v-slot="{ items, isExpanded, expand }">
          <v-card
            v-for="(item, index) in items"
            :key="item.uuid"
            flat
            tile
          >
            <v-divider />
            <v-list class="pa-0">
              <v-list-item
                :id="`item-${index}`"
                :input-value="isExpanded(item)"
                @click="expand(item, !isExpanded(item))"
              >
                <v-list-item-icon>
                  <v-icon>
                    {{ getIconForType(item.uuid) }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-2">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    <span class="font-monospace font-weight-bold">
                      {{ getMetadataValueByURI(item.uuid, "plus:OriginalFileName") }}
                      <span v-if="getType(item.uuid) === 'Schema'">: {{ getMetadataValueByURI(item.uuid, "plus:LineNr") }}</span>
                      <span v-if="getType(item.uuid) === 'Container'">/ {{ getMetadataValueByURI(item.uuid, "plus:SubFile")?.join(", ") || "." }}</span>
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip small color="primary">
                    {{ getMetadataValueByURI(item.uuid, 'plus:Rule') }}
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-card-text
              v-if="isExpanded(item)"
              class="pl-8 pr-6"
            >
              <AssignMetadata :object="item" />
            </v-card-text>
          </v-card>
          <v-divider />
        </template>
      </v-data-iterator>

      <v-card-text>
        <v-row>
          <v-col>
            <v-container
              v-if="getSetting('ui_shortcuts')"
              class="text-caption grey--text text-sm-right px-0 pt-6"
            >
              <v-icon class="mr-4" color="grey darken-1">
                mdi-keyboard
              </v-icon>
              <span class="d-inline-block mr-2">
                {{ $t("Common.filter") }}
              </span>
              <kbd>t</kbd>
              <span class="d-inline-block mr-2 ml-8">
                {{ $t("Common.search") }}
              </span>
              <kbd>f</kbd>
              <span class="d-inline-block mr-2 ml-8">
                {{ $t("Actions.openSettings") }}
              </span>
              <kbd>s</kbd>
            </v-container>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import AssignMetadata from "@/toolkit/block/OtkAssignMetadataToObject";

export default {
    name: "OtkStepBulkAssignMetadata",
    components: {
        AssignMetadata,
    },
    props: {
        objecttype: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            search: null,
            removing: "",
            filter: null,
            showSettingsMenu: false
        };
    },
    computed: {
        getViolations() {
            return this.getCurrentObjectsByType(this.objecttype);
        },
        getViolationTypes() {
            return Object.keys(this.getObjectTypeFilterValues).length;
        },
        isValid() {
            return this.getViolations.length === 0;
        },
        getValidationSource() {
            const containers = this.getCurrentObjectsByType("iirds:Container");
            if (containers && containers.length === 1) {
                return containers[0].name;
            } else {
                return this.getCurrentObjectsByType().filter(object => object.type !== "plus:RuleViolation")[0]?.name;
            }
        },
        getCurrentObjects() {
            return this.getCurrentObjectsByType(this.objecttype).filter((object) => {
                const ruleNr = this.getMetadataValueByURI(object.uuid, "plus:Rule");
                return (this.filter) ? ruleNr === this.filter : true;
            });
        },
        getObjectTypeFilterValues() {
            const ruleCountMap = this.getCurrentObjectsByType(this.objecttype).reduce((map, object) => {
                const ruleNr = this.getMetadataValueByURI(object.uuid, "plus:Rule");
                if (map[ruleNr]) {
                    map[ruleNr]++;
                } else {
                    map[ruleNr] = 1;
                }
                return map;
            }, {});

            return Object.entries(ruleCountMap).map(([rule, count]) => {
                return {
                    text: rule,
                    value: rule,
                    count: count
                };
            }).sort((a,b) => a.text.localeCompare(b.text));
        },
        ...mapGetters("storage", [
            "getCurrentObjectTypes",
            "getCurrentObjectsByType",
            "getMetadataValueByURI",
            "getMetadataByURI"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById",
            "getPropertyRelationById",
            "getPropertiesByRole",
            "getPropertyType"
        ]),
        ...mapGetters("projects", [
            "getCurrentProjectRelationById"
        ]),
        ...mapGetters("settings", [
            "getCurrentProjectUuid",
            "getSetting"
        ])
    },
    mounted() {
        // open first element after mount
        const firstElem = document.querySelector("#item-0");
        if (firstElem) firstElem.click();
    },
    methods: {
        getType(objectUuid) {
            return this.getMetadataValueByURI(objectUuid, "plus:RuleType");
        },
        getIconForType(objectUuid) {
            const type = this.getType(objectUuid);
            switch (type) {
            case "Schema":
                return "mdi-tag-multiple-outline";
            case "Container":
                return "mdi-folder-zip-outline";
            case "System":
                return "mdi-alert-circle-outline";
            default:
                return "mdi-message-alert";
            }
        },
        startFromStart() {
            window.location.reload();
        },
        ...mapActions("projects", [
            "updateCurrentProjectRelations",
            "setCurrentProgressLocal",
            "deleteObjectsFromProject"
        ]),
        ...mapActions("settings", [
            "setLocalSetting"
        ]),
        ...mapActions("storage", [
            "saveMetaDatum",
            "clearStorage"
        ])
    }
};
</script>

<style>
.stepborder {
  border-left: 1px solid #ddd;
}
.v-chip--disabled {
    opacity: 0.8;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.theme--dark.v-select .v-chip--disabled, .theme--dark.v-select .v-select__selection--disabled {
    color: rgba(255, 255, 255, 0.8);
}
</style>
