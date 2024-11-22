import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export const ApiFile = (
  fileName: string,
  // ключ, який беремо з контролера, назва поля для файлу (або масиву файлів),
  // яке відображатиметься у Swagger (ми поле назвали - "avatar")
  isArray = true,
  isRequired = true,
): MethodDecorator => {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        required: isRequired ? [fileName] : [],
        properties: {
          [fileName]: isArray
            ? {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                },
              }
            : {
                type: 'string',
                format: 'binary',
              },
        },
      },
    }),
  );
};
