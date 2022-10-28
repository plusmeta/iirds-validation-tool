/*
 * plusmeta app
 * (c) 2022 plusmeta GmbH
 */

import { expect } from "chai";

import validations from "@/config/imports/schema-rules";
import { validateSingleRule } from "@/util/validator-schema.js";
import { readFileSync } from "fs";

describe("validate iiRDS schema", () => {
    const parser = new DOMParser();
    for (let validation of validations) {
        for (let [expectation, filePathList] of Object.entries(validation?.testFiles ?? [])) {
            for (let i = 0; i < filePathList.length; i++) {
                const expectSymbol = expectation.substring(0,1).toUpperCase() + i;
                const testText = validation.rule.en.substring(0, 70) + "...";
                it(`[${validation.id}][${expectSymbol}] ${testText}`, () => {
                    const xmlContent = readFileSync(filePathList[i], "utf8");
                    const rdfDoc = parser.parseFromString(xmlContent, "application/xml");
                    const { succeeded, invalidElements } = validateSingleRule(rdfDoc, validation);

                    if (expectation === "true" ) {
                        expect(succeeded).to.be.true;
                        expect(invalidElements).to.be.empty;
                    } else {
                        expect(succeeded).to.be.false;
                        //expect(invalidElements).not.to.be.empty;
                    }
                });
            }
        }
    }
});
