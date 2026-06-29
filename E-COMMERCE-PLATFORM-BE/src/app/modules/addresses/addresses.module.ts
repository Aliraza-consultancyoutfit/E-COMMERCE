import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ADDRESS_MODEL } from "../../../libs/shared/src/constants";
import { Address, AddressSchema } from "../../../libs/shared/src/schemas";
import { AddressesController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
  controllers: [AddressesController],
  providers: [
    AddressesService,
    {
      provide: ADDRESS_MODEL,
      useValue: Address.name,
    },
  ],
  exports: [AddressesService],
})
export class AddressesModule {}
