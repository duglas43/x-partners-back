import { applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse, ApiResponseOptions } from '@nestjs/swagger';

export const CustomApiUnauthorizedResponse = (
  options: ApiResponseOptions = {
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
  },
) => {
  return applyDecorators(ApiUnauthorizedResponse(options));
};
