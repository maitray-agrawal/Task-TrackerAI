import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: {
        status: 400,
        details: errorDetails,
      },
    });
  }
  next();
};

export const validateObjectId = (req, res, next) => {
  const id = req.params.id;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: {
        status: 400,
        message: `The parameter value '${id}' is not a valid ObjectId`,
      },
    });
  }
  next();
};

export default validate;
