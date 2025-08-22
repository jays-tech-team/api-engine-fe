import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsTransactionNumberValidConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string' || value.trim() === '') {
      return true; // skip validation if empty
    }
    return /^[a-zA-Z0-9\s,.'#/-]+$/.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Transaction number is not valid';
  }
}

export function IsTransactionNumberValid(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTransactionNumberValidConstraint,
    });
  };
}
