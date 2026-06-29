import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../../libs/shared/src/decorators";
import {
  CreateAddressDto,
  UpdateAddressDto,
} from "../../../libs/shared/src/dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AddressesService } from "./addresses.service";

interface JwtUser {
  sub: string;
}

@ApiTags("Addresses")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("addresses")
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOkResponse({ description: "The current user's addresses (default first)." })
  listMine(@CurrentUser() user: JwtUser) {
    return this.addressesService.listMine(user.sub);
  }

  @Post()
  @ApiOkResponse({ description: "Create an address for the current user." })
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(user.sub, dto);
  }

  @Patch(":id/default")
  @ApiOkResponse({ description: "Set an address as the default." })
  setDefault(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.addressesService.setDefault(user.sub, id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Update one of the current user's addresses." })
  update(
    @CurrentUser() user: JwtUser,
    @Param("id") id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(user.sub, id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Delete one of the current user's addresses." })
  remove(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.addressesService.remove(user.sub, id);
  }
}
