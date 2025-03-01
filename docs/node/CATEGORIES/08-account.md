---
id: account
title: Account API
sidebar_label: Account API
slug: /jellyfish/api/account
---

```js
import {Client} from '@defichain/jellyfish'
const client = new Client()
// Using client.account.
const something = await client.account.method()
```

## listAccounts

Returns information about all accounts on chain

```ts title="client.account.listAccounts()"
interface account {
  listAccounts (pagination?: AccountPagination, verbose?: boolean, options?: ListAccountOptions): Promise<Array<AccountResult<AccountOwner, string>>>
  listAccounts (pagination: AccountPagination, verbose: false, options: {indexedAmounts: false, isMineOnly: boolean}): Promise<Array<AccountResult<string, string>>>
  listAccounts (pagination: AccountPagination, verbose: true, options: {indexedAmounts: true, isMineOnly: boolean}): Promise<Array<AccountResult<AccountOwner, AccountAmount>>>
  listAccounts (pagination: AccountPagination, verbose: false, options: {indexedAmounts: true, isMineOnly: boolean}): Promise<Array<AccountResult<string, AccountAmount>>>
  listAccounts<T, U> (
    pagination: AccountPagination = { limit: 100 },
    verbose = true,
    options: ListAccountOptions = { indexedAmounts: false, isMineOnly: false }
  ): Promise<Array<AccountResult<T, U>>>
}

interface AccountPagination {
  start?: number
  including_start?: boolean
  limit?: number
}

interface AccountResult<T, U> {
  key: string
  owner: T // string | AccountOwner (if verbose true)
  amount: U // string | AccountAmount (if options.indexedAmounts true)
}

interface AccountOwner {
  asm: string
  hex: string
  reqSigs: BigNumber
  type: string
  addresses: string[]
}

interface AccountAmount {
  [id: string]: BigNumber
}

interface ListAccountOptions {
  indexedAmounts?: boolean
  isMineOnly?: boolean
}
```

## getAccount

Returns information about account

```ts title="client.account.getAccount()"
interface account {
  getAccount (owner: string, pagination: AccountPagination, options: { indexedAmounts: true }): Promise<AccountAmount>
  getAccount (owner: string, pagination?: AccountPagination, options?: GetAccountOptions): Promise<string[]>
  getAccount (
    owner: string,
    pagination: AccountPagination = { limit: 100 },
    options: GetAccountOptions = { indexedAmounts: false }
  ): Promise<string[] | AccountAmount>
}
```

## getTokenBalances

Returns the balances of all accounts that belong to the wallet

```ts title="client.account.getTokenBalances()"
interface account {
  getTokenBalances (pagination?: AccountPagination, indexedAmounts?: boolean, options?: GetTokenBalancesOptions): Promise<string[]>
  getTokenBalances (pagination: AccountPagination, indexedAmounts: true, options: { symbolLookup: false }): Promise<AccountAmount>
  getTokenBalances (pagination: AccountPagination, indexedAmounts: false, options: { symbolLookup: true }): Promise<string[]>
  getTokenBalances (pagination: AccountPagination, indexedAmounts: true, options: { symbolLookup: true }): Promise<AccountAmount>
  getTokenBalances (
    pagination: AccountPagination = { limit: 100 },
    indexedAmounts = false,
    options: GetTokenBalancesOptions = { symbolLookup: false}
  ): Promise<string[] | AccountAmount>
}

interface AccountAmount {
  [id: string]: BigNumber
}

interface AccountPagination {
  start?: string | number
  including_start?: boolean
  limit?: number
}

interface GetTokenBalancesOptions {
  symbolLookup?: boolean
}
```

## utxosToAccount

Create a UTXOs to Account transaction submitted to a connected node.
Optionally, specific UTXOs to spend to create that transaction.

```ts title="client.account.utxosToAccount()"
interface account {
  utxosToAccount (payload: BalanceTransferPayload, utxos: UTXO[] = []): Promise<string>
}

interface BalanceTransferPayload {
  [key: string]: string // `${number}@${string}`
}

interface UTXO {
  txid: string
  vout: number
}
```

## accountToAccount

Create an Account to Account transaction submitted to a connected node.
Optionally, specific UTXOs to spend to create that transaction.

