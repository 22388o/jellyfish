import { Module } from '@nestjs/common'
import { AppointOracleIndexer } from '../../../module.indexer/model/dftx/appoint.oracle'
import { RemoveOracleIndexer } from '../../../module.indexer/model/dftx/remove.oracle'
import { UpdateOracleIndexer } from '../../../module.indexer/model/dftx/update.oracle'
import { SetOracleDataIndexer } from '../../../module.indexer/model/dftx/set.oracle.data'
import { CreateMasternodeIndexer } from '../../../module.indexer/model/dftx/create.masternode'
import { ResignMasternodeIndexer } from '../../../module.indexer/model/dftx/resign.masternode'
import { CreateTokenIndexer } from '../../../module.indexer/model/dftx/create.token'
import { CreatePoolPairIndexer } from '../../../module.indexer/model/dftx/create.poolpair'
import { UpdatePoolPairIndexer } from '../../../module.indexer/model/dftx/update.poolpair'
import { NetworkName } from '@defichain/jellyfish-network'
import { ConfigService } from '@nestjs/config'
import { SetLoanTokenIndexer } from './set.loan.token'
import { ActivePriceIndexer } from './active.price'
import { PlaceAuctionBidIndexer } from './place.auction.bid'

const indexers = [
  AppointOracleIndexer,
  RemoveOracleIndexer,
  SetOracleDataIndexer,
  UpdateOracleIndexer,
  CreateMasternodeIndexer,
  ResignMasternodeIndexer,
  CreateTokenIndexer,
  CreatePoolPairIndexer,
  UpdatePoolPairIndexer,
  SetLoanTokenIndexer,
  ActivePriceIndexer,
  PlaceAuctionBidIndexer
]

@Module({
  providers: [...indexers,
    {
      provide: 'NETWORK',
      useFactory: (configService: ConfigService): NetworkName => {
        return configService.get<string>('network') as NetworkName
      },
      inject: [ConfigService]
    }],
  exports: indexers
})
export class DfTxIndexerModule {
}
