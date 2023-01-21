import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Request } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { CreateSaleDto } from "../dto/sales/create-sale.dto";
import { Permissions } from "../utils/permissions/permission.decorator";
import { Permission } from "../utils/permissions/permission.enum";
import { UsersService } from "../users/users.service";
import { LocationController } from "../location/location.controller";

@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Permissions(Permission.ENTER_CAR_SALES)
  async createSale(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Post()
  @Permissions(Permission.CONTROL_INVENTORY)
  async getSales() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Permissions(Permission.CONTROL_INVENTORY)
  async getSale(@Request() req, @Param('id') id: string) {
    const user = await this.usersService.findOne(req.user.id);
    const sale = await this.salesService.findOne(id);
    if (!sale)
      return null;
    if (!LocationController.userHasPermissionToLocation(user, sale.id))
      throw new HttpException('You do not have permission to fetch sales for this location!', HttpStatus.UNAUTHORIZED);
    return sale;
  }

  @Get('location/:id')
  @Permissions(Permission.ADD_STORE)
  async getLocationSales(@Request() req, @Param('id') id: string) {
    const user = await this.usersService.findOne(req.user.id);
    if (!LocationController.userHasPermissionToLocation(user, id))
      throw new HttpException('You do not have permission to fetch sales for this location!', HttpStatus.UNAUTHORIZED);
    return this.salesService.findByLocation(id);
  }

  @Get('store/:id')
  @Permissions(Permission.CONTROL_INVENTORY)
  async getStoreSales(@Request() req, @Param('id') id: string) {
    const user = await this.usersService.findOne(req.user.id);
    const sales = await this.salesService.findByStore(id);
    const salesToShow = [];
    sales.forEach(sale => {
      if (LocationController.userHasPermissionToLocation(user, sale.id)) salesToShow.push(sale)
    });
    return salesToShow;
  }

  @Get('item/:id')
  @Permissions(Permission.CONTROL_INVENTORY)
  async getItemSales(@Request() req, @Param('id') id: string) {
    const user = await this.usersService.findOne(req.user.id);
    const sales = await this.salesService.findByItem(id);
    const salesToShow = [];
    sales.forEach(sale => {
      if (LocationController.userHasPermissionToLocation(user, sale.id)) salesToShow.push(sale)
    });
    return salesToShow;
  }

  @Get('users/@me')
  @Permissions(Permission.ENTER_CAR_SALES)
  async getSelfSales(@Request() req) {
    return this.salesService.findBySeller(req.user.id);
  }

  @Get('users/:id')
  @Permissions(Permission.CONTROL_INVENTORY)
  async getUserSales(@Request() req, @Param('id') id: string) {
    const user = await this.usersService.findOne(req.user.id);
    const targetSales = await this.salesService.findBySeller(id);
    const salesToShow = [];
    targetSales.forEach(sale => {
      if (LocationController.userHasPermissionToLocation(user, sale.location_id)) salesToShow.push(sale);
    });
    return salesToShow;
  }

  @Delete(':id')
  @Permissions(Permission.CONTROL_INVENTORY)
  async deleteSale(@Request() req, @Param('id') id: string) {
    const sale = await this.salesService.findOne(id);
    if (!sale)
      return null;

    const user = await this.usersService.findOne(req.user.id);
    if (LocationController.userHasPermissionToLocation(user, sale.location_id))
      return this.salesService.deleteOne(id);
    else throw new HttpException('You do not have permission to delete sales for this location!', HttpStatus.UNAUTHORIZED);
  }
}
