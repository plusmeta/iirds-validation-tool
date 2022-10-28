<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex
        xs6
        lg5
        class="px2"
      >
        <PreviewXML
          v-if="isPreview && isXML"
          :file="object"
        />
        <v-skeleton-loader
          v-else
          class="mx-auto"
          boilerplate
          type="image"
          height="300"
          width="400"
        />
      </v-flex>
      <v-flex
        class="flex-shrink-1 offset-xs1 xs5 lg6"
      >
        <template v-for="custom in getVisibleMetadata">
          <div
            v-if="custom.type === 'plus:Array'"
            :key="custom.value"
          >
            <ChooseManageList
              :key="custom.value"
              :object-uuid="object.uuid"
              :proplist="custom.value"
              :required="custom.required"
              :indicator="false"
              :label="true"
              :icon="custom.icon"
            />
          </div>
          <div
            v-else
            :key="custom.value"
          >
            <ShowEditMetadata
              :object-uuid="object.uuid"
              :proprelation="custom.rel"
              :icon="custom.icon"
              :label="true"
            />
          </div>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import ChooseManageList from "@/toolkit/inline/OtkChooseManageList";
import ShowEditMetadata from "@/toolkit/inline/OtkShowEditMetadata";
import PreviewXML from "@/shared/block/PreviewXML";

export default {
    name: "PlusAssignMetadataToObject",
    components: {
        PreviewXML,
        ChooseManageList,
        ShowEditMetadata
    },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            objectMetadata: []
        };
    },
    computed: {
        isPreview() {
            return !!this.getSetting("ui_assign_preview") && this.getType === "Schema";
        },
        getType() {
            return this.getMetadataValueByURI(this.object.uuid, "plus:RuleType");
        },
        getVisibleMetadata() {
            return this.objectMetadata
                .filter((prop) => {
                    const restrictions = this.getPropertyRelationById(prop.identifier, "plus:restricted-to-object-type");
                    const areRestrictionsOk = !restrictions.length || restrictions.includes(this.object.type);
                    return areRestrictionsOk;
                })
                .map((prop) => {
                    const relation = this.getPropertyRelationById(prop.identifier, "plus:has-relations")[0] || prop.identifier;
                    const required = this.getPropertyRelationById(prop.identifier, "plus:has-roles").includes("plus:RequiredMetadata");
                    const single = this.getPropertyRelationById(prop.identifier, "plus:has-roles").includes("plus:SingleMetadata");
                    const icon = this.getPropertyRelationById(prop.identifier, "plus:has-icons")[0];
                    return {
                        value: prop.identifier,
                        text: this.getPropertyLabelById(prop.identifier),
                        type: prop.datatype,
                        required: required,
                        multiple: !single,
                        rel: relation,
                        icon: (icon) ? icon.replace(":", "-") : undefined
                    };
                })
                .sort((a,b) => (a.required) ? -1 : 1); // Pflichtmetadaten vorne sortieren
        },
        getObjectTypes() {
            return ["plus:Document", "plus:Component", "plus:Fragment"].map((type) => {
                return {
                    text: this.getPropertyLabelById(type),
                    value: type
                };
            });
        },
        isXML() {
            return this.object?.type === "plus:RuleViolation";
        },
        ...mapGetters("projects", [
            "getCurrentProjectRelationById"
        ]),
        ...mapGetters("settings", [
            "getSetting"
        ]),
        ...mapGetters("storage", [
            "getMetadataValueByURI"
        ]),
        ...mapGetters("properties", [
            "getPropertyById",
            "getPropertyRelationById",
            "getPropertiesByRole",
            "getPropertyLabelById",
            "getPropertyRelationById"
        ])
    },
    created() {
        this.objectMetadata.push(...this.getPropertiesByRole("plus:VisibleMetadata"));
    },
    methods: {
        simpleAssign(uuid, {event, uri}) {
            this.saveMetaDatum({
                objectUuid: uuid,
                objectMeta: {
                    uri,
                    provenance: "User",
                    confidence: 1,
                    value: event
                }
            });
        },
        setObjectType(type) {
            this.saveObjectLocal({
                uuid: this.object.uuid,
                type: type
            });
        },
        checkDependencyValue(dependentRelation, dependentValue) {
            return dependentRelation.some((rel) => {
                let assigned = this.getMetadataValueByURI(this.object.uuid, rel);
                let compare = (Array.isArray(assigned)) ? assigned : [assigned];
                return compare.filter(Boolean).some((val) => {
                    return dependentValue.includes(val);
                });
            });
        },
        checkDependencyMapping(dependentRelation) {
            return  !!this.getMetadataValueByURI(this.object.uuid, dependentRelation[0]);
        },
        addObjectMetadataField(metadata) {
            this.objectMetadata.push(metadata);
        },
        ...mapActions("storage", [
            "addMetadata",
            "updateMetadata",
            "saveMetaDatum",
            "saveObjectLocal"
        ])
    }
};
</script>
