const isBuiltIn = uri => uri.startsWith("http://iirds.tekom.de/iirds");

const isExactlyOneChild = (el, selector) => el.querySelectorAll(`:scope > ${selector}`).length === 1;

export const isDirectoryRoot = (el) => {
    return !["has-next-sibling", "has-first-child", "DirectoryNode"].includes(el.parentElement.localName);
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
        return isBuiltIn(resource) || doc.querySelector(`[*|about='${resource}']`)?.localName === className;
    } else {
        return doc.querySelector(className);
    }
});

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
        return !isBuiltIn(resource) && doc.querySelector(`[*|about='${el.getAttribute("rdf:resource")}']`)?.localName !== className;
    } else {
        return !doc.querySelector(`:scope > ${className}`);
    }
});
