import containerValidation from "@/util/validator-container";

const validate = async ({ objectData, scope, fileName }) => {
    const result = await containerValidation.validate(objectData, scope, fileName);
    self.postMessage(JSON.stringify(result));
};

self.addEventListener("message", msg => validate(msg.data));
