<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-footer
    app
    dark
    inset
    min-height="24"
    padless
    :color="getFooterColor"
  >
    <v-spacer />

    <span v-if="!isExplainerView && !isRuleViolation" class="text-caption grey--text">
      © 2022 <a href="https://plusmeta.de" target="_blank">plusmeta GmbH</a>
      &bull;
      {{ $t("Otk.licenseInfo") }} <a href="https://creativecommons.org/licenses/by-nd/4.0/">CC BY-ND 4.0</a>
      &bull;
      {{ $t("Otk.rightsInfo") }}
      &bull;
      <a href="https://iirds.org" target="_blank">iirds.org </a>
    </span>

    <v-spacer />
  </v-footer>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import util from "@/util";

export default {
    name: "OtkBottomNav",
    data() {
        return {
            showExplainer: false
        };
    },
    computed: {
        isWorkflowStarted() {
            return this.getCurrentProgress > 0;
        },
        isInternetExplorer() {
            return util.isIE();
        },
        isInActiveWorkflow() {
            return this.isWorkflowStarted &&
              this.$route.name ===  "OtkWorkflowStep";
        },
        isLastStep() {
            let progress = this.getCurrentProgress;
            let workflow = this.getCurrentWorkflow;
            if (workflow !== undefined && workflow.hasOwnProperty("steps")) {
                return progress === workflow.steps.length;
            } else {
                return true;
            }
        },
        isFirstStep() {
            return this.getCurrentProgress && this.getCurrentProgress < 2;
        },
        isExplainerView() {
            return this.isInActiveWorkflow && this.showExplainer && !this.isValid;
        },
        isValid() {
            let isValid = this.getCurrentRules.every((rule) => {
                return rule(this.$store);
            });
            return isValid && this.arePreviousRulesValid;
        },
        arePreviousRulesValid() {
            let allPreviousValid = true;
            for (let progress = 0; progress < this.getCurrentProgress - 1 ; progress++) {
                const step = this.getCurrentWorkflow?.steps[progress];
                const rules = step?.rules || [];

                const areStepRulesValid = rules.every((rule) => {
                    return rule(this.$store);
                });

                if (!areStepRulesValid) {
                    allPreviousValid = false;
                }
            }
            return allPreviousValid;
        },
        wasProjectInitialized() {
            return this.getCurrentProject.hasOwnProperty("objectUuids");
        },
        isRuleViolation() {
            return !this.arePreviousRulesValid && this.wasProjectInitialized;
        },
        getCurrentWorkflow() {
            return this.getWorkflowById(this.getCurrentWorkflowId);
        },
        getFooterColor() {
            if (this.isInActiveWorkflow && !this.arePreviousRulesValid) return "error";
            if (this.isInActiveWorkflow && this.isExplainerView) return "info";
            return "default";
        },
        ...mapGetters("projects", [
            "getCurrentWorkflowId",
            "getCurrentProgress",
            "getCurrentProject"
        ]),
        ...mapGetters("workflows", [
            "getWorkflowById",
            "getCurrentRules",
            "getCurrentExplanation"
        ])
    },
    methods: {
        getLastValidStep() {
            for (let progress = 0; progress <= this.getCurrentProgress - 1 ; progress++) {
                const step = this.getCurrentWorkflow?.steps[progress];
                const rules = step?.rules || [];

                const arePreviousRulesValid = rules.every((rule) => {
                    return rule(this.$store);
                });

                if (!arePreviousRulesValid) {
                    return progress + 1;
                }
            }
            return this.getCurrentProgress;
        },
        async nextStep() {
            if (!this.isLastStep) {
                this.showExplainer = false;
                let workflow = this.getCurrentWorkflow;
                let nextStepId = workflow.steps[this.getCurrentProgress].id;
                await this.nextProjectStepLocal();
            }
        },
        async previousStep() {
            if (!this.isFirstStep) {
                this.showExplainer = false;
                let workflow = this.getCurrentWorkflow;
                let previousStepId = workflow.steps[this.getCurrentProgress - 2].id;
                if (this.arePreviousRulesValid) {
                    await this.previousProjectStepLocal();
                } else {
                    await this.setCurrentProgressLocal(this.getLastValidStep());
                }
            }
        },
        async closeProject() {
            this.showExplainer = false;
            await this.$router.push({name: "OtkThankYou"});
        },
        ...mapActions("projects", [
            "nextProjectStepLocal",
            "previousProjectStepLocal",
            "setCurrentProgressLocal"
        ])
    }
};
</script>
<style>
  .theme--dark.v-btn--active.no-color-change:hover::before,
  .theme--dark.v-btn--active.no-color-change::before  {
    opacity: 0;
  }
</style>
