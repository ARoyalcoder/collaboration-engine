import { SignJWT } from 'jose';

const secret = process.env.JWT_ACCESS_SECRET;

if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not configured');
}

const secretKey = new TextEncoder().encode(secret);

export async function createAccessToken(userId: string): Promise<string> {
    return new SignJWT({})
        .setProtectedHeader({
            alg: 'HS256',
            typ: 'JWT',
        })
        .setSubject(userId)
        .setIssuer('collaboration-engine-api')
        .setAudience('collaboration-engine')
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_ACCESS_EXPIRES_IN ?? '15m')
        .sign(secretKey);
}