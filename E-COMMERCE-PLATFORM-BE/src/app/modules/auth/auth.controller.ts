import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../../libs/shared/src/decorators";
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
} from "../../../libs/shared/src/dto";
import { UsersService } from "../users/users.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";

interface JwtUser {
  sub: string;
  email: string;
  role: string;
}

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post("register")
  @ApiOkResponse({ description: "Register a new user and return a JWT." })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @ApiOkResponse({ description: "Login and return a JWT." })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Return current JWT payload." })
  me(@CurrentUser() user: JwtUser) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Current user's profile (no password)." })
  getProfile(@CurrentUser() user: JwtUser) {
    return this.usersService.getProfile(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Update the current user's profile." })
  updateProfile(@CurrentUser() user: JwtUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("password")
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Change the current user's password." })
  changePassword(@CurrentUser() user: JwtUser, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(
      user.sub,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
