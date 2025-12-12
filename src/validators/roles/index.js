import { roleSchema } from "./schema.js"

export const roleValidator = {
    roleInputValidator: (payload) => {
        const { err } = roleSchema.validate(payload);
        if (err) {
            throw new Error(err.message);
        }
    }
}