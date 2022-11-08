<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-stepper
    v-if="getSteps.length"
    id="workflowSteps"
    v-model="currentProgress"
    class="elevation-0"
    @change="checkRoute"
  >
    <v-stepper-items style="min-height: 100%">
      <template v-for="(step, index) in getSteps">
        <v-stepper-content
          :key="`item-${index}`"
          :step="index + 1"
        >
          <component
            :is="step.component"
            v-if="getCurrentProgress > index && objectsReady"
            v-bind="step.hasOwnProperty('props') ? step.props : {}"
          />
          <Loading v-else />
        </v-stepper-content>
      </template>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import util from "@/util";
import Loading from "@/shared/step/StepLoading";

export default {
    name: "OtkWorkflow",
    components: { Loading },
    data() {
        return {
            steps: [],
            objectsReady: false
        };
    },
    computed: {
        currentProgress: {
            get () {
                return this.getCurrentProgress;
            },
            set (value) {
                return this.setCurrentProgressLocal(value);
            }
        },
        getSteps() {
            let workflow = this.getCurrentWorkflow;
            return (workflow) ? [...workflow.steps] : [];
        },
        ...mapGetters("projects", [
            "getProjectByUuid",
            "getCurrentProgress",
            "getCurrentWorkflowId"
        ]),
        ...mapGetters("workflows", [
            "getCurrentWorkflow",
            "getWorkflowById",
            "getWorkflowNameById",
            "getWorkflowStepById",
            "getWorkflowStepNameById"
        ]),
        ...mapGetters("settings", [
            "getCurrentProjectUuid"
        ])
    },
    watch: {
        currentProgress: async function (to) {
            await this.setCurrentStep(to);
        },
        "$route.name": async function () {
            await this.setCurrentStep(this.getCurrentProgress);
        }
    },
    async created() {
        await this.checkRoute();
    },
    methods: {
        calcLastValidProgress() {
            for (let progressIdx = 0; progressIdx < this.getCurrentWorkflow?.steps.length; progressIdx++) {
                const step = this.getCurrentWorkflow?.steps[progressIdx];
                const rules = step?.rules || [];
                if (!rules.every(rule => rule(this.$store))) {
                    return progressIdx + 1;
                }
            }
            return this.getCurrentProgress;
        },
        async setCurrentStep(to) {
            let index = (to) ? to - 1 : 0;
            let projectUuid = this.getCurrentProjectUuid;
            let workflow = this.getCurrentWorkflow || null;
            let workflowId = (workflow) ? workflow.id : null;
            let stepId = (workflow) ? workflow.steps[index].id : null;
            let workflowName = (workflow) ? this.getWorkflowNameById(workflowId) : null;
            let stepName = (workflow) ? this.getWorkflowStepNameById({workflowId, stepId}) : null;
            if (projectUuid && workflowId && stepId && workflowName && stepName) {
                let newTitle = util.createTitle(`${workflowName} - ${stepName}`, "tekom");
                if (this.$route.params.workflowId === workflowId && this.$route.params.stepId === stepId && newTitle === document.title) {
                    return;
                }
                document.title = newTitle;
                if (this.$route.params.workflowId !== workflowId || this.$route.params.stepId !== stepId) {
                    const route = {
                        name: "OtkWorkflowStep",
                        params: {
                            projectUuid: projectUuid,
                            workflowId: workflowId,
                            stepId: stepId
                        }
                    };

                    if (this.$route.name === "OtkWorkflowView") {
                        await this.$router.replace(route);
                    } else {
                        await this.$router.push(route);
                    }
                }
            } else {
                if (this.$route.name !== "NotFound") {
                    await this.$router.push({ name: "NotFound" });
                }
            }
        },
        async checkRoute() {
            this.objectsReady = true;
            if (this.getCurrentWorkflowId === null) {
                if (this.$route.name !== "NotFound") await this.$router.push({ name: "NotFound" });
            } else if (this.getCurrentProgress === 0) {
                await this.setCurrentProgressLocal(1);
                await this.updateProjectStatus({projectUuid: this.getCurrentProjectUuid, status: 1});
                // this.$notify.send(this.$t("Notification.openedProject", ), "info");
            } else {
                await this.setCurrentStep(this.getCurrentProgress);
            }
        },
        ...mapActions("projects", [
            "setCurrentProgressLocal",
            "updateProjectStatus"
        ]),
        ...mapActions("settings", [
            "setCurrentProjectLocal"
        ])
    }
};
</script>

<style>
#workflowSteps {
    min-height: 100%;
    background: none;
}
</style>
