import { Global, Module } from '@nestjs/common'
import { ModelProbeIndicator } from '../module.model/_model.probes'
import { RawBlockMapper } from '../module.model/raw.block'
import { BlockMapper } from '../module.model/block'
import { ScriptActivityMapper } from '../module.model/script.activity'
import { ScriptAggregationMapper } from '../module.model/script.aggregation'
import { ScriptUnspentMapper } from '../module.model/script.unspent'
import { TransactionMapper } from '../module.model/transaction'
import { TransactionVinMapper } from '../module.model/transaction.vin'
import { TransactionVoutMapper } from '../module.model/transaction.vout'
import { OracleHistoryMapper } from '../module.model/oracle.history'
import { OraclePriceAggregatedMapper } from '../module.model/oracle.price.aggregated'
import { OraclePriceFeedMapper } from '../module.model/oracle.price.feed'
import { OracleTokenCurrencyMapper } from '../module.model/oracle.token.currency'
import { OracleMapper } from '../module.model/oracle'
import { PriceTickerMapper } from '../module.model/price.ticker'
import { MasternodeMapper } from '../module.model/masternode'
import { MasternodeStatsMapper } from '../module.model/masternode.stats'
import { TokenMapper } from '../module.model/token'
import { PoolPairMapper } from '../module.model/poolpair'
import { PoolPairTokenMapper } from '../module.model/poolpair.token'
import { OraclePriceActiveMapper } from './oracle.price.active'
import { VaultAuctionHistoryMapper } from './vault.auction.batch.history'

@Global()
@Module({
  providers: [
    ModelProbeIndicator,
    RawBlockMapper,
    BlockMapper,
    ScriptActivityMapper,
    ScriptAggregationMapper,
    ScriptUnspentMapper,
    TransactionMapper,
    TransactionVinMapper,
    TransactionVoutMapper,
    OracleHistoryMapper,
    OraclePriceAggregatedMapper,
    OraclePriceFeedMapper,
    OracleTokenCurrencyMapper,
    OracleMapper,
    OraclePriceActiveMapper,
    PriceTickerMapper,
    MasternodeMapper,
    MasternodeStatsMapper,
    TokenMapper,
    PoolPairMapper,
    PoolPairTokenMapper,
    VaultAuctionHistoryMapper
  ],
  exports: [
    ModelProbeIndicator,
    RawBlockMapper,
    BlockMapper,
    ScriptActivityMapper,
    ScriptAggregationMapper,
    ScriptUnspentMapper,
    TransactionMapper,
    TransactionVinMapper,
    TransactionVoutMapper,
    OracleHistoryMapper,
    OraclePriceAggregatedMapper,
    OraclePriceFeedMapper,
    OracleTokenCurrencyMapper,
    OracleMapper,
    OraclePriceActiveMapper,
    PriceTickerMapper,
    MasternodeMapper,
    MasternodeStatsMapper,
    TokenMapper,
    PoolPairMapper,
    PoolPairTokenMapper,
    VaultAuctionHistoryMapper
  ]
})
export class ModelModule {
}
