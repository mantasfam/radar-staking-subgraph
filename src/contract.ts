import {
  TokensHarvested as TokensHarvestedEvent,
  TokensStaked as TokensStakedEvent,
  TokensUnstaked as TokensUnstakedEvent,
  TokensUnstakingTriggered as TokensUnstakingTriggeredEvent,
} from "../generated/Contract/Contract";
import { Account, Event, Transaction } from "../generated/schema";
import { getOrCreateAccount } from "./entities/account";
import { getOrCreateTransaction } from "./entities/transaction";
import { createEvent } from "./entities/event";
import { BIG_INT_ONE } from "./constants";

export function handleTokensHarvested(event: TokensHarvestedEvent): void {
  /*let entity = new TokensHarvested(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.owner = event.params.owner;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();*/
}

export function handleTokensStaked(tokensStakedEvent: TokensStakedEvent): void {
  let account = getOrCreateAccount(tokensStakedEvent.params.owner);
  account.currentStakeAmount = account.currentStakeAmount.plus(tokensStakedEvent.params.amount);
  account.totalStakeEvents = account.totalStakeEvents.plus(BIG_INT_ONE);
  account.save();

  let day = new Date(tokensStakedEvent.block.timestamp.toI32()).toISOString();

  getOrCreateTransaction(
    tokensStakedEvent.transaction.hash,
    tokensStakedEvent.params.owner,
    tokensStakedEvent.block.timestamp,
    tokensStakedEvent.block.number,
    day
  );

  createEvent(
    tokensStakedEvent.transaction.hash,
    tokensStakedEvent.logIndex,
    "STAKE",
    tokensStakedEvent.params.amount
  );
}

export function handleTokensUnstaked(event: TokensUnstakedEvent): void {
  /*let entity = new TokensUnstaked(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.owner = event.params.owner;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();*/
}

export function handleTokensUnstakingTriggered(event: TokensUnstakingTriggeredEvent): void {}
