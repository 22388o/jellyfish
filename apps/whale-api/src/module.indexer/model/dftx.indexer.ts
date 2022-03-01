import { OP_DEFI_TX, OPCode, toOPCodes } from '@defichain/jellyfish-transaction'
import { Indexer, RawBlock } from '../../module.indexer/model/_abstract'
import { SmartBuffer } from 'smart-buffer'
import { AppointOracleIndexer } from '../../module.indexer/model/dftx/appoint.oracle'
import { RemoveOracleIndexer } from '../../module.indexer/model/dftx/remove.oracle'
import { UpdateOracleIndexer } from '../../module.indexer/model/dftx/update.oracle'
import { SetOracleDataIndexer } from '../../module.indexer/model/dftx/set.oracle.data'
import { CreateMasternodeIndexer } from '../../module.indexer/model/dftx/create.masternode'
import { ResignMasternodeIndexer } from '../../module.indexer/model/dftx/resign.masternode'
import { Injectable, Logger } from '@nestjs/common'
import { DfTxIndexer, DfTxTransaction } from '../../module.indexer/model/dftx/_abstract'
import { CreatePoolPairIndexer } from './dftx/create.poolpair'
import { CreateTokenIndexer } from './dftx/create.token'
import { UpdatePoolPairIndexer } from './dftx/update.poolpair'
import { SetLoanTokenIndexer } from './dftx/set.loan.token'
import { ActivePriceIndexer } from './dftx/active.price'
import { PlaceAuctionBidIndexer } from './dftx/place.auction.bid'

@Injectable()
export class MainDfTxIndexer extends Indexer {
  private readonly logger = new Logger(MainDfTxIndexer.name)
  private readonly indexers: Array<DfTxIndexer<any>>

  constructor (
    private readonly appointOracle: AppointOracleIndexer,
    private readonly removeOracle: RemoveOracleIndexer,
    private readonly updateOracle: UpdateOracleIndexer,
    private readonly setOracleData: SetOracleDataIndexer,
    private readonly createMasternode: CreateMasternodeIndexer,
    private readonly resignMasternode: ResignMasternodeIndexer,
    private readonly createToken: CreateTokenIndexer,
    private readonly createPoolPair: CreatePoolPairIndexer,
    private readonly updatePoolPair: UpdatePoolPairIndexer,
    private readonly setLoanToken: SetLoanTokenIndexer,
    private readonly activePriceIndexer: ActivePriceIndexer,
    private readonly placeAuctionBidIndexer: PlaceAuctionBidIndexer
  ) {
    super()
    this.indexers = [
      appointOracle,
      updateOracle,
      removeOracle,
      setOracleData,
      createMasternode,
      resignMasternode,
      createToken,
      createPoolPair,
      updatePoolPair,
      setLoanToken,
      activePriceIndexer,
      placeAuctionBidIndexer
    ]
  }

  async index (block: RawBlock): Promise<void> {
    for (const indexer of this.indexers) {
      await indexer.indexBlockStart(block)
    }

    const transactions = this.getDfTxTransactions(block)
    for (const transaction of transactions) {
      const filtered = this.indexers.filter(value => transaction.dftx.type === value.OP_CODE)
      for (const indexer of filtered) {
        await indexer.indexTransaction(block, transaction)
      }
    }

    for (const indexer of this.indexers) {
      await indexer.indexBlockEnd(block)
    }
  }

  async invalidate (block: RawBlock): Promise<void> {
    // When invalidating reverse the order of block indexing
    for (const indexer of this.indexers) {
      await indexer.invalidateBlockEnd(block)
    }

    // Invalidate backwards
    const transactions = this.getDfTxTransactions(block).reverse()
    for (const transaction of transactions) {
      const filtered = this.indexers.filter(value => transaction.dftx.type === value.OP_CODE).reverse()
      for (const indexer of filtered) {
        await indexer.invalidateTransaction(block, transaction)
      }
    }

    for (const indexer of this.indexers) {
      await indexer.invalidateBlockStart(block)
    }
  }

  private getDfTxTransactions (block: RawBlock): Array<DfTxTransaction<any>> {
    const transactions: Array<DfTxTransaction<any>> = []

    for (const txn of block.tx) {
      for (const vout of txn.vout) {
        if (!vout.scriptPubKey.asm.startsWith('OP_RETURN 44665478')) {
          continue
        }

        try {
          const stack: OPCode[] = toOPCodes(SmartBuffer.fromBuffer(Buffer.from(vout.scriptPubKey.hex, 'hex')))
          if (stack[1].type !== 'OP_DEFI_TX') {
            continue
          }
          transactions.push({ txn: txn, dftx: (stack[1] as OP_DEFI_TX).tx })
        } catch (err) {
          // TODO(fuxingloh): we can improve on this design by having separated indexing pipeline where
          //  a failed pipeline won't affect another indexer pipeline.
          this.logger.error(`Failed to parse a DfTx Transaction with txid: ${txn.txid}`, err)
        }
      }
    }

    return transactions
  }
}
