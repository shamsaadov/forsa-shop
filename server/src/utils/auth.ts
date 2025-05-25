import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config({ path: '../../.env' });
const envSecret = "process.env.JWT_SECRET";
if (!envSecret) {
  throw new Error('Missing JWT_SECRET environment variable');
}
const JWT_SECRET: jwt.Secret = envSecret;
const JWT_EXPIRES_IN:any = "1d";

export interface TokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Generate JWT token
export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password with hash
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Verify token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    if (!token) {
      console.error('Token is empty');
      return null;
    }

    const payload = jwt.verify(token, JWT_SECRET) as unknown;

    if (
        typeof payload === 'object' &&
        payload !== null &&
        'id' in payload &&
        'role' in payload
    ) {
      const { id, role } = (payload as { id: string; role: string });
      const jwtPay = payload as jwt.JwtPayload;
      return { id, role, iat: jwtPay.iat, exp: jwtPay.exp };
    }

    console.error('Token payload is invalid');
    return null;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('JWT verification error:', error.message);
    } else {
      console.error('Unknown token error:', error);
    }
    return null;
  }
};
