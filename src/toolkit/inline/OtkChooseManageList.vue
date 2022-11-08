<!--
  Copyright 2021 plusmeta GmbH
  License: MIT
-->

<template>
  <v-row>
    <v-col>
      <v-combobox
        :value="getAssignedListEntries"
        :items="getAssignedListEntries"
        :label="getLabel"
        :prepend-icon="icon"
        multiple
        :rules="[checkRequired]"
        small-chips
        deletable-chips
        :search-input.sync="search"
        return-object
        @input="changeList"
      >
        <template v-slot:no-data>
          <v-list-item class="py-0">
            <v-list-item-content>
              {{ $t("Actions.createEntry") }}
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "ChooseManageList",
    props: {
        objectUuid: {
            type: String,
            required: true
        },
        proplist: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        label: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ""
        }
    },
    data () {
        return {
            loading: false,
            search: null
        };
    },
    computed: {
        getLabel() {
            let label = "";
            if (this.label) label += this.getPropertyLabelById(this.proplist);
            if (this.label && this.required) label += "*";
            return label;
        },
        getAssignedListEntries() {
            return this.getMetadataValueByURI(this.objectUuid, this.proplist) || [];
        },
        getValueCount() {
            return this.getAssignedListEntries.length;
        },
        ...mapGetters("storage", [
            "getMetadataValueByURI",
            "getMetadataByURI"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById"
        ])
    },
    methods: {
        changeList(selected) {
            this.saveMetaDatum({
                objectUuid: this.objectUuid,
                objectMeta: {
                    uri: this.proplist,
                    value: selected
                }
            });
            this.$emit("change");
        },
        checkRequired() {
            if (this.required && !this.getValueCount) {
                return this.$t("Common.noEmptyInput");
            } else {
                return true;
            }
        },
        ...mapActions("storage", [
            "saveMetaDatum"
        ])
    }
};
</script>
