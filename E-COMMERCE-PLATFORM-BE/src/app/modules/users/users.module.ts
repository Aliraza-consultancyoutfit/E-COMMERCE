import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { USER_MODEL } from "../../../libs/shared/src/constants";
import { User, UserSchema } from "../../../libs/shared/src/schemas";
import { UsersService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersService,
    {
      provide: USER_MODEL,
      useValue: User.name,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
