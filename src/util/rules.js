import {IdConst} from "@/util/const";

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

export const isOneOrMore = (els, doc, selector) => (els && els.length) ? els.every((el) => {
    const selected = Array.from(el.children).filter(child => child.localName === selector);
    return selected.length >= 1;
}) : true;

export const isZeroOrOne = (els, selector) => (els && els.length) ? els.every((el) => {
    return Array.from(el.children).filter(child => child.localName === selector).length <= 1;
}) : true;

export const isExactlyOne = (els, doc, selector) => (els && els.length) ? els.every((el) => {
    const selected = Array.from(el.children).filter(child => child.localName === selector);
    return selected.length === 1;
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
    return Array.from(el.children).filter(child => child.localName === selector).length > 1;
}).filter(Boolean);

export const getZeroOrMoreThanOne = (els, doc, selector) => els.filter((el) => {
    const selected = Array.from(el.children).filter(child => child.localName === selector);
    return selected.length > 1 || selected.length === 0;
}).filter(Boolean);

export const getMissing = (els, selector) => els.filter((el) => {
    return Array.from(el.children).filter(child => child.localName === selector).length === 0;
});

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


const VALID_INSTANCE_TYPES = [
    IdConst.IIRDS_OBJECTINSTANCEURI,
    IdConst.IIRDS_OBJECTTYPEURI,
    IdConst.IIRDS_SERIALNUMBER
];

// get identity type and domain URI from a has-identity element
const getIdentityTypeAndDomain = (hasIdentityEl, doc) => {
    const identityUri = hasIdentityEl.getAttribute("rdf:resource");
    if (!identityUri) return null;

    const identity = doc.querySelector(`[*|about='${identityUri}']`);
    if (!identity) return null;

    const hasIdentityDomainEl = identity.querySelector(":scope > has-identity-domain");
    if (!hasIdentityDomainEl) return null;

    const identityDomainUri = hasIdentityDomainEl.getAttribute("rdf:resource");
    if (!identityDomainUri) return null;

    const identityDomain = doc.querySelector(`[*|about='${identityDomainUri}']`);
    if (!identityDomain) return null;

    let identityType = null;
    const hasIdentityTypeEl = identityDomain.querySelector(":scope > has-identity-type");
    if (hasIdentityTypeEl) {
        identityType = hasIdentityTypeEl.getAttribute("rdf:resource");
    }
    return { identityType, identityDomainUri };
};

// Check if an IdentityDomain relates to a Party with Manufacturer role and vcard:Organization with organization-name
export const hasPartyWithVcard = (identityDomainUri, doc, partyRole) => {
    const identityDomain = doc.querySelector(`[*|about='${identityDomainUri}']`);
    if (!identityDomain) return false;

    const relatesPartyEl = identityDomain.querySelector(":scope > relates-to-party");
    if (!relatesPartyEl) return false;

    const partyUri = relatesPartyEl.getAttribute("rdf:resource");
    if (!partyUri) return false;

    return hasValidPartyRole(partyUri, doc, partyRole);
};



// Check if a Party has the specified role and a vcard:Organization with organization-name
export const hasValidPartyRole = (partyUri, doc, partyRole) => {
    const party = doc.querySelector(`[*|about='${partyUri}']`);
    if (!party) return false;

    const hasPartyRoleEl = party.querySelector(":scope > has-party-role");
    if (!hasPartyRoleEl || hasPartyRoleEl.getAttribute("rdf:resource") !== partyRole) return false;

    const relatesToVcardEl = party.querySelector(":scope > relates-to-vcard");
    if (!relatesToVcardEl) return false;

    const vcardUri = relatesToVcardEl.getAttribute("rdf:resource");
    if (!vcardUri) return false;

    const vcard = doc.querySelector(`[*|about='${vcardUri}']`);
    if (!vcard || vcard.localName !== "organization") return false;

    const organizationName = vcard.querySelector(":scope > organization-name");
    return !!organizationName && organizationName.textContent.trim() !== "";
};

// Check if ProductVariant has a valid Instance Identity (ObjectInstanceURI/ObjectTypeURI/SerialNumber)
export const hasValidInstanceIdentity = (productVariantUri, doc) => {
    const productVariant = doc.querySelector(`[*|about='${productVariantUri}']`);
    if (!productVariant) return false;

    const hasIdentityEls = Array.from(productVariant.querySelectorAll(":scope > has-identity"));

    for (let hasIdentityEl of hasIdentityEls) {
        const result = getIdentityTypeAndDomain(hasIdentityEl, doc);
        if (result && VALID_INSTANCE_TYPES.includes(result.identityType)) {
            return true;
        }
    }
    return false;
};

// Check if ProductVariant has a valid Instance Identity (ObjectInstanceURI/ObjectTypeURI/SerialNumber)
export const hasValidIdentity = (informationObjectUri, doc) => {
    const hasIdentityEls = Array.from(informationObjectUri.querySelectorAll(":scope > has-identity"));
    for (let hasIdentityEl of hasIdentityEls) {
        const result = getIdentityTypeAndDomain(hasIdentityEl, doc);
        if (result) {
            return hasPartyWithVcard(result.identityDomainUri, doc, IdConst.IIRDS_PARTYROLE_CREATOR);
        }
    }
    return false;
};

// Check if the Instance Identity's IdentityDomain has Manufacturer with vcard
export const hasValidInstanceIdentityManufacturer = (productVariantUri, doc) => {
    const productVariant = doc.querySelector(`[*|about='${productVariantUri}']`);
    if (!productVariant) return false;

    const hasIdentityEls = Array.from(productVariant.querySelectorAll(":scope > has-identity"));

    for (let hasIdentityEl of hasIdentityEls) {
        const result = getIdentityTypeAndDomain(hasIdentityEl, doc);
        if (result && VALID_INSTANCE_TYPES.includes(result.identityType)) {
            return hasPartyWithVcard(result.identityDomainUri, IdConst.IIRDS_PARTYROLE_MANUFACTURER);
        }
    }
    return false;
};

// Check if ProductVariant has a ProductType Identity
export const hasValidProductTypeIdentity = (productVariantUri, doc) => {
    const productVariant = doc.querySelector(`[*|about='${productVariantUri}']`);
    if (!productVariant) return false;

    const hasIdentityEls = Array.from(productVariant.querySelectorAll(":scope > has-identity"));

    for (let hasIdentityEl of hasIdentityEls) {
        const result = getIdentityTypeAndDomain(hasIdentityEl, doc);
        if (result && result.identityType === IdConst.IIRDS_PRODUCTTYPE) {
            return true;
        }
    }
    return false;
};

// Check if the ProductType Identity's IdentityDomain has Manufacturer with vcard
export const hasValidProductTypeIdentityManufacturer = (productVariantUri, doc) => {
    const productVariant = doc.querySelector(`[*|about='${productVariantUri}']`);
    if (!productVariant) return false;

    const hasIdentityEls = Array.from(productVariant.querySelectorAll(":scope > has-identity"));

    for (let hasIdentityEl of hasIdentityEls) {
        const result = getIdentityTypeAndDomain(hasIdentityEl, doc);
        if (result && result.identityType === IdConst.IIRDS_PRODUCTTYPE) {
            return hasPartyWithVcard(result.identityDomainUri, doc, IdConst.IIRDS_PARTYROLE_MANUFACTURER);
        }
    }
    return false;
};

