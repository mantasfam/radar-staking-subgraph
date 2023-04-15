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

export function handleTokensHarvested(tokensHarvestedEvent: TokensHarvestedEvent): void {
  let account = getOrCreateAccount(tokensHarvestedEvent.params.owner);

  let day = new Date(tokensHarvestedEvent.block.timestamp.toI32()).toISOString();

  let transaction = getTransaction(tokensHarvestedEvent.transaction.hash);
  if (transaction == null) {
    createTransaction(
      tokensHarvestedEvent.transaction.hash,
      account,
      tokensHarvestedEvent.block.timestamp,
      tokensHarvestedEvent.block.number,
      day
    );
    account.totalTransactions = account.totalTransactions.plus(BIG_INT_ONE);
  }

  account.totalHarvestAmount = account.totalHarvestAmount.plus(tokensHarvestedEvent.params.amount);
  account.totalHarvestEvents = account.totalHarvestEvents.plus(BIG_INT_ONE);
  account.save();

  createEvent(
    tokensHarvestedEvent.transaction.hash,
    tokensHarvestedEvent.logIndex,
    "HARVEST",
    tokensHarvestedEvent.params.amount
  );
}

export function handleTokensStaked(tokensStakedEvent: TokensStakedEvent): void {
  let account = getOrCreateAccount(tokensStakedEvent.params.owner);

  let day = new Date(tokensStakedEvent.block.timestamp.toI32()).toISOString();

  let transaction = getTransaction(tokensStakedEvent.transaction.hash);
  if (transaction == null) {
    createTransaction(
      tokensStakedEvent.transaction.hash,
      account,
      tokensStakedEvent.block.timestamp,
      tokensStakedEvent.block.number,
      day
    );

    account.totalTransactions = account.totalTransactions.plus(BIG_INT_ONE);
  }

  account.currentStakeAmount = account.currentStakeAmount.plus(tokensStakedEvent.params.amount);
  account.totalStakeEvents = account.totalStakeEvents.plus(BIG_INT_ONE);
  account.save();

  createEvent(
    tokensStakedEvent.transaction.hash,
    tokensStakedEvent.logIndex,
    "STAKE",
    tokensStakedEvent.params.amount
  );
}

export function handleTokensUnstaked(tokensUnstakedEvent: TokensUnstakedEvent): void {
  let account = getOrCreateAccount(tokensUnstakedEvent.params.owner);

  let day = new Date(tokensUnstakedEvent.block.timestamp.toI32()).toISOString();

  let transaction = getTransaction(tokensUnstakedEvent.transaction.hash);
  if (transaction == null) {
    createTransaction(
      tokensUnstakedEvent.transaction.hash,
      account,
      tokensUnstakedEvent.block.timestamp,
      tokensUnstakedEvent.block.number,
      day
    );

    account.totalTransactions = account.totalTransactions.plus(BIG_INT_ONE);
  }
  account.currentStakeAmount = account.currentStakeAmount.minus(tokensUnstakedEvent.params.amount);
  account.totalUnstakeEvents = account.totalUnstakeEvents.plus(BIG_INT_ONE);
  account.save();

  createEvent(
    tokensUnstakedEvent.transaction.hash,
    tokensUnstakedEvent.logIndex,
    "UNSTAKE",
    tokensUnstakedEvent.params.amount
  );
}

export function handleTokensUnstakingTriggered(event: TokensUnstakingTriggeredEvent): void {}
