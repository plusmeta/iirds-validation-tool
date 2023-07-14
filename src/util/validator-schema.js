import validations from "@/config/validation/schema-rules";

import { v4 as uuid } from "uuid";
import formatXML from "xml-formatter";

const Serializer = new XMLSerializer();
const Parser = new DOMParser();

const validationIdAttr = "iirds:validation";
const documentMimeType = "application/xml";
const type = "Schema";


export default {
    async validate(zipArchive, prio, fileName) {
        const schemaViolations = [];
        const documentBuffer = await zipArchive.files["META-INF/metadata.rdf"].async("arraybuffer");
        const documentString = new TextDecoder("utf-8", {ignoreBOM: false}).decode(documentBuffer);
        const { processedString, lineMap, lineArr } = this.preprocessDocumentString(documentString);
        const document = Parser.parseFromString(processedString, documentMimeType);
        const iiRDSVersion = document.querySelector("iiRDSVersion")?.textContent;

        const scopedTests = validations.filter(v => v.assert).filter(v => !prio || v.prio === prio);
        const checkedSchemaRules = scopedTests.length;
        for (let test of scopedTests) {
            const selection = Array.from(document.querySelectorAll(test.path));
            const pass = test.assert(selection, document);
            if (!pass) {
                const result = (test.getInvalid) ? test.getInvalid(selection, document) : [];
                if (result.length) {
                    for (let element of result) {
                        const { location, lineNr, lines } = this.getLocation(element, lineMap, lineArr);
                        const elems = this.cleanUpXML(formatXML(element.outerHTML));
                        schemaViolations.push({ ...test, fileName, type, prio, location, lineNr, lines, elems });
                    }
                } else {
                    schemaViolations.push({ ...test, fileName, type, prio });
                }
            }
        }
        return { schemaViolations, checkedSchemaRules, iiRDSVersion };
    },
    preprocessDocumentString(documentString) {
        const lineArr = documentString.split("\n");
        const lineMap = {};

        const processedString = lineArr.map((line, i) => {
            return line.replace(/(<\w+:(?!RDF)[\w\-]+)([\s>])/g,
                (match, p1, p2) => {
                    const validationId = uuid();
                    lineMap[validationId] = i + 1;
                    return `${p1} ${validationIdAttr}="${validationId}"${p2}`;
                });
        }).join("\n");

        return { processedString, lineMap, lineArr };
    },
    getLocation(element, lineMap, lineArr) {
        const validationId = element.getAttribute(validationIdAttr);
        const lineNr = lineMap[validationId];
        const lines = lineArr.slice(Math.max(0, lineNr - 4), Math.min(lineArr.length, lineNr + 3));

        let xmlTxt = Serializer.serializeToString(element);

        return { location: this.cleanUpXML(xmlTxt), lineNr, lines: lines.join("\n") };
    },
    cleanUpXML(xmlTxt) {
        const validationIdRexExp = `${validationIdAttr}="[\\w\\-\\/\\.#\\d:]+"\\s?`;
        xmlTxt = xmlTxt.replace(/xmlns:\w{2,5}="[\w\-\/\.#\d:]+"\s?/g, "");
        xmlTxt = xmlTxt.replace(new RegExp(validationIdRexExp, "g"), "");
        return xmlTxt;
    }
};

// for automated testing of rules (unit tests)
export function validateSingleRule(document, rule) {
    const selection = Array.from(document.querySelectorAll(rule.path));
    const result = rule?.assert(selection, document);
    const succeeded = (result === undefined) ? true : result; // strict comparison to undefined
    const invalidElements = rule?.getInvalid(selection, document);
    return { succeeded, invalidElements };
}
