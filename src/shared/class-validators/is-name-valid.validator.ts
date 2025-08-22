import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
const NAME_REGEX = /^[\p{L}\p{M}\s'.'-.-]+$/u;
@ValidatorConstraint({ async: false })
class IsNameValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string' || value.trim() === '') {
      return true; // skip validation if empty
    }
    // Normalize & test
    const normalized = value.trim().normalize('NFC');
    return NAME_REGEX.test(normalized);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Special characters are not allowed in name';
  }
}

export function IsNameValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNameValidConstraint,
    });
  };
}
