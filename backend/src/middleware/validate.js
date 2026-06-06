import { validationResult } from "express-validator";
import { fail } from "../utils/apiResponse.js";

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return fail(res, "Validation failed", 422, result.array().map((item) => ({
      field: item.path,
      message: item.msg
    })));
  }
  next();
};

export default validate;
