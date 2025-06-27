import { PropertySchema } from '../mapper';
import { ObjectProperty } from './object-property';

describe('ZodObject', () => {
  it('should map object from schema', () => {
    const schema: PropertySchema = {
      type: 'object',
      source: 'user_contact',
      required: false,
      properties: {
        email: {
          source: 'c_email',
          type: 'string',
          required: true,
        },
        phone: {
          source: 'c_phone',
          type: 'string',
          required: false,
        },
      },
    };

    const data = {
      c_email: 'test',
      c_phone: '123',
    };

    const obj = new ObjectProperty('contact', schema);
    const result = obj.build();
    const parser = result.parse(data);

    expect(parser).toEqual({ contact: { email: 'test', phone: '123' } });
  });
});
