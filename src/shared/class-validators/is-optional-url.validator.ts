import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isUrl } from '../../utils/helper/string.helper';

@ValidatorConstraint({ async: false })
class IsOptionalUrlConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string' || value.trim() === '') {
      return true; // skip validation if empty
    }
    return isUrl(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Special characters are not allowed in address';
  }
}

export function IsOptionalUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOptionalUrlConstraint,
    });
  };
}
