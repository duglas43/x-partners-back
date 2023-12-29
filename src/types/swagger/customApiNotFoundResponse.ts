import { applyDecorators } from '@nestjs/common';
import { ApiResponseOptions, ApiNotFoundResponse } from '@nestjs/swagger';

export const CustomApiNotFoundResponse = (
  options: ApiResponseOptions = {
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Not found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
  },
) => {
  return applyDecorators(ApiNotFoundResponse(options));
};
