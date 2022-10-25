import schemaValidation from "@/util/validator-schema";

const validate = async ({ zipArchive, scope, fileName }) => {
    const result = await schemaValidation.validate(zipArchive, scope, fileName);
    self.postMessage(JSON.stringify(result));
};

self.addEventListener("message", msg => validate(msg.data));
