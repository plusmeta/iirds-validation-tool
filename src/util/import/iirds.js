// import JSzip from "jszip";
import semver from "semver";

import objectTemplate from "@/store/storage/template";

import schemaValidation from "@/util/validator-schema";
import containerValidation from "@/util/validator-container";
import systemValidations from "@/config/imports/system-rules";

import { ConfConst } from "@/config/imports/const";

const VERBOSE = process.env.NODE_ENV !== "production";
const MAX_VIOLATIONS = 100;

export default {
    mimeType: {
        name: "application/iirds+zip",
        extension: "iirds"
    },
    params: {
        projectUuid: null,
        store: null
    },
    violationObjects: [],
    logs: [],
    async analyze(projectUuid, objectUuid, objectData, objectFilename, store) {
        this.params = {projectUuid, store};

        let processable = true;
        let totalRulesChecked = 0;
        let detectedVersion = "1.1";

        // Container validation based on ruleset
        const {containerViolations, zipArchive, checkedContainerRules} = await containerValidation.validate(objectData, null, objectFilename);
        if (containerViolations && Array.isArray(containerViolations)) {
            let containerViolationObjectUuids = [];

            for (let containerViolation of containerViolations) {
                let containerUuid = await this.setViolation(objectUuid, containerViolation);
                containerViolationObjectUuids.push(containerUuid);
            }

            await this.params.store.dispatch("projects/addObjectsToProject", {
                projectUuid: this.params.projectUuid,
                objectUuids: containerViolationObjectUuids
            });

            if (containerViolations.some(violation => violation.break)) processable = false;
        } else {
            processable = false;
            await this.setViolation(objectUuid, systemValidations["S2"]);
        }

        totalRulesChecked += checkedContainerRules;

        if (processable) {
            // Schema validation based on ruleset
            const {schemaViolations, checkedSchemaRules, iiRDSVersion} = await schemaValidation.validate(zipArchive, null, "metadata.rdf");
            if (schemaViolations && Array.isArray(schemaViolations)) {
                let schemaViolationObjectUuids = [];

                for (let schemaViolation of schemaViolations) {
                    let schemaUuid = await this.setViolation(objectUuid, schemaViolation);
                    schemaViolationObjectUuids.push(schemaUuid);
                }

                await this.params.store.dispatch("projects/addObjectsToProject", {
                    projectUuid: this.params.projectUuid,
                    objectUuids: schemaViolationObjectUuids
                });
            } else {
                await this.setViolation(objectUuid, systemValidations["S3"]);
            }

            detectedVersion = iiRDSVersion;
            totalRulesChecked += checkedSchemaRules;
        }


        let violationObjects = this.violationObjects;
        if (violationObjects.length > MAX_VIOLATIONS) {
            await this.params.store.dispatch("projects/updateCurrentProjectRelations", { maxViolationsExceeded: true });
            violationObjects = violationObjects.slice(0, MAX_VIOLATIONS);
        }

        await this.params.store.dispatch("storage/saveObjectsLocal", violationObjects);

        await this.params.store.dispatch("projects/updateCurrentProjectRelations", { totalRulesChecked });
        await this.params.store.dispatch("projects/updateCurrentProjectRelations", { detectedVersion });

        await this.params.store.dispatch("projects/nextProjectStepLocal");

    },
    checkConformanceLevel(objectUuid) {
        let version = this.params.store.getters["storage/getMetadataValueByURI"](objectUuid, "iirds:iiRDSVersion");
        let restriction = this.params.store.getters["storage/getMetadataValueByURI"](objectUuid, "iirds:formatRestriction");

        if (version) {
            version = semver.coerce(String(version));
            version = [semver.major(version), semver.minor(version)].join(".");
        } else {
            this.log("No iiRDS version set", "error");
            version = "1.0";
        }

        if (restriction) {
            restriction = String(restriction).toUpperCase();
        }
        return {version, restriction};
    },
    setViolation(objectUuid, test) {
        const locale = this.params.store.getters["settings/getCurrentLocale"];
        const violationObject = objectTemplate.object({
            externalId: objectUuid,
            type: "plus:RuleViolation",
            name: test.rule[locale],
            text: test.location,
            meta: {
                "plus:RuleText": objectTemplate.metadata({
                    uri: "plus:RuleText",
                    value: (test.info) ? `${test.info[locale]} (${test.rule[locale]})`: test.rule[locale],
                }),
                "plus:Rule": objectTemplate.metadata({
                    uri: "plus:Rule",
                    value: test.id,
                }),
                "plus:SubFile": objectTemplate.metadata({
                    uri: "plus:SubFile",
                    value: test.file,
                }),
                "plus:LineNr": objectTemplate.metadata({
                    uri: "plus:LineNr",
                    value: Number(test.lineNr),
                }),
                "plus:Lines": objectTemplate.metadata({
                    uri: "plus:Lines",
                    value: test.lines,
                }),
                "plus:Level": objectTemplate.metadata({
                    uri: "plus:Level",
                    value: test.prio,
                }),
                "plus:Spec": objectTemplate.metadata({
                    uri: "plus:Spec",
                    value: test.spec,
                }),
                "plus:OriginalFileName": objectTemplate.metadata({
                    uri: "plus:OriginalFileName",
                    value: test.fileName,
                }),
                "plus:RuleType": objectTemplate.metadata({
                    uri: "plus:RuleType",
                    value: test.type,
                })

            }
        });

        this.violationObjects.push(violationObject);
        return violationObject.uuid;
    },
    async setValidationResult(objectUuid, version, restriction) {
        let conformityString = `iiRDS ${version}`;
        if (restriction) conformityString = `${conformityString}/${restriction}`;

        if (this.logs.length) {
            await this.params.store.dispatch("storage/addMetadata", {
                objectUuid,
                objectMeta: {
                    uri: ConfConst.CONFORMITY_REPORT_PROP_ID,
                    value: this.logs,
                    provenance: "System"
                }
            });
        }

        await this.params.store.dispatch("storage/addMetadata", {
            objectUuid,
            objectMeta: {
                uri: ConfConst.CONFORMITY_PROP_ID,
                value: [conformityString],
                provenance: "System"
            }
        });

        this.logs = [];
    },
    log(msg, level) {
        if (level !== "info") this.logs.push(msg);
        // eslint-disable-next-line no-console
        if (VERBOSE) console.log(msg);
    }
};
