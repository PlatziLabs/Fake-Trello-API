import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { UsersController } from './controllers/users.controller';
import { ListController } from './controllers/lists.controller';
import { ListService } from './services/list.service';
import { CardsController } from './controllers/cards.controller';
import { MeController } from './controllers/me.controller';
import { AuthController } from './controllers/auth.controller';
import { BoardController } from './controllers/boards.controller';
import { SeedController } from './controllers/seed.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { CardService } from './services/card.service';
import { BoardService } from './services/board.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import config from './config/config';
import environments from './config/environments';
import { DatabaseModule } from '@db/database.module';
import { SeedService } from './services/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env.local',
      load: [config],
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.accessSecretKey,
        };
      },
      inject: [config.KEY],
    }),
    DatabaseModule,
  ],
  controllers: [
    UsersController,
    AuthController,
    SeedController,
    BoardController,
    MeController,
    CardsController,
    ListController,
  ],
  providers: [
    AuthService,
    UsersService,
    BoardService,
    CardService,
    JwtStrategy,
    LocalStrategy,
    SeedService,
    ListService,
  ],
})
export class AppModule {}
