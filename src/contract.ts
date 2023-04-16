import {
  TokensHarvested as TokensHarvestedEvent,
  TokensStaked as TokensStakedEvent,
  TokensUnstaked as TokensUnstakedEvent,
  TokensUnstakingTriggered as TokensUnstakingTriggeredEvent,
} from "../generated/Contract/Contract";
import { getOrCreateAccount } from "./entities/account";
import { getTransaction, createTransaction } from "./entities/transaction";
import { createEvent } from "./entities/event";
import { BIG_INT_ONE } from "./constants";
import { updateDay } from "./entities/day";

export function handleTokensHarvested(tokensHarvestedEvent: TokensHarvestedEvent): void {
  let eventType = "HARVEST";

  let account = getOrCreateAccount(tokensHarvestedEvent.params.owner);

  let transaction = getTransaction(tokensHarvestedEvent.transaction.hash);
  let newTransactionFlg = false;
  if (transaction == null) {
    createTransaction(
      tokensHarvestedEvent.transaction.hash,
      account,
      tokensHarvestedEvent.block.timestamp,
      tokensHarvestedEvent.block.number
    );
    account.totalTransactions = account.totalTransactions.plus(BIG_INT_ONE);
    newTransactionFlg = true;
  }

  account.totalHarvestAmount = account.totalHarvestAmount.plus(tokensHarvestedEvent.params.amount);
  account.totalHarvestEvents = account.totalHarvestEvents.plus(BIG_INT_ONE);
  account.save();

  createEvent(
    tokensHarvestedEvent.transaction.hash,
    tokensHarvestedEvent.logIndex,
    eventType,
    tokensHarvestedEvent.params.amount
  );

  updateDay(
    tokensHarvestedEvent.block.timestamp,
    eventType,
    tokensHarvestedEvent.block.timestamp,
    newTransactionFlg
  );
}

export function handleTokensStaked(tokensStakedEvent: TokensStakedEvent): void {
  let eventType = "STAKE";

  let account = getOrCreateAccount(tokensStakedEvent.params.owner);

  let transaction = getTransaction(tokensStakedEvent.transaction.hash);
  let newTransactionFlg = false;
  if (transaction == null) {
    createTransaction(
      tokensStakedEvent.transaction.hash,
      account,
      tokensStakedEvent.block.timestamp,
      tokensStakedEvent.block.number
    );
    account.totalTransactions = account.totalTransactions.plus(BIG_INT_ONE);
    newTransactionFlg = true;
  }

  account.currentStakeAmount = account.currentStakeAmount.plus(tokensStakedEvent.params.amount);
  account.totalStakeEvents = account.totalStakeEvents.plus(BIG_INT_ONE);
  account.save();

  createEvent(
    tokensStakedEvent.transaction.hash,
    tokensStakedEvent.logIndex,
    eventType,
    tokensStakedEvent.params.amount
  );

  updateDay(
    tokensStakedEvent.block.timestamp,
    eventType,
    tokensStakedEvent.block.timestamp,
    newTransactionFlg
  );
}

export function handleTokensUnstaked(tokensUnstakedEvent: TokensUnstakedEvent): void {
  let eventType = "UNSTAKE";

  let account = getOrCreateAccount(tokensUnstakedEvent.params.owner);

  let transaction = getTransaction(tokensUnstakedEvent.transaction.hash);
  let newTransactionFlg = false;
  if (transaction == null) {
    createTransaction(
      tokensUnstakedEvent.transaction.hash,
      account,
      tokensUnstakedEvent.block.timestamp,
      tokensUnstakedEvent.block.number
    );
    account.totalTransactions = account.totalTransactions.plus(BIG_INT_ONE);
    newTransactionFlg = true;
  }

  account.currentStakeAmount = account.currentStakeAmount.minus(tokensUnstakedEvent.params.amount);
  account.totalUnstakeEvents = account.totalUnstakeEvents.plus(BIG_INT_ONE);
  account.save();

  createEvent(
    tokensUnstakedEvent.transaction.hash,
    tokensUnstakedEvent.logIndex,
    eventType,
    tokensUnstakedEvent.params.amount
  );

  updateDay(
    tokensUnstakedEvent.block.timestamp,
    eventType,
    tokensUnstakedEvent.params.amount,
    newTransactionFlg
  );
}

export function handleTokensUnstakingTriggered(event: TokensUnstakingTriggeredEvent): void {}
