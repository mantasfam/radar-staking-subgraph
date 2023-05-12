import {
  TokensHarvested as TokensHarvestedEvent,
  TokensStaked as TokensStakedEvent,
  TokensUnstaked as TokensUnstakedEvent,
  TokensUnstakingTriggered as TokensUnstakingTriggeredEvent,
} from "../generated/Contract/Contract";
import { updateAccount } from "./entities/account";
import { createTransaction } from "./entities/transaction";
import { createEvent } from "./entities/activityEvent";
import { updateTotal } from "./entities/total";
import { updateDay } from "./entities/day";
import { BIG_DECIMAL_1E18 } from "./constants";

export function handleTokensStaked(tokensStakedEvent: TokensStakedEvent): void {
  let eventType = "STAKE";
  let decimalAmount = tokensStakedEvent.params.amount.divDecimal(BIG_DECIMAL_1E18);

  const newTransactionFlg = createTransaction(
    tokensStakedEvent.transaction.hash,
    tokensStakedEvent.params.owner,
    tokensStakedEvent.block.timestamp,
    tokensStakedEvent.block.number
  );

  const newAccountFlg = updateAccount(
    tokensStakedEvent.params.owner,
    decimalAmount,
    newTransactionFlg,
    eventType
  );

  createEvent(
    tokensStakedEvent.transaction.hash,
    tokensStakedEvent.logIndex,
    decimalAmount,
    eventType
  );

  updateTotal(decimalAmount, newAccountFlg, newTransactionFlg, eventType);

  updateDay(tokensStakedEvent.block.timestamp, decimalAmount, newTransactionFlg, eventType);
}

export function handleTokensUnstaked(tokensUnstakedEvent: TokensUnstakedEvent): void {
  let eventType = "UNSTAKE";
  let decimalAmount = tokensUnstakedEvent.params.amount.divDecimal(BIG_DECIMAL_1E18);

  const newTransactionFlg = createTransaction(
    tokensUnstakedEvent.transaction.hash,
    tokensUnstakedEvent.params.owner,
    tokensUnstakedEvent.block.timestamp,
    tokensUnstakedEvent.block.number
  );

  const newAccountFlg = updateAccount(
    tokensUnstakedEvent.params.owner,
    decimalAmount,
    newTransactionFlg,
    eventType
  );

  createEvent(
    tokensUnstakedEvent.transaction.hash,
    tokensUnstakedEvent.logIndex,
    decimalAmount,
    eventType
  );

  updateTotal(decimalAmount, newAccountFlg, newTransactionFlg, eventType);

  updateDay(tokensUnstakedEvent.block.timestamp, decimalAmount, newTransactionFlg, eventType);
}

export function handleTokensHarvested(tokensHarvestedEvent: TokensHarvestedEvent): void {
  let eventType = "HARVEST";
  let decimalAmount = tokensHarvestedEvent.params.amount.divDecimal(BIG_DECIMAL_1E18);

  const newTransactionFlg = createTransaction(
    tokensHarvestedEvent.transaction.hash,
    tokensHarvestedEvent.params.owner,
    tokensHarvestedEvent.block.timestamp,
    tokensHarvestedEvent.block.number
  );

  const newAccountFlg = updateAccount(
    tokensHarvestedEvent.params.owner,
    decimalAmount,
    newTransactionFlg,
    eventType
  );

  createEvent(
    tokensHarvestedEvent.transaction.hash,
    tokensHarvestedEvent.logIndex,
    decimalAmount,
    eventType
  );

  updateTotal(decimalAmount, newAccountFlg, newTransactionFlg, eventType);

  updateDay(tokensHarvestedEvent.block.timestamp, decimalAmount, newTransactionFlg, eventType);
}

export function handleTokensUnstakingTriggered(event: TokensUnstakingTriggeredEvent): void {}
