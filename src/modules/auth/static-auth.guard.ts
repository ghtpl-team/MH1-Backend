import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class StaticAuthGuard extends AuthGuard('static') {}
