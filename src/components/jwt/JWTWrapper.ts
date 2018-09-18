import jwt from 'jsonwebtoken';

export class JWTWrapper {
  private readonly privateKey: string;

  public constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  public async signToken(payload: Object, options: Object): Promise<string> {
    return await jwt.sign(payload, this.privateKey, options);
  }
}