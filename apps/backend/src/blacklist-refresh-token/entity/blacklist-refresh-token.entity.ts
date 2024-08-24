import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BlacklistRefreshTokenDTO } from '../dto/blacklist-refresh-token.dto';

@Entity('blacklist_refresh_token')
export class BlacklistRefreshTokenEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ unique: true })
    token: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_time', default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    static parserBlacklistRefreshTokenEntityToDTO = (blacklistRefreshTokenEntity: BlacklistRefreshTokenEntity): BlacklistRefreshTokenDTO => {
        const blacklistRefreshTokenDTO: BlacklistRefreshTokenDTO = {
            id: blacklistRefreshTokenEntity.id,
            token: blacklistRefreshTokenEntity.token,
            createdTime: blacklistRefreshTokenEntity.createdTime,
        };
        return blacklistRefreshTokenDTO;
    };
}
