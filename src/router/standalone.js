/*!
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import Vue from "vue";
import VueRouter from "vue-router";

import Main from "@/layout/Main";
import StepLoading from "@/shared/step/StepLoading";

import staticRoutes from "@/router/static";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: Main,
            children: [
                {
                    path: "/",
                    component: () => ({
                        component: import(/* webpackChunkName: "Workflow.view" */ "@/views/OtkWorkflow"),
                        loading: StepLoading
                    }),
                    name: "OtkWorkflowView"
                },
                {
                    path: "/:workflowId/:stepId",
                    component: () => ({
                        component: import(/* webpackChunkName: "Workflow.view" */ "@/views/OtkWorkflow"),
                        loading: StepLoading
                    }),
                    name: "OtkWorkflowStep"
                }
            ]
        },
        // 404: user is logged in
        {
            path: "*",
            component: Main,
            children: [
                ...staticRoutes
            ],
        }
    ]
});

export default router;