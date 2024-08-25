import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "src/app.entities";

@Controller('users')
export class UserController{
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() userData: Partial<User>): Promise<User> {
        return this.usersService.create(userData);
      }
      
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}