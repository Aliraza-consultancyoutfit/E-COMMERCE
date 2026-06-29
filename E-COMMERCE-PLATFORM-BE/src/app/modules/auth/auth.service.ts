import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto, RegisterDto } from "../../../libs/shared/src/dto";
import { UserRole } from "../../../libs/shared/src/schemas";
import { compareHash, hashValue } from "../../../libs/shared/src/utils";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
}
