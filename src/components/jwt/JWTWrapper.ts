import jwt from 'jsonwebtoken';

export class JWTWrapper {
  private readonly privateKey: string;

  public constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  public signToken(payload: Object, options: jwt.SignOptions): string {
    return jwt.sign(payload, this.privateKey, options);
  }

  public verify(header: string): Record<string, string> {
    return jwt.verify(header, this.privateKey) as Record<string, string>;
  }
}