import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsAddressValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    console.log('Address validation', value);
    if (typeof value !== 'string' || value.trim() === '') {
      return true; // skip validation if empty
    }
    return /^[a-zA-Z0-9\s,.'#/-]+$/.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Special characters are not allowed in address';
  }
}

export function IsAddressValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAddressValidConstraint,
    });
  };
}
