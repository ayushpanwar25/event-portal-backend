import Joi from "joi";

const UserSchema = Joi.object({
	regNo: Joi.number().required(),
  name: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required() //add regex
});

const ClubSchema = Joi.object({
  name: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required() //add regex
});

const PasswordSchema = Joi.object({
	password: Joi.string().required()
});

const ProposalSchema = Joi.object();

const FCSchema = Joi.object();

const DSWSchema = Joi.object();

const EventSchema = Joi.object();

const ReportSchema = Joi.object();

export const validateUser = (data) =>
  UserSchema.validate(data, { abortEarly: false }).error;

export const validateClub = (data) =>
  ClubSchema.validate(data, { abortEarly: false }).error;

export const validateProposal = (data) =>
  ProposalSchema.validate(data, { abortEarly: false }).error;

export const validateFC = (data) =>
  FCSchema.validate(data, { abortEarly: false }).error;
	
export const validateDSW = (data) =>
	DSWSchema.validate(data, { abortEarly: false }).error;

export const validateEvent = (data) =>
	EventSchema.validate(data, { abortEarly: false }).error;

export const validateReport = (data) =>
	ReportSchema.validate(data, { abortEarly: false }).error;

export const validatePassword = (data) =>
	PasswordSchema.validate(data).error;