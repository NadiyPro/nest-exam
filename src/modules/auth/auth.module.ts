import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

// import { Jwt_refreshGuard } from './guards/jwt_refresh.guard';
// import { AuthService } from './services/auth.service';
// import { AuthCacheService } from './services/auth-cache-service';
// import { TokenService } from './services/token.service';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { Jwt_accessGuard } from './guards/jwt_access.guard';

@Module({
  imports: [JwtModule, RedisModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: Jwt_accessGuard,
    },
    // Jwt_refreshGuard,
    // AuthService,
    // AuthCacheService,
    // TokenService,
  ],
  exports: [],
})
export class AuthModule {}
