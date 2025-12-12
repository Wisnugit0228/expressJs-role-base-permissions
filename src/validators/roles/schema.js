import Joi from "joi";

export const roleSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional()
})