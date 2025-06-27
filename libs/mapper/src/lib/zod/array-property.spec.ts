import { PropertySchema } from '../mapper';
import { ArrayProperty } from './array-property';

describe('ZodArray', () => {
  it('should map array from schema', () => {
    const schema: PropertySchema = {
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
    };

    const data = [
      {
        name: 'test',
        age: 0,
      },
    ];

    const array = new ArrayProperty('children', schema);
    const result = array.build();
    const parser = result.parse(data);

    expect(parser).toEqual({ children: [{ name: 'test', age: 0 }] });
  });

  it('should map primitive array from schema', () => {
    const schema: PropertySchema = {
      type: 'array',
      source: 'books',
      required: false,
      items: {
        type: 'string',
      },
    };

    const data = ['book 1', 'book 2'];

    const array = new ArrayProperty('books', schema);
    const result = array.build();
    const parser = result.parse(data);

    expect(parser).toEqual({ books: ['book 1', 'book 2'] });
  });
});
