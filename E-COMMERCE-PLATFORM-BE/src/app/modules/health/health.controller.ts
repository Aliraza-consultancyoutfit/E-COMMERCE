import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOkResponse({ description: "Service health status." })
  check() {
    return {
      status: "ok",
      service: "e-commerce-platform-be",
    };
  }
}
