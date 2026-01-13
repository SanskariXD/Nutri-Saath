import { OAuth2Client } from "google-auth-library";
import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "@config/env";
import { UserModel } from "@models/User";
import { profileService } from "@services/profiles/profile.service";
import { AppError } from "@shared/errors";
import { logger } from "@utils/logger";

interface GoogleProfile {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  };
}

class AuthService {
  private readonly client = new OAuth2Client({
    clientId: env.GOOGLE_CLIENT_ID,
  });

  async authenticateWithGoogle(idToken: string): Promise<AuthResult> {
    const ticket = await this.client.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload() as GoogleProfile | undefined;

    if (!payload?.sub || !payload.email) {
      throw new AppError("Invalid Google ID token", 401);
    }

    const user = await UserModel.findOneAndUpdate(
      { googleId: payload.sub },
      {
        googleId: payload.sub,
        email: payload.email.toLowerCase(),
        displayName: payload.name ?? payload.email.split("@")[0],
        avatarUrl: payload.picture,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await profileService.ensureDefaultProfile(user._id.toString(), `${user.displayName}'s Profile`);

    const tokenPayload: JwtPayload = { uid: user._id.toString(), email: user.email };
    const secret: Secret = env.JWT_SECRET;
    const options: SignOptions = { expiresIn: "7d" };
    const token = jwt.sign(tokenPayload, secret, options);

    logger.info("User authenticated via Google", { userId: user._id.toString() });

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}

export const authService = new AuthService();
