const FORBIDDEN_CHARS_REGEXP = /[^,”*:<>\/\u007F\u0000-\u001F\u0080-\u009F\uE000-\uF8FF\P{Co}]+/u; // Unicode flag important
const FORBIDDEN_FILES_ROOT_REGEXP = /^[^/\\]+\.([pP][dD][fF]|[jJ][pP][eE]?[gG]|[gG][iI][fF]|[pP][nN][gG]|[hH][tT][mM][lL]?|[cC][sS][sS]|[iI][iI][rR][dD][sS]|[jJ][sS])$/;
const FORBIDDEN_FILES_META_REGEXP = /^META\-INF\/\w+\.([pP][dD][fF]|[jJ][pP][eE]?[gG]|[gG][iI][fF]|[pP][nN][gG]|[hH][tT][mM][lL]?|[cC][sS][sS]|[iI][iI][rR][dD][sS]|[jJ][sS])$/;

const getFileFromPath = path => path.split(/[/\\]/).pop();
//const Parser = new DOMParser();

export default [{
    id: "C1",
    assert: zip => zip && zip.files,
    prio: "MUST",
    spec: null,
    break: true,
    rule: {
        "de": "ZIP-Datei ist korrupt oder nicht lesbar.",
        "en": "ZIP file is corrupt or cannot be processed."
    }
},
{
    id: "C2",
    assert: zip => Object.keys(zip.files).length,
    prio: "MUST",
    spec: null,
    break: true,
    rule: {
        "de": "ZIP-Datei ist leer.",
        "en": "ZIP file is empty."
    }
},
{
    id: "C3",
    assert: (zip, file) => file.name && /\.iirds$/.test(file.name),
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=The%20file%20name%20of%20the%20iiRDS%20ZIP%20archive%20MUST%20feature%20the%20file%20name%20extension%20.iirds.",
    break: false,
    rule: {
        "de": "The file name of the iiRDS ZIP archive MUST feature the file name extension .iirds.",
        "en": "The file name of the iiRDS ZIP archive MUST feature the file name extension .iirds."
    }
},
{
    id: "C4",
    assert: zip => zip.files["mimetype"],
    getInvalid: zip => ["mimetype"],
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=In%20addition%20to%20the%20iiRDS%20container%20specifications%2C%20the%20root%20directory%20of%20the%20ZIP%20file%20MUST%20contain%20a%20file%20named%20mimetype.",
    break: false,
    rule: {
        "de": "The root directory of the ZIP file MUST contain a file named mimetype.",
        "en": "The root directory of the ZIP file MUST contain a file named mimetype."
    }
},
{
    id: "C5",
    assert: async (zip) => {
        const mimetypeFile = zip.files["mimetype"];
        if (mimetypeFile) {
            const mimetypeFileContent = await zip.files["mimetype"].async("string");
            return mimetypeFileContent && /^application\/iirds\+zip$/.test(mimetypeFileContent);
        } else return false;
    },
    getInvalid: zip => ["mimetype"],
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=It%20MUST%20contain,application/iirds%2Bzip",
    break: false,
    rule: {
        "de": "The mimetype file MUST contain the following ASCII-encoded text in a single line, without any line delimiters such as CR or LF: application/iirds+zip.",
        "en": "The mimetype file MUST contain the following ASCII-encoded text in a single line, without any line delimiters such as CR or LF: application/iirds+zip."
    }
},
{
    id: "C6",
    assert: (zip) => {
        const mimetypeFile = zip.files["mimetype"];
        if (mimetypeFile) {
            return mimetypeFile._data.compressedSize >= mimetypeFile._data.uncompressedSize;
        } else return false;
    },
    getInvalid: zip => ["mimetype"],
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=The%20file%20MUST%20be%20the%20first%20entry%20in%20the%20ZIP%20file%20and%20it%20MUST%20be%20stored%20uncompressed%20(%22Stored%22%20mode).",
    break: false,
    rule: {
        "de": "The mimetype file MUST be stored uncompressed ('Stored' mode).",
        "en": "The mimetype file MUST be stored uncompressed ('Stored' mode)."
    }
},
{
    id: "C7",
    assert: zip => Object.keys(zip.files).some(file => /^META\-INF\//.test(file)),
    getInvalid: zip => ["META-INF/"],
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=An%20iiRDS%20container%20MUST%20have%20a%20directory%20META%2DINF.",
    break: true,
    rule: {
        "de": "An iiRDS container MUST have a directory META-INF.",
        "en": "An iiRDS container MUST have a directory META-INF."
    }
},
{
    id: "C8",
    assert: zip => zip.files["META-INF/metadata.rdf"],
    getInvalid: zip => ["META-INF/metadata.rdf"],
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=The%20META%2DINF%20directory%20MUST%20contain%20the%20file%20metadata.rdf%20containing%20all%20metadata%20in%20RDF%201.1%20XML%20syntax%20(see%20%5Brdf%2Dsyntax%2Dgrammar%5D).",
    break: true,
    rule: {
        "de": "The META-INF directory MUST contain the file metadata.rdf.",
        "en": "The META-INF directory MUST contain the file metadata.rdf."
    }
},
{
    id: "C9",
    assert: async (zip) => {
        const metadataFile = zip.files["META-INF/metadata.rdf"];
        if (metadataFile) {
            const metadataFileContent = await zip.files["META-INF/metadata.rdf"].async("string");
            return metadataFileContent && /<rdf:RDF/.test(metadataFileContent);
        } else return false;
    },
    getInvalid: zip => ["META-INF/metadata.rdf"],
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=The%20META%2DINF%20directory%20MUST%20contain%20the%20file%20metadata.rdf%20containing%20all%20metadata%20in%20RDF%201.1%20XML%20syntax%20(see%20%5Brdf%2Dsyntax%2Dgrammar%5D).",
    break: true,
    rule: {
        "de": "The META-INF directory MUST contain the file metadata.rdf.",
        "en": "The META-INF directory MUST contain the file metadata.rdf."
    }
},
{
    id: "C10",
    assert: zip => !Object.keys(zip.files).some(file => FORBIDDEN_CHARS_REGEXP.test(file)),
    getInvalid: zip => Object.keys(zip.files).filter(file => FORBIDDEN_CHARS_REGEXP.test(file)),
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=For%20file%20and,use%20Unicode%20areas",
    break: true,
    rule: {
        "de": "For file and directory names, all Unicode characters MAY be used, with the exception of the following characters: /,”*:<>\\, the DEL character (U+007F), characters from the ranges U+0000 to U+001F and U+0080 to U+009F, characters from the private use Unicode areas.",
        "en": "For file and directory names, all Unicode characters MAY be used, with the exception of the following characters: /,”*:<>\\, the DEL character (U+007F), characters from the ranges U+0000 to U+001F and U+0080 to U+009F, characters from the private use Unicode areas."
    }
},
{
    id: "C11",
    assert: zip => !Object.keys(zip.files).some(file => FORBIDDEN_FILES_ROOT_REGEXP.test(file)),
    getInvalid: zip => Object.keys(zip.files).filter(file => FORBIDDEN_FILES_ROOT_REGEXP.test(file)),
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=All%20other%20files%20(content%2C%20like%20PDF%2C%20HTML%2C%20media%2C%20Javascript%2C%20CSS%2C%20nested%20iiRDS%20packages)%20MUST%20be%20stored%20in%20arbitrary%20subdirectories%20below%20the%20root%20directory.",
    break: false,
    rule: {
        "de": "All other files (content, like PDF, HTML, media, Javascript, CSS, nested iiRDS packages) MUST be stored in arbitrary subdirectories below the root directory.",
        "en": "All other files (content, like PDF, HTML, media, Javascript, CSS, nested iiRDS packages) MUST be stored in arbitrary subdirectories below the root directory."
    }
},
{
    id: "C12",
    assert: zip => !Object.keys(zip.files).some(file => FORBIDDEN_FILES_META_REGEXP.test(file)),
    getInvalid: zip => Object.keys(zip.files).filter(file => FORBIDDEN_FILES_META_REGEXP.test(file)),
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=Content%20files%20MUST%20NOT%20be%20placed%20in%20the%20root%20directory%20or%20in%20META%2DINF%20directory.",
    break: false,
    rule: {
        "de": "Content files MUST NOT be placed in the root directory or in META-INF directory.",
        "en": "Content files MUST NOT be placed in the root directory or in META-INF directory."
    }
},
{
    id: "C13",
    assert: zip => !Object.keys(zip.files).some(file => file.length > 260),
    getInvalid: zip => Object.keys(zip.files).filter(file => file.length > 260),
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=Full%20path%20names%20(file%20names%20including%20the%20full%20directory%20path%20from%20the%20root)%20MUST%20NOT%20exceed%20260%20characters).",
    break: false,
    rule: {
        "de": "Full path names (file names including the full directory path from the root) MUST NOT exceed 260 characters).",
        "en": "Full path names (file names including the full directory path from the root) MUST NOT exceed 260 characters)."
    }
},
{
    id: "C14",
    assert: zip => !Object.keys(zip.files).some(file => getFileFromPath(file).length > 255),
    getInvalid: zip => Object.keys(zip.files).filter(file => getFileFromPath(file).length > 255),
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=The%20length%20of%20file%20names%20is%20limited%20to%20255%20characters.",
    break: false,
    rule: {
        "de": "The length of file names is limited to 255 characters.",
        "en": "The length of file names is limited to 255 characters."
    }
},
{
    id: "C15",
    assert: (zip) => {
        const caseInsensitive = Object.keys(zip.files).map(file => file.toLowerCase());
        return caseInsensitive.length === new Set(caseInsensitive).size;
    },
    getInvalid: (zip) => {
        const caseInsensitive = Object.keys(zip.files).map(file => file.toLowerCase());
        return caseInsensitive.filter((s => v => s.has(v) || !s.add(v))(new Set));
    },
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=File%20names%20are%20case%2Dsensitive%20and%20MUST%20be%20unique%20within%20their%20parent%20directories. ",
    break: false,
    rule: {
        "de": "File names are case-sensitive and MUST be unique within their parent directories",
        "en": "File names are case-sensitive and MUST be unique within their parent directories"
    }
    /*
},
{
    id: "C16",
    assert: async (zip) => {
        const metadataFile = zip.files["META-INF/metadata.rdf"];
        if (metadataFile) {
            const metadataFileContent = await zip.files["META-INF/metadata.rdf"].async("string");
            const metadataFileDocument = Parser.parseFromString(metadataFileContent, "application/xml");
            return metadataFileDocument.firstElementChild.localName === "RDF";
        } else return false;
    },
    getInvalid: zip => ["META-INF/metadata.rdf"],
    prio: "MUST",
    spec: "https://iirds.org/fileadmin/iiRDS_specification/20201103-1.1-release/index.html#:~:text=The%20META%2DINF%20directory%20MUST%20contain%20the%20file%20metadata.rdf%20containing%20all%20metadata%20in%20RDF%201.1%20XML%20syntax%20(see%20%5Brdf%2Dsyntax%2Dgrammar%5D).",
    break: true,
    rule: {
        "de": "The META-INF directory MUST contain the file metadata.rdf in RDF 1.1 XML syntax. XML is invalid.",
        "en": "The META-INF directory MUST contain the file metadata.rdf in RDF 1.1 XML syntax. XML is invalid."
    }
    */
}];
