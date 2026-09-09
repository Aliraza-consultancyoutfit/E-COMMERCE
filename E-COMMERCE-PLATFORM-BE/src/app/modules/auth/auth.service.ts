import {
  BadRequestException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { LoginDto, RegisterDto } from "../../../libs/shared/src/dto";
import { UserRole } from "../../../libs/shared/src/schemas";
import { compareHash, hashValue } from "../../../libs/shared/src/utils";
import { UsersService } from "../users/users.service";

export type SocialProvider = "google" | "apple";

interface SocialProfile {
  email: string;
  name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const password = await hashValue(registerDto.password);
    const user = await this.usersService.create({
      ...registerDto,
      password,
      role: registerDto.role ?? UserRole.USER,
    });

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  getSocialAuthorizationUrl(provider: SocialProvider) {
    if (provider === "google") {
      const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
      if (!clientId) {
        throw new ServiceUnavailableException("Google sign-in is not configured");
      }

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: this.getSocialCallbackUrl("google"),
        response_type: "code",
        scope: "openid email profile",
        prompt: "select_account",
      });

      return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    const clientId = this.configService.get<string>("APPLE_CLIENT_ID");
    if (!clientId) {
      throw new ServiceUnavailableException("Apple sign-in is not configured");
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: this.getSocialCallbackUrl("apple"),
      response_type: "code id_token",
      response_mode: "form_post",
      scope: "name email",
    });

    return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  }

  async socialCallback(provider: SocialProvider, code: string) {
    const profile =
      provider === "google"
        ? await this.getGoogleProfile(code)
        : await this.getAppleProfile(code);

    const existing = await this.usersService.findByEmail(profile.email);
    const user =
      existing ??
      (await this.usersService.create({
        name: profile.name,
        email: profile.email,
        password: await hashValue(randomBytes(32).toString("hex")),
        role: UserRole.USER,
      }));

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await compareHash(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  private buildAuthResponse(id: string, email: string, role: UserRole) {
    const payload = { sub: id, email, role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id,
        email,
        role,
      },
    };
  }

  private getSocialCallbackUrl(provider: SocialProvider) {
    const apiUrl =
      this.configService.get<string>("API_URL") ?? "http://localhost:5000/api";
    return `${apiUrl.replace(/\/$/, "")}/auth/social/${provider}/callback`;
  }

  private getFrontendSocialCallbackUrl(
    status: "success" | "error",
    params: Record<string, string>,
  ) {
    const frontendUrl =
      this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const searchParams = new URLSearchParams({ status, ...params });
    return `${frontendUrl.replace(/\/$/, "")}/auth/social/callback?${searchParams.toString()}`;
  }

  buildSocialSuccessRedirect(response: ReturnType<AuthService["buildAuthResponse"]>) {
    return this.getFrontendSocialCallbackUrl("success", {
      accessToken: response.accessToken,
      id: response.user.id,
      email: response.user.email,
      role: response.user.role,
    });
  }

  buildSocialErrorRedirect(message: string) {
    return this.getFrontendSocialCallbackUrl("error", { message });
  }

  private async getGoogleProfile(code: string): Promise<SocialProfile> {
    const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException("Google sign-in is not configured");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: this.getSocialCallbackUrl("google"),
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedException("Google sign-in failed");
    }

    const token = (await tokenResponse.json()) as { access_token?: string };
    if (!token.access_token) {
      throw new UnauthorizedException("Google sign-in failed");
    }

    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { authorization: `Bearer ${token.access_token}` } },
    );
    if (!profileResponse.ok) {
      throw new UnauthorizedException("Could not read Google profile");
    }

    const profile = (await profileResponse.json()) as {
      email?: string;
      name?: string;
    };
    if (!profile.email) {
      throw new BadRequestException("Google account did not return an email");
    }

    return { email: profile.email, name: profile.name };
  }

  private async getAppleProfile(code: string): Promise<SocialProfile> {
    const clientId = this.configService.get<string>("APPLE_CLIENT_ID");
    const clientSecret = this.configService.get<string>("APPLE_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException("Apple sign-in is not configured");
    }

    const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: this.getSocialCallbackUrl("apple"),
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedException("Apple sign-in failed");
    }

    const token = (await tokenResponse.json()) as { id_token?: string };
    const payload = this.decodeJwtPayload<{ email?: string }>(token.id_token);
    if (!payload.email) {
      throw new BadRequestException("Apple account did not return an email");
    }

    return { email: payload.email };
  }

  private decodeJwtPayload<T extends object>(token?: string): T {
    if (!token) {
      throw new UnauthorizedException("Social sign-in failed");
    }

    const [, payload] = token.split(".");
    if (!payload) {
      throw new UnauthorizedException("Social sign-in failed");
    }

    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  }
}