```ts title="client.account.accountToAccount()"
interface account {
  accountToAccount (from: string, payload: BalanceTransferPayload, options: BalanceTransferAccountOptions = { utxos: [] }): Promise<string>
}

interface BalanceTransferPayload {
  [key: string]: string // `${number}@${string}`
}

interface BalanceTransferAccountOptions {
  utxos?: UTXO[]
}

interface UTXO {
  txid: string
  vout: number
}
```

## accountToUtxos

Create an Account to UTXOS transaction submitted to a connected node.
Optionally, specific UTXOs to spend to create that transaction.

```ts title="client.account.accountToUtxos()"
interface account {
  accountToUtxos (from: string, payload: BalanceTransferPayload, options: BalanceTransferAccountOptions = { utxos: [] }): Promise<string>
}

interface BalanceTransferPayload {
  [key: string]: string // `${number}@${string}`
}

interface BalanceTransferAccountOptions {
  utxos?: UTXO[]
}

interface UTXO {
  txid: string
  vout: number
}
```

## listAccountHistory

Returns information about account history

```ts title="client.account.listAccountHistory()"
interface account {
  listAccountHistory (
    owner: OwnerType | string = OwnerType.MINE,
    options: AccountHistoryOptions = {
      limit: 100
    }
  ): Promise<AccountHistory[]>
}

enum OwnerType {
  MINE = "mine",
  ALL = "all"
}

enum DfTxType {
  MINT_TOKEN = 'M',
  POOL_SWAP = 's',
  ADD_POOL_LIQUIDITY = 'l',
  REMOVE_POOL_LIQUIDITY = 'r',
  UTXOS_TO_ACCOUNT = 'U',
  ACCOUNT_TO_UTXOS = 'b',
  ACCOUNT_TO_ACCOUNT = 'B',
  ANY_ACCOUNTS_TO_ACCOUNTS = 'a',
  CREATE_MASTERNODE = 'C',
  RESIGN_MASTERNODE = 'R',
  CREATE_TOKEN = 'T',
  UPDATE_TOKEN = 'N',
  UPDATE_TOKEN_ANY = 'n',
  CREATE_POOL_PAIR = 'p',
  UPDATE_POOL_PAIR = 'u',
  SET_GOV_VARIABLE = 'G',
  AUTO_AUTH_PREP = 'A',
  NONE = '0'
}

interface AccountHistory {
  owner: string
  blockHeight: number
  blockHash: string
  blockTime: number
  type: string
  txn: number
  txid: string
  amounts: string[]
}

interface AccountHistoryOptions {
  maxBlockHeight?: number
  depth?: number
  no_rewards?: boolean
  token?: string
  txtype?: DfTxType
  limit?: number
}
```

## getAccountHistory

Returns information about single account history

```ts title="client.account.getAccountHistory()"
interface account {
  getAccountHistory (
    owner: string,
    blockHeight: number,
    txn:number
  ): Promise<AccountHistory>
}

interface AccountHistory {
  owner: string
  blockHeight: number
  blockHash: string
  blockTime: number
  type: string
  txn: number
  txid: string
  amounts: string[]
}
```

## historyCount 

Returns count of account history

```ts title="client.account.historyCount()"
interface account {
  historyCount (
    owner: OwnerType | string = OwnerType.MINE,
    options: AccountHistoryCountOptions = {}
  ): Promise<number>
}

enum OwnerType {
  MINE = "mine",
  ALL = "all"
}

enum DfTxType {
  MINT_TOKEN = 'M',
  POOL_SWAP = 's',
  ADD_POOL_LIQUIDITY = 'l',
  REMOVE_POOL_LIQUIDITY = 'r',
  UTXOS_TO_ACCOUNT = 'U',
  ACCOUNT_TO_UTXOS = 'b',
  ACCOUNT_TO_ACCOUNT = 'B',
  ANY_ACCOUNTS_TO_ACCOUNTS = 'a',
  CREATE_MASTERNODE = 'C',
  RESIGN_MASTERNODE = 'R',
  CREATE_TOKEN = 'T',
  UPDATE_TOKEN = 'N',
  UPDATE_TOKEN_ANY = 'n',
  CREATE_POOL_PAIR = 'p',
  UPDATE_POOL_PAIR = 'u',
  SET_GOV_VARIABLE = 'G',
  AUTO_AUTH_PREP = 'A',
  NONE = '0'
}

interface AccountHistoryCountOptions {
  token?: string
  txtype?: DfTxType
  no_rewards?: boolean
}
```

