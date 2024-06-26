const isBuiltIn = uri => uri.startsWith("http://iirds.tekom.de/iirds");

const isExactlyOneChild = (el, selector) => el.querySelectorAll(`:scope > ${selector}`).length === 1;

export const isDirectoryRoot = (els, dirRoot) => {
    const id = dirRoot.getAttribute("rdf:about");
    let hasRefChild = false;
    let hasRefSibling = false;
    if (id !== null) {
        hasRefChild = els.some(el => el.querySelector(":scope > has-first-child")?.getAttribute("rdf:resource") === id);
        hasRefSibling = els.some(el => el.querySelector(":scope > has-next-sibling")?.getAttribute("rdf:resource") === id);
    }
    return !hasRefChild && !hasRefSibling &&
        dirRoot.parentElement.localName !== "has-first-child" && dirRoot.parentElement.localName !== "has-next-sibling";
};
export const mayHasExternalClassification = (el) => {
    return [
        "Component",
        "ProductVariant",
        "ProductFunction",
        "ProductProperty",
        "InformationPackage",
        "Topic",
        "Fragment",
        "Document"
    ].includes(el.parentElement.localName);
};
export const getAbsoluteIRIRegExp = () => new RegExp(/^(\w+:|www\.)[\S]+/);

export const includesAll = (small, big) => small.every(n => big.indexOf(n) !== -1);

export const isOneOrMore = (els, selector) => (els && els.length) ? els.every(el => el.querySelectorAll(`:scope > ${selector}`).length >= 1) : true;

export const isZeroOrOne = (els, selector) => (els && els.length) ? els.every(el => el.querySelectorAll(`:scope > ${selector}`).length <= 1) : true;

export const isExactlyOne = (els, doc, selector) => (els && els.length) ? els.every((el) => {
    if (el.hasAttribute("rdf:about")) {
        const resource = el.getAttribute("rdf:about");
        return Array.from(doc.querySelectorAll(`[*|about='${resource}']`)).some(res => isExactlyOneChild(res, selector));
    } else {
        return isExactlyOneChild(el, selector);
    }
}) : true;

export const isDefinedAsClass = (els, doc, className) => els.every((el) => {
    if (el.hasAttribute("rdf:resource")) {
        const resource = el.getAttribute("rdf:resource");
        return isBuiltIn(resource) ||
            doc.querySelector(`[*|about='${resource}']`)?.localName === className ||
            isCustomDefined(resource, doc, className);
    } else {
        return doc.querySelector(className);
    }
});

export const isCustomDefined = (resource, doc, className) => {
    const elem = doc.querySelector(`[*|about='${resource}']`);
    if (!!elem) {
        const customClassUri = elem.namespaceURI + elem.localName;
        const customClassDef = doc.querySelector(`[*|about='${customClassUri}']`);
        if (!!customClassDef) {
            return customClassDef.querySelector(":scope > subClassOf")?.getAttribute("rdf:resource") === "http://iirds.tekom.de/iirds#" + className;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export const getMoreThanOne = (els, doc, selector) => els.filter((el) => {
    if (el.hasAttribute("rdf:about")) {
        const resource = el.getAttribute("rdf:about");
        return !Array.from(doc.querySelectorAll(`[*|about='${resource}']`)).some(res => isExactlyOneChild(res, selector));
    } else {
        return !isExactlyOneChild(el, selector);
    }
}).filter(Boolean);

export const getMissing = (els, selector) => els.filter(el => !el.querySelectorAll(`:scope > ${selector}`).length);

export const getNotIncluded = (small, big) => small.filter(n => big.indexOf(n) === -1);

export const getWrongClassInPackage = (els, doc, className) => els.filter((el) => {
    if (el.hasAttribute("rdf:resource")) {
        const resource = el.getAttribute("rdf:resource");
        return !isBuiltIn(resource) &&
            doc.querySelector(`[*|about='${el.getAttribute("rdf:resource")}']`)?.localName !== className &&
            !isCustomDefined(resource, doc, className);
    } else {
        return !doc.querySelector(`:scope > ${className}`);
    }
});
