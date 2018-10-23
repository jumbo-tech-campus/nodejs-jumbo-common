import jsonwebtoken from 'jsonwebtoken';

export class JWTWrapper {
  private readonly privateKey: string;

  public constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  public signToken(payload: Object, options: jsonwebtoken.SignOptions): string {
    return jsonwebtoken.sign(payload, this.privateKey, options);
  }

  public verify(header: string): Record<string, string> {
    return jsonwebtoken.verify(header, this.privateKey) as Record<string, string>;
  }
}