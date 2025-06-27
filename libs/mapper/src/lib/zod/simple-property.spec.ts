import { PropertySchema } from '../mapper';
import { SimpleProperty } from './simple-property';

describe('ZodSimpleProperty', () => {
  it('should transform string types', () => {
    const _string: PropertySchema = {
      type: 'string',
      source: 'name',
      required: true,
    };

    const property = new SimpleProperty('firstName', _string);
    const schema = property.build();

    expect(schema.parse('test')).toEqual({ firstName: 'test' });
  });

  it('should transform number types', () => {
    const _number: PropertySchema = {
      type: 'number',
      source: 'birthdate',
      required: true,
    };

    const property = new SimpleProperty('age', _number);
    const schema = property.build();

    expect(schema.parse(0)).toEqual({ age: 0 });
  });

  it('should transform boolean types', () => {
    const _boolean: PropertySchema = {
      type: 'boolean',
      source: 'married',
      required: false,
      defaultValue: false,
    };

    const property = new SimpleProperty('married', _boolean);
    const schema = property.build();

    expect(schema.parse(true)).toEqual({ married: true });
  });
});
