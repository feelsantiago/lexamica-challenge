import { HttpStatusCode } from 'axios';
import { match } from 'ts-pattern';

export const AuthErros = {
  INVALID_SIGN_IN_DATA: 'INVALID_SIGN_IN_DATA',
  INVALID_AUTH_USER: 'INVALID_AUTH_USER',
  INVALID_JWT_PAYLOAD: 'INVALID_JWT_PAYLOAD',
  INVALID_TOKEN: 'INVALID_TOKEN',
  UNABLE_TO_DECODE_JWT: 'UNABLE_TO_DECODE_JWT',
  UNAUTHORIZED_USER: 'UNAUTHORIZED_USER',
};

export function toAuthHttpError(error: string): number {
  return match(error)
    .with(AuthErros.INVALID_SIGN_IN_DATA, () => HttpStatusCode.BadRequest)
    .with(AuthErros.INVALID_AUTH_USER, () => HttpStatusCode.Unauthorized)
    .with(AuthErros.INVALID_JWT_PAYLOAD, () => HttpStatusCode.Unauthorized)
    .with(AuthErros.INVALID_TOKEN, () => HttpStatusCode.Unauthorized)
    .with(AuthErros.UNABLE_TO_DECODE_JWT, () => HttpStatusCode.Unauthorized)
    .with(AuthErros.UNAUTHORIZED_USER, () => HttpStatusCode.Unauthorized)
    .otherwise(() => HttpStatusCode.InternalServerError);
}
