import validations from "@/config/imports/schema-rules";
import { v4 as uuid } from "uuid";

const Serializer = new XMLSerializer();
const Parser = new DOMParser();

const validationIdAttr = "iirds:validation";
const documentMimeType = "application/xml";
const type = "Schema";


export default {
    async validate(zipArchive, scope, fileName) {
        const schemaViolations = [];
        const documentString = await zipArchive.files["META-INF/metadata.rdf"].async("string");
        const { processedString, lineMap, lineArr } = this.preprocessDocumentString(documentString);
        const document = Parser.parseFromString(processedString, documentMimeType);
        const iiRDSVersion = document.querySelector("iiRDSVersion").textContent;

        const scopedTests = validations.filter(v => v.assert).filter(v => !scope || scope === v.scope);
        const checkedSchemaRules = scopedTests.length;
        for (let test of scopedTests) {
            const selection = Array.from(document.querySelectorAll(test.path));
            const pass = test.assert(selection, document);
            if (!pass) {
                const result = (test.getInvalid) ? test.getInvalid(selection, document) : [];
                if (result.length) {
                    for (let element of result) {
                        const { location, lineNr, lines } = this.getLocation(element, lineMap, lineArr);
                        const elems = Serializer.serializeToString(element);
                        schemaViolations.push({ ...test, fileName, type, scope, location, lineNr, lines, elems });
                    }
                } else {
                    schemaViolations.push({ ...test, fileName, type, scope });
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

        const validationIdRexExp = `${validationIdAttr}="[\\w\\-\\/\\.#\\d:]+"\\s?`;
        let xmlTxt = Serializer.serializeToString(element);

        xmlTxt = xmlTxt.replace(/xmlns:\w{2,5}="[\w\-\/\.#\d:]+"\s?/g, "");
        xmlTxt = xmlTxt.replace(new RegExp(validationIdRexExp, "g"), "");

        return { location: xmlTxt, lineNr, lines: lines.join("\n") };
    }
};

export function validateSingleRule(document, rule) {
    const selection = Array.from(document.querySelectorAll(rule.path));
    const result = rule?.assert(selection, document);
    const succeeded = (result === undefined) ? true : result; // strict comparison to undefined
    const invalidElements = rule?.getInvalid(selection, document);
    return { succeeded, invalidElements };
}
