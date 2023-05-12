import { Address, BigDecimal } from "@graphprotocol/graph-ts";
import { Account } from "../../generated/schema";
import { BIG_INT_ZERO, BIG_INT_ONE, BIG_DEC_ZERO } from "../constants";

export function updateAccount(
  address: Address,
  decimalAmount: BigDecimal,
  newTransactionFlg: boolean,
  eventType: string
): boolean {
  const addressString = address.toHexString();
  let account = Account.load(addressString);
  let newAccountFlg = false;

  if (account == null) {
    account = new Account(addressString);
    account.address = address;
    account.stakedAmount = BIG_DEC_ZERO;
    account.harvestedAmount = BIG_DEC_ZERO;
    account.transactionsCount = BIG_INT_ZERO;
    account.stakeEventsCount = BIG_INT_ZERO;
    account.unstakeEventsCount = BIG_INT_ZERO;
    account.harvestEventsCount = BIG_INT_ZERO;
    newAccountFlg = true;
  }

  if (newTransactionFlg) {
    account.transactionsCount = account.transactionsCount.plus(BIG_INT_ONE);
  }

  if (eventType === "STAKE") {
    account.stakedAmount = account.stakedAmount.plus(decimalAmount);
    account.stakeEventsCount = account.stakeEventsCount.plus(BIG_INT_ONE);
  } else if (eventType === "UNSTAKE") {
    account.stakedAmount = account.stakedAmount.minus(decimalAmount);
    account.unstakeEventsCount = account.unstakeEventsCount.plus(BIG_INT_ONE);
  } else if (eventType === "HARVEST ") {
    account.harvestedAmount = account.harvestedAmount.plus(decimalAmount);
    account.harvestEventsCount = account.harvestEventsCount.plus(BIG_INT_ONE);
  }

  account.save();

  return newAccountFlg;
}
