import { applyDecorators } from '@nestjs/common';
import { ApiResponseOptions, ApiForbiddenResponse } from '@nestjs/swagger';
export const CustomApiForbiddenResponse = (
  options: ApiResponseOptions = {
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
  },
) => {
  return applyDecorators(ApiForbiddenResponse(options));
};
