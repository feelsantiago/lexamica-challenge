import { MapperSchema } from '../mapper';
import { ZodMapper } from './zod-mapper';

describe('ZodMapper', () => {
  it('should map whole object from schema', () => {
    const schema: MapperSchema = {
      name: {
        source: 'firstName',
        type: 'string',
        required: true,
      },
      age: {
        source: 'birth',
        type: 'number',
        required: false,
        defaultValue: 0,
      },
      contact: {
        type: 'object',
        source: 'contact',
        required: false,
        properties: {
          email: {
            source: 'email',
            type: 'string',
            required: true,
          },
          phone: {
            source: 'phone',
            type: 'string',
            required: false,
          },
        },
      },
      children: {
        type: 'array',
        source: 'dependents',
        required: false,
        items: {
          type: 'object',
          properties: {
            name: {
              source: 'name',
              type: 'string',
              required: true,
            },
            age: {
              source: 'age',
              type: 'number',
              required: true,
            },
          },
        },
      },
    };

    const data = {
      firstName: 'test',
      birth: 0,
      contact: {
        email: 'test',
        phone: '123',
      },
      dependents: [
        {
          name: 'test',
          age: 0,
        },
      ],
    };

    const mapper = new ZodMapper(schema);
    const result = mapper.parse(data);

    result.match({
      ok: (result) => {
        expect(result).toEqual({
          name: 'test',
          age: 0,
          contact: { email: 'test', phone: '123' },
          children: [{ name: 'test', age: 0 }],
        });
      },
      err: () => {
        fail();
      },
    });
  });
});
