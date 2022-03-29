import Joi from "joi";

const clubSchema = Joi.object({
  name: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required() //add regex
});

const proposalSchema = Joi.object();

export const validateClub = (data) =>
  clubSchema.validate(data, { abortEarly: false }).error;

export const validateProposal = (data) =>
  proposalSchema.validate(data, { abortEarly: false }).error;
