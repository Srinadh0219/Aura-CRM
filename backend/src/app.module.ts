import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ComposeModule } from './compose/compose.module';
import { AuditModule } from './audit/audit.module';
import { AutomationModule } from './automation/automation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuditModule,
    AutomationModule,
    AuthModule,
    UsersModule,
    ComposeModule,
  ],
})
export class AppModule {}