## sendTokensToAddress

Creates a transfer transaction from your accounts balances.

```ts title="client.account.sendTokensToAddress()"
interface account {
  sendTokensToAddress (
    from: AddressBalances,
    to: AddressBalances,
    options: SendTokensOptions = { selectionMode: SelectionModeType.PIE }
  ): Promise<string>
}

enum SelectionModeType {
  PIE = 'pie',
  CRUMBS = 'crumbs',
  FORWARD = 'forward'
}

interface AddressBalances {
  [key: string]: string[] // `${number}@${string}`[]
}

interface SendTokensOptions {
  selectionMode: SelectionModeType
}
```

## listCommunityBalances

Returns information about current anchor bonus, incentive funding, burnt token(s)

```ts title="client.account.listCommunityBalances()"
interface account {
  listCommunityBalances (): Promise<CommunityBalanceData>
}

interface CommunityBalanceData {
  AnchorReward: BigNumber
  IncentiveFunding?: BigNumber
  Burnt: BigNumber
  Swap?: BigNumber
  Futures?: BigNumber
  Options?: BigNumber
  Unallocated?: BigNumber
  Unknown?: BigNumber
}
```

## listBurnHistory

Returns information about burn history

```ts title="client.account.listBurnHistory()"
interface account {
  listBurnHistory (
    options: BurnHistoryOptions = { limit: 100 }
  ): Promise<BurnHistory[]>
}

enum DfTxType {
  MINT_TOKEN = 'M',
  POOL_SWAP = 's',
  ADD_POOL_LIQUIDITY = 'l',
  REMOVE_POOL_LIQUIDITY = 'r',
  UTXOS_TO_ACCOUNT = 'U',
  ACCOUNT_TO_UTXOS = 'b',
  ACCOUNT_TO_ACCOUNT = 'B',
  ANY_ACCOUNTS_TO_ACCOUNTS = 'a',
  CREATE_MASTERNODE = 'C',
  RESIGN_MASTERNODE = 'R',
  CREATE_TOKEN = 'T',
  UPDATE_TOKEN = 'N',
  UPDATE_TOKEN_ANY = 'n',
  CREATE_POOL_PAIR = 'p',
  UPDATE_POOL_PAIR = 'u',
  SET_GOV_VARIABLE = 'G',
  AUTO_AUTH_PREP = 'A',
  NONE = '0'
}

interface BurnHistoryOptions {
  maxBlockHeight?: number
  depth?: number
  token?: string
  txtype?: DfTxType
  limit?: number
}

interface BurnHistory {
  owner: string
  blockHeight: number
  blockHash: string
  blockTime: number
  type: string
  txn: number
  txid: string
  amounts: string[]
}
```

## getBurnInfo

Returns burn address, burnt coin and token information.
Requires full acindex for correct amount, tokens and feeburn values.

```ts title="client.account.getBurnInfo()"
interface account {
  getBurnInfo (): Promise<BurnInfo>
}

interface BurnInfo {
  address: string
  /**
   * Amount send to burn address
   */
  amount: BigNumber
  /**
   * Token amount send to burn address; formatted as AMOUNT@SYMBOL
   */
  tokens: string[]
  /**
   * Amount collected via fee burn
   */
  feeburn: BigNumber
  /**
   * Amount collected via emission burn
   */
  emissionburn: BigNumber
  /**
   * Value of burn after payback
   */
  paybackburn: BigNumber
  /**
   * Amount collected via auction burn
   */
  auctionburn: BigNumber
  /**
   * Formatted as AMOUNT@SYMBOL
   */
  dexfeetokens: string[]
  /**
   * Amount of DFI collected from penalty resulting from paying DUSD using DFI
   */
  dfipaybackfee: BigNumber
  /**
   * Amount of tokens that are paid back; formatted as AMOUNT@SYMBOL
   */
  dfipaybacktokens: string[]
}
```
