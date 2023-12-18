
import {
    getAbsoluteIRIRegExp,
    getMissing,
    getMoreThanOne,
    getNotIncluded,
    getWrongClassInPackage,
    includesAll,
    isDefinedAsClass,
    isDirectoryRoot,
    isExactlyOne,
    isOneOrMore,
    isZeroOrOne
} from "@/util/rules";

export default [
    {
        id: "M1",
        path: "InformationUnit",
        assert: els => els.length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "not intended to be used directly",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-package-and-container:~:text=iiRDS%20Generators%20MUST%20NOT%20use%20the%20iirds%3AInformationUnit%20class%20directly%20but%20MUST%20use%20one%20of%20the%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS-Generatoren DÜRFEN NICHT die Klasse iirds:InformationUnit direkt verwenden, sondern MÜSSEN eine der Unterklassen verwenden",
            "en": "iiRDS Generators MUST NOT use the iirds:InformationUnit class directly but MUST use one of the subclasses"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M1_false.rdf"]
        }
    },
    {
        id: "M2.1",
        path: "Document, Topic, Fragment, Package",
        assert: els => els.every(el => el.hasAttribute("rdf:about")),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about")),
        prio: "MUST",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=An%20instance%20of%20an%20iirds%3AInformationUnit%20subclass%20MUST%20have%20an%20IRI%20and%20MUST%20NOT%20be%20a%20blank%20node.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine Instanz einer iirds:InformationUnit-Unterklasse MUSS einen IRI haben.",
            "en": "An instance of an iirds:InformationUnit subclass MUST have an IRI."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.1_false.rdf"]
        }
    },
    {
        id: "M2.3",
        path: "Document, Topic, Fragment, Package",
        assert: els => isZeroOrOne(els, "dateOfCreation"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "dateOfCreation"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3AdateOfCreation%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:InformationUnit DARF NICHT mehr als eine Eigenschaft iirds:dateOfCreation haben.",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:dateOfCreation."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.3_false.rdf"]
        }
    },
    {
        id: "M2.4",
        path: "Document, Topic, Fragment, Package",
        assert: els => isZeroOrOne(els,"dateOfLastModification") ,
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "dateOfLastModification"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3AdateOfLastModification%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:InformationUnit DARF NICHT mehr als eine Eigenschaft haben iirds:dateOfLastModification.",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:dateOfLastModification."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_-M2.4_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.4_false.rdf"]
        }
    },
    {
        id: "M2.5",
        path: "Document, Topic, Fragment, Package",
        assert: els => isZeroOrOne(els, "revision"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "revision"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Arevision%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:InformationUnit DARF NICHT mehr als eine Eigenschaft iirds:revision haben.",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:revision."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.5_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.5_false.rdf"]
        }
    },
    {
        id: "M2.6",
        path: "Document, Topic, Fragment, Package",
        assert: els => isZeroOrOne(els, "title"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "title"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Atitle%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:InformationUnit DARF NICHT mehr als eine Eigenschaft iirds:title haben.",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:title."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.6_false.rdf"]
        }
    },
    {
        id: "M2.7",
        path: "Document, Topic, Fragment, Package",
        assert: els => isZeroOrOne(els, "has-abstract"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-abstract"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Ahas%2Dabstract%20property",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:InformationUnit DARF NICHT mehr als eine Eigenschaft haben iirds:has-abstract.",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:has-abstract."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.7_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.7_false.rdf"]
        }
    },
    {
        id: "M2.8",
        path: "Document, Topic, Fragment, Package",
        assert: els => isZeroOrOne(els, "is-replacement-of "),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "is-replacement-of "),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Ais%2Dreplacement%2Dof%20property%20%2D%20iirds%3AInformationUnit",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:InformationUnit DARF NICHT mehr als eine Eigenschaft iirds:is-replacement-of haben.",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:is-replacement-of."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.8_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.8_false.rdf"]
        }
    },
    {
        id: "M2.9",
        path: "Document, Topic, Fragment, Package",
        assert: els => isZeroOrOne(els, "is-version-of "),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "is-version-of "),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_InformationUnit:~:text=0..1%C2%A0%20iirds%3Ais%2Dversion%2Dof%20property%20%2D%20iirds%3AInformationObject",
        Version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:InformationUnit DARF NICHT mehr als eine Eigenschaft iirds:is-version-of haben.",
            "en": "iirds:InformationUnit MUST NOT have more than one property iirds:is-version-of ."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.9_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M2.9_false.rdf"]
        }
    },
    {
        id: "M3",
        path: "Package",
        assert: els => els.length === 1,
        getInvalid: els => els.slice(1),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=Each%20iiRDS%20package%20MUST%20have%20exactly%20one%20corresponding%20iirds%3APackage%20instance%20in%20the%20metadata.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        category: "cardinality 1",
        rule: {
            "de": "Jedes iiRDS-Paket MUSS genau eine entsprechende iirds:Package-Instanz in den Metadaten haben.",
            "en": "Each iiRDS package MUST have exactly one corresponding iirds:Package instance in the metadata."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M3.1_false.rdf"]
        }
    },
    {
        id: "M4",
        path: "Package",
        assert: (els, doc) => isExactlyOne(els, doc, "iiRDSVersion"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "iiRDSVersion"),
        prio: "MUST",
        category: "must use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#nested-iirds-packages:~:text=0..1-,iirds%3APackage,1,-iirds%3AParty",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS:Package MUSS die Eigenschaft iirds:iiRDSVersion verwenden",
            "en": "iiRDS:Package MUST use property iirds:iiRDSVersion"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M4_false.rdf"]
        }
    },
    {
        id: "M5",
        path: "*",
        assert: els => els.filter(el => el.hasAttribute("rdf:about")).every(el => getAbsoluteIRIRegExp().test(el.getAttribute("rdf:about"))),
        getInvalid: els => els.filter(el => el.hasAttribute("rdf:about")).filter(el => !getAbsoluteIRIRegExp().test(el.getAttribute("rdf:about"))),
        prio: "RECOMMENDED",
        category: "absolute IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=It%20is%20RECOMMENDED%20to%20use%20absolute%20IRIs%20in%20rdf%3Aabout.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Es wird EMPFOHLEN absolute IRIs in rdf:about zu verwenden.",
            "en": "It is RECOMMENDED to use absolute IRIs in rdf:about."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M6_false.rdf"]
        }
    },
    {
        id: "M6",
        path: "RDF",
        assert: () => {
            const versions = Array.from(document.querySelectorAll("Document, Topic, Fragment, Package")).map((el) => {
                return el.querySelector("is-version-of").getAttribute("rdf:resource");
            });
            const ios = Array.from(document.querySelectorAll("InformationObject")).map((el) => {
                return el.getAttribute("rdf:about");
            });
            return includesAll(versions, ios);
        },
        getInvalid: () => {
            const versions = Array.from(document.querySelectorAll("Document, Topic, Fragment, Package")).map((el) => {
                return el.querySelector("is-version-of").getAttribute("rdf:resource");
            });
            const ios = Array.from(document.querySelectorAll("InformationObject")).map((el) => {
                return el.getAttribute("rdf:about");
            });
            return getNotIncluded(versions, ios);
        },
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=If%20information%20objects%20are%20used%2C%20each%20information%20unit%20MUST%20only%20be%20related%20to%20exactly%20one%20information%20object%20via%20iirds%3Ais%2Dversion%2Dof.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Wenn Informationsobjekte verwendet werden, DARF jede Informationseinheit nur auf genau ein Informationsobjekt über iirds:is-version-of bezogen werden.",
            "en": "If information objects are used, each information unit MUST only be related to exactly one information object via iirds:is-version-of."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 6 - An Information object with two language variants-M7_false.rdf"]
        }
    },

    {
        id: "M7.1",
        path: "InformationObject",
        assert: els => els.filter(el => el.hasAttribute("rdf:about")).every(el => getAbsoluteIRIRegExp().test(el.getAttribute("rdf:about"))),
        getInvalid: els => els.filter(el => el.hasAttribute("rdf:about")).filter(el => !getAbsoluteIRIRegExp().test(el.getAttribute("rdf:about"))),
        prio: "MUST",
        category: "absolute IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20information%20object%20MUST%20have%20an%20absolute%20IRI%20and%20MAY%20be%20related%20to%20additional%20identifications%20via%20the%20iirds%3Ahas%2Didentity%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein Informationsobjekt MUSS eine absoluten IRI haben.",
            "en": "An information object MUST have an absolute IRI."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 6 - An Information object with two language variants.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 6 - An Information object with two language variants-M8.1_false.rdf"]
        }
    },

    {
        id: "M8",
        path: "Package",
        assert: els => els.filter(el => !el.querySelectorAll("is-part-of-package").length).every(el => !el.querySelectorAll("has-rendition").length),
        getInvalid: els => els.filter(el => !el.querySelectorAll("is-part-of-package").length).filter(el => el.querySelectorAll("has-rendition")),
        prio: "MUST NOT",
        category: "must not use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iirds%3APackage%20elements%20representing%20the%20enclosing%20iiRDS%20package%20itself%20MUST%20NOT%20be%20subjects%20of%20any%20iirds%3Ahas%2Drendition%20relation.",
        version: ["V1.1"],
        rule: {
            "de": "iirds:Package-Elemente, die das umschließende iiRDS-Paket selbst darstellen, DÜRFEN NICHT Gegenstand einer iirds:has-rendition-Beziehung sein.",
            "en": "iirds:Package elements representing the enclosing iiRDS package itself MUST NOT be subjects of any iirds:has-rendition relation."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M9_false.rdf"]
        }
    },
    {
        id: "M9",
        path: "Rendition source",
        assert: els => els.every(el => !getAbsoluteIRIRegExp().test(el.textContent)),
        getInvalid: els => els.filter(el => getAbsoluteIRIRegExp().test(el.textContent)),
        prio: "MUST",
        category: "relative IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20URL%20MUST%20be%20relative%20to%20the%20root%20folder%20of%20the%20iiRDS%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die URL MUSS relativ zum Stammordner des iiRDS-Pakets sein",
            "en": "The URL MUST be relative to the root folder of the iiRDS package"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M10_false.rdf"]
        }
    },
    {
        id: "M10",
        path: "Rendition",
        assert: (els, doc) => isExactlyOne(els, doc, "source"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "source"),
        prio: "MUST",
        category: "must use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#properties-and-relations-overview:~:text=1-,iirds%3ARendition,1,-iirds%3ARendition",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Rendition MUSS die Eigenschaft iirds:source haben.",
            "en": "An iirds:Rendition MUST have the property iirds:source."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M11_false.rdf"]
        }
    },
    {
        id: "M11",
        path: "Rendition",
        assert: (els, doc) => isExactlyOne(els, doc, "format"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "format"),
        prio: "MUST",
        category: "must use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3ARendition%20MUST%20also%20have%20the%20property%20iirds%3Aformat.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Rendition MUSS die Eigenschaft iirds:format haben.",
            "en": "An iirds:Rendition MUST have the property iirds:format."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M12_false.rdf"]
        }
    },
    {
        id: "M12",
        path: "Rendition has-selector",
        assert: els => !els.some(el => el.querySelectorAll("Selector")),
        getInvalid: els => els.filter(el => el.querySelectorAll("Selector")),
        prio: "MUST NOT",
        category: "not intended to be used directly",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#x-conformance:~:text=iirds%3ARendition%20MUST%20NOT,an%20end%20identifier",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Rendition DARF NICHT direkt iirds:Selector verwenden, sondern MUSS eine seiner Unterklassen verwenden, um Teile einer Datei zu referenzieren.  Die Klasse iirds:Selector hat die folgenden Unterklassen: iirds:FragmentSelector;  iirds:RangeSelector",
            "en": "iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        },
        info: {
            "de": "iirds:Rendition DARF NICHT direkt iirds:Selector verwenden, sondern MUSS eine seiner Unterklassen verwenden, um Teile einer Datei zu referenzieren.  Die Klasse iirds:Selector hat die folgenden Unterklassen: iirds:FragmentSelector;  iirds:RangeSelector",
            "en": "iirds:Rendition MUST NOT directly use iirds:Selector but MUST use one of its subclasses to reference parts of a file. The class iirds:Selector has the following subclasses: iirds:FragmentSelector; iirds:RangeSelector"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector-M13_false.rdf"]
        }
    },
    {
        id: "M13.1",
        path: "FragmentSelector, RangeSelector",
        assert: (els, doc) => isExactlyOne(els, doc, "value"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "value"),
        prio: "MUST",
        category: "must use property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20select%20parts,fragment%2Dselector%5D.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um Teile einer Datei auszuwählen, MUSS ein iirds:Selector einen rdf:value und dcterms:conformsTo haben.  Der Wert MUSS dem durch die Eigenschaft dcterms:conformsTo angegebenen Standard entsprechen.  Es darf nur ein Standard aus der folgenden Liste von Fragmentselektoren verwendet werden: [https://www.w3.org/TR/annotation-model/",
            "en": "To select parts of a file, an iirds:Selector MUST have an rdf:value and dcterms:conformsTo. The value MUST conform to the standard specified by the property dcterms:conformsTo. Only a standard from the following list of fragment selectors MUST be used: [https://www.w3.org/TR/annotation-model/#fragment-selector]."
        },
        info: {
            "de": "Um Teile einer Datei auszuwählen, MUSS ein iirds:Selector einen rdf:value und dcterms:conformsTo haben.",
            "en": "To select parts of a file, an iirds:Selector MUST have an rdf:value and dcterms:conformsTo."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector-M14.1_false.rdf"]
        }
    },
    {
        id: "M13.2",
        path: "FragmentSelector, RangeSelector",
        assert: (els, doc) => isExactlyOne(els, doc, "conformsTo"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "conformsTo"),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20select%20parts,fragment%2Dselector%5D.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um Teile einer Datei auszuwählen, MUSS ein iirds:Selector einen rdf:value und dcterms:conformsTo haben.  Der Wert MUSS dem durch die Eigenschaft dcterms:conformsTo angegebenen Standard entsprechen.  Es darf nur ein Standard aus der folgenden Liste von Fragmentselektoren verwendet werden: [https://www.w3.org/TR/annotation-model/",
            "en": "To select parts of a file, an iirds:Selector MUST have an rdf:value and dcterms:conformsTo. The value MUST conform to the standard specified by the property dcterms:conformsTo. Only a standard from the following list of fragment selectors MUST be used: [https://www.w3.org/TR/annotation-model/#fragment-selector]."
        },
        info: {
            "de": "Der Wert MUSS dem durch die Eigenschaft dcterms:conformsTo angegebenen Standard entsprechen.  Es darf nur ein Standard aus der folgenden Liste von Fragmentselektoren verwendet werden: [https://www.w3.org/TR/annotation-model/",
            "en": "The value MUST conform to the standard specified by the property dcterms:conformsTo. Only a standard from the following list of fragment selectors MUST be used: [https://www.w3.org/TR/annotation-model/#fragment-selector]."
        },
    },
    {
        id: "M14.1",
        path: "RangeSelector",
        assert: (els, doc) => isExactlyOne(els, doc, "has-start-selector"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-start-selector"),
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20iirds%3ARangeSelector%20points,end%2Dselector.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:RangeSelector muss die Eigenschaft iirds:has-start-selector verwenden.",
            "en": "iirds:RangeSelector must use property iirds:has-start-selector."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector-M15.1_false.rdf"]
        }
    },
    {
        id: "M14.2",
        path: "RangeSelector",
        assert: (els, doc) => isExactlyOne(els, doc, "has-end-selector"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-end-selector"),
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20iirds%3ARangeSelector%20points,end%2Dselector.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:RangeSelector muss die Eigenschaft iirds:has-end-selector verwenden.",
            "en": "iirds:RangeSelector must use property iirds:has-end-selector."
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_has-selector-M15.2_false.rdf"]
        }
    },

    {
        id: "M15.1",
        path: "Document",
        assert: els => isOneOrMore(els, "has-document-type"),
        getInvalid: els => getMissing(els, "has-document-type"),
        prio: "MUST",
        category: "cardinality 1..n",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3ADocument%20class%20MUST%20have%20one%20or%20more%20relations%20to%20one%20of%20the%20standardized%20iirds%3ADocumentTypes%20defined%20in%20iirds%3AInformationType%20%3E%20iirds%3ADocumentType.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:Document MÜSSEN eine oder mehrere Beziehungen zu einem der standardisierten iirds:DocumentTypes haben, die in iirds:InformationType > iirds:DocumentType definiert sind.",
            "en": "Instances of the iirds:Document class MUST have one or more relations to one of the standardized iirds:DocumentTypes defined in iirds:InformationType > iirds:DocumentType."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample-M19.1_false.rdf"]
        }
    },

    {
        id: "M16.1",
        path: "Event",
        assert: (els, doc) => isExactlyOne(els, doc, "has-event-code"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-event-code"),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3AEvent%20class%20MUST%20have%20the%20following%20properties%3A%20iirds%3AeventCode%20and%20iirds%3AeventType.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:Event MÜSSEN die Eigenschaft iirds:eventCode haben",
            "en": "Instances of the iirds:Event class MUST have property iirds:eventCode"
        }
    },
    {
        id: "M16.2",
        path: "Event",
        assert: els => els.filter(el => !el.querySelectorAll("has-event-code")),
        getInvalid: els => els.filter(el => !el.querySelectorAll("has-event-code")),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20the%20iirds%3AEvent%20class%20MUST%20have%20the%20following%20properties%3A%20iirds%3AeventCode%20and%20iirds%3AeventType.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:Event MÜSSEN die Eigenschaft iirds:eventType haben",
            "en": "Instances of the iirds:Event class MUST have property iirds:eventType"
        }
    },

    {
        id: "M17",
        path: "relates-to-component",
        assert: (els, doc) => isDefinedAsClass(els, doc, "Component"),
        getInvalid: (els, doc) => getWrongClassInPackage(els, doc, "Component"),
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iiRDS%20package%20MUST%20NOT%20use%20an%20external%20product%20ontology%20directly.%20If%20an%20external%20product%20ontology%20is%20available%20and%20used%20in%20the%20iiRDS%20package%2C%20then%20the%20iiRDS%20package%20MUST%20also%20contain%20metadata%20labels%20as%20instances%20of%20iirds%3AComponent.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iiRDS-Paket DARF NICHT direkt eine externe Produktontologie verwenden.  Wenn eine externe Produktontologie verfügbar ist und im iiRDS-Paket verwendet wird, MUSS das iiRDS-Paket auch Metadaten-Labels als Instanzen von iirds:Component enthalten.",
            "en": "An iiRDS package MUST NOT use an external product ontology directly. If an external product ontology is available and used in the iiRDS package, then the iiRDS package MUST also contain metadata labels as instances of iirds:Component."
        },
    },

    {
        id: "M18",
        path: "relates-to-product-variant",
        assert: (els, doc) => isDefinedAsClass(els, doc, "ProductVariant"),
        getInvalid: (els, doc) => getWrongClassInPackage(els, doc, "ProductVariant"),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=iiRDS%20provides%20the%20class%20iirds%3AProductVariant%20for%20extending%20the%20iiRDS%20vocabulary%20and%20adding%20proprietary%20product%20variants.%20As%20product%20variants%20are%20a%20proprietary%20iiRDS%20extension%2C%20they%20MUST%20be%20present%20in%20the%20metadata.rdf%20of%20the%20iiRDS%20package.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iiRDS stellt die Klasse iirds:ProductVariant bereit, um das iiRDS-Vokabular zu erweitern und proprietäre Produktvarianten hinzuzufügen. Da Produktvarianten eine proprietäre iiRDS-Erweiterung sind, MÜSSEN sie in der metadata.rdf des iiRDS-Pakets vorhanden sein.",
            "en": "iiRDS provides the class iirds:ProductVariant for extending the iiRDS vocabulary and adding proprietary product variants. As product variants are a proprietary iiRDS extension, they MUST be present in the metadata.rdf of the iiRDS package."
        },
    },

    {
        id: "M19.1",
        path: "Identity",
        assert: (els, doc) => isExactlyOne(els, doc, "identifier"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "identifier"),
        prio: "MUST",
        category: "must not be empty",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AIdentity%20instance%20consists,of%20the%20iirdsIdentityDomain%20class.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine Identität MUSS durch die Eigenschaft iirds:has-identity-domain auf genau eine Domäne verweisen.",
            "en": "An identity MUST point to exactly one domain by the iirds:has-identity-domain property."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic-M30.1_false.rdf"]
        }
    },
    {
        id: "M19.2",
        path: "Identity",
        assert: els => els.every(el => el.querySelector("identifier").textContent !== ""),
        getInvalid: els => els.filter(el => el.querySelector("identifier").textContent === ""),
        prio: "MUST",
        category: "must not be empty",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AIdentity%20instance%20consists,of%20the%20iirdsIdentityDomain%20class.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Identity-Instanz besteht aus zwei Teilen: dem Wert und der Domäne.  Der Wert MUSS als nicht leerer String in der Eigenschaft iirds:identifier angegeben werden.",
            "en": "An iirds:Identity instance consists of two parts: the value and the domain. The value MUST be provided as a non-empty string in the iirds:identifier property. "
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic-M30.1_false.rdf"]
        }
    },
    {
        id: "M19.3",
        path: "Identity",
        assert: (els, doc) => isExactlyOne(els, doc, "has-identity-domain"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-identity-domain"),
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AIdentity%20instance%20consists,of%20the%20iirdsIdentityDomain%20class.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine Identität MUSS durch die Eigenschaft iirds:has-identity-domain auf genau eine Domäne verweisen.",
            "en": "An identity MUST point to exactly one domain by the iirds:has-identity-domain property."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic-M30.2_false.rdf"]
        }
    },
    {
        id: "M19.4",
        path: "has-identity-domain",
        assert: (els, doc) => isDefinedAsClass(els, doc, "IdentityDomain"),
        getInvalid: (els, doc) => getWrongClassInPackage(els, doc, "IdentityDomain"),
        prio: "MUST",
        category: "specific values allowed",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AIdentity%20instance%20consists,of%20the%20iirdsIdentityDomain%20class.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Domain MUSS eine Instanz der Klasse iirdsIdentityDomain sein.",
            "en": "The domain MUST be an instance of the iirdsIdentityDomain class."
        },
    },
    {
        id: "M20.1",
        path: "IdentityDomain",
        assert: els => els.filter(el => el.hasAttribute("rdf:about")).filter(el => getAbsoluteIRIRegExp().test(el.getAttribute("rdf:about"))),
        getInvalid: els => els.filter(el => el.hasAttribute("rdf:about")).filter(el => !getAbsoluteIRIRegExp().test(el.getAttribute("rdf:about"))),
        prio: "MUST",
        category: "absolute IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Instances%20of%20class%20iirds%3AIdentityDomain%20MUST%20have%20an%20absolute%20IRI%20and%20MAY%20link%20to%20the%20custodian%20of%20the%20domain%20via%20the%20iirds%3Ahas%2Dparty%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Instanzen der Klasse iirds:IdentityDomain MÜSSEN einen absoluten IRI haben.",
            "en": "Instances of class iirds:IdentityDomain MUST have an absolute IRI."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 29 - Identities of an information object and a topic-M31.1_false"]
        }
    },
    {
        id: "M21.1",
        path: "ContentLifeCycleStatus",
        assert: (els, doc) => isExactlyOne(els, doc, "has-content-lifecycle-status-value"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-content-lifecycle-status-value"),
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AContentLifecyleStatus%20MUST%20have%20an%20iirds%3AContentLifecyleStatusValue%20which%20is%20assigned%20by%20the%20iirds%3Ahas%2Dcontent%2Dlifecycle%2Dstatus%2Dvalue%20property.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Ein iirds:ContentLifecyleStatus MUSS einen iirds:ContentLifecyleStatusValue haben, der von der Eigenschaft iirds:has-content-lifecycle-status-value zugewiesen wird.",
            "en": "An iirds:ContentLifecyleStatus MUST have an iirds:ContentLifecyleStatusValue which is assigned by the iirds:has-content-lifecycle-status-value property."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.1_false.rdf"]
        }
    },
    {
        id: "M21.2",
        path: "ContentLifeCycleStatus",
        assert: els => isZeroOrOne(els, "dateOfEffect"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "dateOfEffect"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20180418-1.0-release/index.html#:~:text=0..1%C2%A0%20iirds%3AdateOfEffect%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:ContentLifeCycleStatus DARF NICHT mehr als eine Eigenschaft iirds:dateOfEffect haben.",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:dateOfEffect."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.2_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.2_false.rdf"]
        }
    },
    {
        id: "M21.3",
        path: "ContentLifeCycleStatus",
        assert: els => isZeroOrOne(els, "dateOfExpiry"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "dateOfExpiry"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#functional-metadata:~:text=0..1%C2%A0%20iirds%3AdateOfExpiry%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:ContentLifeCycleStatus DARF NICHT mehr als eine Eigenschaft iirds:dateOfExpiry haben.",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:dateOfExpiry."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.3_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.3_false.rdf"]
        }
    },
    {
        id: "M21.4",
        path: "ContentLifeCycleStatus",
        assert: els => isZeroOrOne(els, "dateOfStatus"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "dateOfStatus"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#functional-metadata:~:text=0..1%C2%A0%20iirds%3AdateOfStatus%20property%20%2D%20http%3A//www.w3.org/2001/XMLSchema%23dateTimeStamp",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:ContentLifeCycleStatus DARF NICHT mehr als eine Eigenschaft iirds:purpose haben.",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:purpose."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.4_false.rdf"]
        }
    },
    {
        id: "M21.5",
        path: "ContentLifeCycleStatus",
        assert: els => isZeroOrOne(els, "purpose"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "purpose"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#functional-metadata:~:text=0..1%C2%A0%20iirds%3Apurpose%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eigenschaften: 0..1 iirds:purpose Eigenschaft - http://www.w3.org/2000/01/rdf-schema",
            "en": "Properties: 0..1  iirds:purpose property - http://www.w3.org/2000/01/rdf-schema#Literal"
        },
        info: {
            "de": "iirds:ContentLifeCycleStatus DARF NICHT mehr als eine Eigenschaft iirds:dateOfStatus haben.",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:dateOfStatus."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.5_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.5_false.rdf"]
        }
    },
    {
        id: "M21.6",
        path: "ContentLifeCycleStatus",
        assert: els => isZeroOrOne(els, "relates-to-party"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "relates-to-party"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20190712-1.0.1-release/index.html#rdfproperties_core_iirdsAttribute:~:text=rdf%2Dschema%23Literal-,0..1%C2%A0%20iirds%3Arelates%2Dto%2Dparty%20property%20%2D%20iirds%3AParty,-iirds%3AContentLifeCycleStatusValue",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:ContentLifeCycleStatus DARF NICHT mehr als eine Eigenschaft iirds:relates-to-party haben.",
            "en": "iirds:ContentLifeCycleStatus MUST NOT have more than one property iirds:relates-to-party."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.6_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 32 - Topic with content lifecycle metadata-M32.6_false.rdf"]
        }
    },
    {
        id: "M22.1",
        path: "Party",
        assert: (els, doc) => isExactlyOne(els, doc, "has-party-role"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-party-role"),
        prio: "MUST",
        category: "cardinality 0..1 (Ungenauigkeit in Spec. Text impliziert cardinality 1)",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AParty%20MUST%20have%20a%20related%20iirds%3APartyRole%20that%20is%20assigned%20by%20the%20property%20iirds%3Ahas%2Dparty%2Drole%2C%20such%20as%20author%2C%20supplier%20or%20manufacturer.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Party MUSS eine zugehörige iirds:PartyRole haben, die von der Eigenschaft iirds:has-party-role zugewiesen wird, wie z. B. Autor, Lieferant oder Hersteller.",
            "en": "An iirds:Party MUST have a related iirds:PartyRole that is assigned by the property iirds:has-party-role, such as author, supplier or manufacturer."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds_validation/Example 34 - Component with manufacturer.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M22.2",
        path: "Party has-party-role",
        assert: (els, doc) => isDefinedAsClass(els, doc, "PartyRole"),
        getInvalid: (els, doc) => getWrongClassInPackage(els, doc, "PartyRole"),
        prio: "MUST",
        category: "cardinality 0..1 (Ungenauigkeit in Spec. Text impliziert cardinality 1)",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=An%20iirds%3AParty%20MUST%20have%20a%20related%20iirds%3APartyRole%20that%20is%20assigned%20by%20the%20property%20iirds%3Ahas%2Dparty%2Drole%2C%20such%20as%20author%2C%20supplier%20or%20manufacturer.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Eine iirds:Party MUSS eine zugehörige iirds:PartyRole haben, die von der Eigenschaft iirds:has-party-role zugewiesen wird, wie z. B. Autor, Lieferant oder Hersteller.",
            "en": "An iirds:Party MUST have a related iirds:PartyRole that is assigned by the property iirds:has-party-role, such as author, supplier or manufacturer."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds_validation/Example 34 - Component with manufacturer.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M23",
        path: "Party",
        assert: (els, doc) => isExactlyOne(els, doc, "relates-to-vcard"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "relates-to-vcard"),
        prio: "MUST",
        category: "cardinality 0..1 (Ungenauigkeit, siehe M33)",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=In%20addition%20to%20the%20role%2C%20an%20iirds%3AParty%20MUST%20also%20have%20an%20associated%20description%20of%20itself%20as%20compliant%20vcard%3Akind%20object%20which%20is%20assigned%20via%20iirds%3Arelates%2Dto%2Dvcard.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Zusätzlich zur Rolle MUSS eine iirds:Party auch eine zugehörige Beschreibung von sich selbst als konformes vcard:kind-Objekt haben, die über iirds:relates-to-vcard zugewiesen wird.",
            "en": "In addition to the role, an iirds:Party MUST also have an associated description of itself as compliant vcard:kind object which is assigned via iirds:relates-to-vcard."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds_validation/Example 34 - Component with manufacturer.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M24.1",
        path: "DirectoryNode",
        assert: els => isZeroOrOne(els, "has-next-sibling"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-next-sibling"),
        prio: "MUST NOT",
        category: "cardinality 0..1 (Ungenauigkeit, siehe M33)",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Navigation%20sequences%20and%20hierarchies%20of%20InformationUnits%20MUST%20be%20modeled%20as%20linked%20lists%20of%20instances%20of%20the%20class%20iirds%3ADirectoryNode.%20In%20a%20linked%20list%2C%20an%20iirds%3ADirectoryNode%20references%20the%20following%20node%20by%20the%20property%20iirds%3Ahas%2Dnext%2Dsibling.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:DirectoryNode DARF NICHT mehr als eine Eigenschaft haben iirds:has-next-sibling.",
            "en": "iirds:DirectoryNode MUST NOT have more than one property iirds:has-next-sibling."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.1_false.rdf"]
        }
    },
    {
        id: "M24.2",
        path: "DirectoryNode",
        assert: els => isZeroOrOne(els, "has-directory-structure-type"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-directory-structure-type"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=0..1%C2%A0%20iirds%3Ahas%2Ddirectory%2Dstructure%2Dtype%20property%20%2D%20iirds%3ADirectoryNodeType",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:DirectoryNode DARF NICHT mehr als eine Eigenschaft haben iirds:has-directory-structure-type.",
            "en": "iirds:DirectoryNode MUST NOT have more than one property iirds:has-directory-structure-type."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.2_false.rdf"]
        }
    },
    {
        id: "M24.3",
        path: "DirectoryNode",
        assert: els => isZeroOrOne(els, "has-first-child"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-first-child"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=0..1%C2%A0%20iirds%3Ahas%2Dfirst%2Dchild%20property%20%2D%20iirds%3ADirectoryNode",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:DirectoryNode DARF NICHT mehr als eine Eigenschaft haben iirds:has-first-child Eigenschaft.",
            "en": "iirds:DirectoryNode MUST NOT have more than one property iirds:has-first-child property."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.3_false.rdf"]
        }
    },
    {
        id: "M24.4",
        path: "DirectoryNode",
        assert: els => isZeroOrOne(els, "relates-to-information-unit"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "relates-to-information-unit"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://www.iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=0..1%C2%A0%20iirds%3Arelates%2Dto%2Dinformation%2Dunit%20property%20%2D%20iirds%3AInformationUnit",
        version: ["V1.1"],
        rule: {
            "de": "iirds:DirectoryNode DARF NICHT mehr als eine Eigenschaft haben iirds:relates-to-information-unit.",
            "en": "iirds:DirectoryNode MUST NOT have more than one property iirds:relates-to-information-unit."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.4_false.rdf"]
        }
    },
    {
        id: "M24.5",
        path: "DirectoryNode",
        assert: els => els.filter(el => isDirectoryRoot(els, el)).every(el => el.querySelector("has-directory-structure-type")),
        getInvalid: els => els.filter(el => isDirectoryRoot(els, el) && !el.querySelector("has-directory-structure-type")),
        prio: "MUST",
        category: "only root element must have property",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=Only%20root%20nodes%20of%20a%20directory%20structure%20MUST%20have%20the%20property%20iirds%3Ahas%2Ddirectory%2Dstructure%2Dtype.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Der Wurzelknoten einer Verzeichnisstruktur MUSS eine Eigenschaft haben: iirds:has-directory-structure-type.",
            "en": "The root node of a directory structure MUST have one property iirds:has-directory-structure-type."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M35.4_false.rdf"]
        }
    },
    {
        id: "M24.6",
        path: "DirectoryNode",
        assert: (els) => {
            if (els.length > 0) {
                return els.filter(el => isDirectoryRoot(els, el)).length > 0;
            }
            return true;
        },
        getInvalid: els => els.filter(el => !isDirectoryRoot(els, el)),
        prio: "MUST",
        category: "there must be at least one root directory node",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20231110-1.2-release/index.html#information-units:~:text=6.9.1-,Directory%20Nodes",
        version: ["V1.0", "V1.0.1", "V1.1", "V1.2"],
        rule: {
            "de": "Es MUSS mindestens ein Wurzelknoten vorhanden sein, der die Elemente iirds:has-directory-structure-type, iirds:has-first-child und iirds:has-next-sibling hat.",
            "en": "There MUST be at least one root node that has the elements iirds:has-directory-structure-type, iirds:has-first-child and iirds:has-next-sibling."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/M24-6-2_true.rdf"],
            "false": ["./tests/files/util/iirds-validation/M24-6-1_false.rdf", "./tests/files/util/iirds-validation/M24-6-2_false.rdf"]
        }
    },
    {
        id: "M25",
        path: "DirectoryNode",
        assert: els => els.filter(el => !el.querySelector("DirectoryNode")).every(el => el.querySelector("has-next-sibling")),
        getInvalid: els => els.filter(el => !el.querySelector("DirectoryNode") && !el.querySelector("has-next-sibling")),
        prio: "MUST",
        category: "rdf:resource relates to class iirds:nil",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20model%20closed%20lists%2C%20the%20last%20node%20in%20a%20list%20level%20MUST%20have%20the%20property%20iirds%3Ahas%2Dnext%2Dsibling%20relating%20to%20an%20instance%20of%20the%20class%20iirds%3Anil.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um geschlossene Listen zu modellieren, MUSS der letzte Knoten in einer Listenebene die Eigenschaft iirds:has-next-sibling haben, die sich auf eine Instanz der Klasse iirds:nil bezieht.",
            "en": "To model closed lists, the last node in a list level MUST have the property iirds:has-next-sibling relating to an instance of the class iirds:nil."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds_validation/Example 38 - Table of contents.rdf","./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds_validation/Example 38 - Table of contents-M36_false.rdf"]
        }
    },
    {
        id: "M26",
        path: "DirectoryNode",
        assert: els => els.every(el => !el.querySelector(":scope > DirectoryNode")),
        getInvalid: els => els.filter(el => !!el.querySelector(":scope > DirectoryNode")),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=To%20model%20hierarchy%20levels%20in%20the%20navigation%20structure%2C%20an%20iirds%3ADirectoryNode%20instance%20MUST%20reference%20an%20iirds%3ADirectoryNode%20instance%20on%20the%20next%20lower%20level%20by%20the%20property%20iirds%3Ahas%2Dfirst%2Dchild.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Um Hierarchieebenen in der Navigationsstruktur zu modellieren, MUSS eine iirds:DirectoryNode-Instanz eine iirds:DirectoryNode-Instanz auf der nächstniedrigeren Ebene durch die Eigenschaft iirds:has-first-child referenzieren.",
            "en": "To model hierarchy levels in the navigation structure, an iirds:DirectoryNode instance MUST reference an iirds:DirectoryNode instance on the next lower level by the property iirds:has-first-child."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds_validation/Example 38 - Table of contents.rdf","./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds_validation/Example 38 - Table of contents-M37_false.rdf"]
        }
    },
    {
        id: "M27",
        path: "has-first-child > DirectoryNode",
        assert: els => els.every(el => el.querySelector(":scope > has-next-sibling")),
        getInvalid: els => els.filter(el => el.querySelector(":scope > has-next-sibling")),
        prio: "MUST",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20directory%20node%20on%20the%20next%20lower%20level%20MUST%20be%20the%20first%20item%20of%20another%20linked%20list.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Der Verzeichnisknoten auf der nächstniedrigeren Ebene MUSS das erste Element einer anderen verknüpften Liste sein.",
            "en": "The directory node on the next lower level MUST be the first item of another linked list."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds_validation/Example 38 - Table of contents.rdf","./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M30",
        path: "Class, Property, subPropertyOf, subClassOf, domain, range, domainIncludes, rangeIncludes",
        assert: els => els.length === 0,
        getInvalid: els => els,
        prio: "MUST NOT",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=The%20file%20metadata.rdf%20MUST%20NOT%20contain%20the%20iiRDS%20schema%20or%20iiRDS%20domain%20extensions.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Die Datei metadata.rdf DARF NICHT das iiRDS-Schema oder die iiRDS-Domänenerweiterungen enthalten.",
            "en": "The file metadata.rdf MUST NOT contain the iiRDS schema or iiRDS domain extensions."
        },
        testfiles: {
            "true": [""],
            "false": [""]
        }
    },
    {
        id: "M35",
        path: "Identity",
        assert: (els, doc) => isExactlyOne(els, doc, "identifier"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "identifier"),
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#information-units:~:text=1%C2%A0%20iirds%3Aidentifier%20property%20%2D%20http%3A//www.w3.org/2000/01/rdf%2Dschema%23Literal",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Identity MUSS die Eigenschaft iirds:identifier haben",
            "en": "iirds:Identity MUST have property iirds:identifier"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 26 - Identity type of product variant.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 26 - Identity type of product variant-M46_false.rdf"]
        }
    },
    {
        id: "M36",
        path: "Identity",
        assert: (els, doc) => isExactlyOne(els, doc, "has-identity-domain"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "has-identity-domain"),
        prio: "MUST",
        category: "cardinality 1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-identity-domain:~:text=1%C2%A0%20iirds%3Ahas%2Didentity%2Ddomain%20property%20%2D%20iirds%3AIdentityDomain",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Identity MUSS die Eigenschaft iirds:IdentityDomain haben",
            "en": "iirds:Identity MUST have property iirds:IdentityDomain"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/Example 26 - Identity type of product variant.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 26 - Identity type of product variant-M47_false.rdf"]
        }
    },
    {
        id: "M37",
        path: "Document",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=the%20iiRDS%20package.-,IRI%3A,REQUIRED,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M37_false.rdf", "./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M37_false_no_attribute.rdf"]
        }
    },
    {
        id: "M38",
        path: "Component",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=external%20component%20definitions.-,IRI%3A,REQUIRED,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M38_false.rdf"]
        }
    },
    {
        id: "M39",
        path: "Concept",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=product%20or%20system.-,IRI%3A,REQUIRED,-iirds%3AConformity",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M39_false.rdf"]
        }
    },
    {
        id: "M40",
        path: "ContentLifeCycleStatusValue",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=approved%20or%20withdrawn.-,IRI%3A,REQUIRED,-iirds%3ADesignAndRealization",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M41",
        path: "DirectoryNodeType",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=list%20of%20figures%27.-,IRI%3A,REQUIRED,-iirds%3ADocument",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/Example 38 - Table of contents.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 38 - Table of contents-M41_false.rdf"]
        }
    },
    {
        id: "M42",
        path: "DocumentType",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=of%20a%20document.-,IRI%3A,REQUIRED,-iirds%3ADownTime",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M42_false.rdf"]
        }
    },
    {
        id: "M43",
        path: "Event",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=to%20an%20event.-,IRI%3A,REQUIRED,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M44",
        path: "Form",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=and%20user%20feedback.-,IRI%3A,REQUIRED,-iirds%3AFormality",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M45",
        path: "Formality",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=and%20warranty%20conditions.-,IRI%3A,REQUIRED,-iirds%3AFragment",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M46",
        path: "Fragment",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=a%20fragment%20selector.-,IRI%3A,REQUIRED,-iirds%3AFragmentSelector",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M46_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M46_false.rdf"]
        }
    },
    {
        id: "M47",
        path: "Functionality",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=of%20the%20product.-,IRI%3A,REQUIRED,-iirds%3AFunctionalMetadata",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M48",
        path: "IdentityDomain",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=of%20the%20domain.-,IRI%3A,REQUIRED,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M49",
        path: "IdentityType",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=by%20the%20domain.-,IRI%3A,REQUIRED,-iirds%3AiirdsDomainEntity",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M50",
        path: "InformationObject",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=the%20information%20object.-,IRI%3A,REQUIRED,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/Example 6 - An Information object with two language variants.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 6 - An Information object with two language variants-M50_false.rdf"]
        }
    },
    {
        id: "M51",
        path: "Learning",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=summaries%2C%20and%20assessments.-,IRI%3A,REQUIRED,-iirds%3AMaintenanceInterval",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M52",
        path: "Package",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=overall%20iiRDS%20package.-,IRI%3A,REQUIRED,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M52_false.rdf"]
        }
    },
    {
        id: "M53",
        path: "Party",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=in%20a%20vCard.-,IRI%3A,REQUIRED,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M53_false.rdf"]
        }
    },
    {
        id: "M54",
        path: "PartyRole",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=manufacturer%2C%20author%2C%20inspector.-,IRI%3A,REQUIRED,-iirds%3APlanningTime",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M54_false.rdf"]
        }
    },
    {
        id: "M55",
        path: "Process",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=process%2Drelated%20information-,IRI%3A,REQUIRED,-iirds%3AProductFeature",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M56",
        path: "ProductFunction",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=phone%20call%2C%20ringing.-,IRI%3A,REQUIRED,-iirds%3AProductLifeCyclePhase",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M57",
        path: "ProductProperty",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=voltage%2C%20power%2C%20weight.-,IRI%3A,REQUIRED,-iirds%3AProductVariant",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M58",
        path: "ProductVariant",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=individually%20manufactured%20good.-,IRI%3A,REQUIRED,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M59",
        path: "Reference",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=rather%20than%20memorized.-,IRI%3A,REQUIRED,-iirds%3ARendition",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M60",
        path: "Role",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=of%20a%20system.-,IRI%3A,REQUIRED,-iirds%3ASafety",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M60_false.rdf"]
        }
    },
    {
        id: "M61",
        path: "Safety",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=IRI%3A-,REQUIRED,-iirds%3ASelector",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M62",
        path: "SkillLevel",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=the%20technical%20documentation.-,IRI%3A,REQUIRED,-iirds%3ASupply",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M63",
        path: "Supply",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=IRI%3A-,REQUIRED,-iirds%3ATask",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M64",
        path: "Task",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=or%20safety%20instructions.-,IRI%3A,REQUIRED,-iirds%3ATechnicalData",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M65",
        path: "TechnicalData",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=this%20class%20instead.-,IRI%3A,REQUIRED,-iirds%3ATechnicalOverview",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M66",
        path: "TechnicalOverview",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=and%20pneumatic%20diagrams.-,IRI%3A,REQUIRED,-iirds%3ATopic",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M67",
        path: "Topic",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=is%20a%20file%20in%20the%20iiRDS%20package.-,IRI%3A,REQUIRED,-iirds%3ATopicType",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf", "./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false_no_attribute.rdf"]
        }
    },
    {
        id: "M68",
        path: "TopicType",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=no%20specific%20type.-,IRI%3A,REQUIRED,-iirds%3ATroubleshooting",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M69",
        path: "Troubleshooting",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=for%20the%20error.-,IRI%3A,REQUIRED,-iirds%3AUse",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M70",
        path: "Use",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=IRI%3A-,REQUIRED,-iirds%3AWarningMessage",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M71",
        path: "WarningMessage",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=avoid%20the%20hazard.-,IRI%3A,REQUIRED,-iirds%3AWorkingTime",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M72",
        path: "ConsumableSupply",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=in%20technical%20documentation.-,IRI%3A,REQUIRED,-iirdsMch%3AHardwareTool",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M73",
        path: "HardwareTool",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=IRI%3A-,REQUIRED,-iirdsMch%3AiirdsMachineryDomainEntity",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M74",
        path: "Lubricant",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=IRI%3A-,REQUIRED,-iirdsMch%3AOperatingSupply",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M75",
        path: "OperatingSupply",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=IRI%3A-,REQUIRED,-iirdsMch%3AProtectiveEquipment",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M76",
        path: "ProtectiveEquipment",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=iirdsMch%3AProtectiveEquipment",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M49_false.rdf"]
        }
    },
    {
        id: "M77",
        path: "SparePart",
        assert: els => els.every(el => el.hasAttribute("rdf:about") && el.getAttribute("rdf:about") !== ""),
        getInvalid: els => els.filter(el => !el.hasAttribute("rdf:about") || el.getAttribute("rdf:about") === ""),
        prio: "REQUIRED",
        category: "must have IRI",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#about-iirds:~:text=OPTIONAL-,iirdsMch%3ASparePart,-Term",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "IRI: ERFORDERLICH",
            "en": "IRI: REQUIRED"
        },
        testFiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M77_true.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass-M77_false.rdf"]
        }
    },

    {
        id: "M78",
        path: "AfterUse",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=use%20of%20the%20product.-,Description%3A,-Not%20intended%20to%20be",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.  Definieren Sie für Lebenszyklusphasen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For lifecycle phases not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M79",
        path: "Collection",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=Not%20intented%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.%20For%20collection%20subjects%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.  Definieren Sie für Sammlungsthemen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intented to be used directly. Use the subclasses instead. For collection subjects not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M80",
        path: "Conformity",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.%20For%20information%20subjects%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.  Definieren Sie für Informationsthemen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For information subjects not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M81",
        path: "DesignAndRealization",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=of%20a%20product.-,Description%3A,phases%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.  Definieren Sie für Lebenszyklusphasen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For lifecycle phases not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M82",
        path: "DocumentationMetadata",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3ADocumentType",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M83",
        path: "FunctionalMetadata",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3AIdentity",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M84",
        path: "iirdsDomainEntity",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-Properties%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M85",
        path: "AdministrativeMetadata",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#iirds-rdf-schema-reference:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3AAfterUse",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M86",
        path: "InformationSubject",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intented%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intented to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M87",
        path: "InformationType",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=Description%3A-,Not%20intented%20to%20be%20used%20directly.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.",
            "en": "Not intented to be used directly."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M88",
        path: "PlanningTime",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=specific%20working%20tasks.-,Description%3A,-Not%20intended%20to",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M89",
        path: "ProductFeature",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=functions%20of%20a%20product%20or%20component.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M90",
        path: "ProductLifeCyclePhase",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=MAY%20refer%20to.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M91",
        path: "ProductMetadata",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=product%2Drelated%20metadata.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
        }
    },
    {
        id: "M92",
        path: "PuttingToUse",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=system%20to%20use.-,Description%3A,phases%20not%20covered%20by%20the%20iiRDS%20standard%20subclasses%2C%20define%20custom%20subclasses.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.  Definieren Sie für Lebenszyklusphasen, die nicht von den iiRDS-Standardunterklassen abgedeckt werden, benutzerdefinierte Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead. For lifecycle phases not covered by the iiRDS standard subclasses, define custom subclasses."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
            //to do: Beispiel in Spec suchen / erstellen (in Spec kein gutes Beispiel vorhanden)
        }
    },
    {
        id: "M93",
        path: "Qualification",
        assert: els => els.filter(el => !el.hasAttribute("rdf:about")).length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_has-content-lifecycle-status-value:~:text=roles%20REQUIRED%20for%20working%20tasks%20described%20in%20technical%20documentation.-,Description%3A,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-IRI%3A",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": [""]
            //to do: Beispiel in Spec suchen / erstellen (in Spec kein gutes Beispiel vorhanden)
        }
    },
    {
        id: "M94",
        path: "relates-to-administrative-metadata",
        assert: els => els.length === 0,
        getInvalid: els => els,
        prio: "MUST",
        category: "Not intended to be used directly.",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfrelations_core_relates-to-administrative-metadata:~:text=Description%3A-,Not%20intended%20to%20be%20used%20directly.%20Use%20the%20subclasses%20instead.,-iirds%3Arelates%2Dto%2Dcomponent",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "Nicht zur direkten Verwendung bestimmt.  Verwenden Sie stattdessen die Unterklassen.",
            "en": "Not intended to be used directly. Use the subclasses instead."
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 34 - Component with manufacturer-M66_false.rdf"]
        }
    },
    {
        id: "M95",
        path: "Component",
        assert: els => isZeroOrOne(els, "relates-to-party"),
        getInvalid: (els, doc) => getMoreThanOne(els, doc, "relates-to-party"),
        prio: "MUST NOT",
        category: "cardinality 0..1",
        spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#rdfclasses_core_ProductMetadata:~:text=identity%20properties%20%2D%20iirds%3AIdentity-,0..1%C2%A0%20iirds%3Arelates%2Dto%2Dparty%20property%20%2D%20iirds%3AParty,-iirds%3AConcept",
        version: ["V1.0", "V1.0.1", "V1.1"],
        rule: {
            "de": "iirds:Component DARF NICHT mehr als 1 Eigenschaft iirds:relates-to-party haben",
            "en": "iirds:Component MUST NOT have more than 1 property iirds:relates-to-party"
        },
        testfiles: {
            "true": ["./tests/files/util/iirds-validation/metadata_iirds_sample_pass.rdf", "./tests/files/util/iirds-validation/min_requirements.rdf"],
            "false": ["./tests/files/util/iirds-validation/Example 34 - Component with manufacturer-M67_false.rdf"]
        }
    },
];
