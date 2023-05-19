import { BigDecimal } from "@graphprotocol/graph-ts";
import { Total } from "../../generated/schema";
import { BIG_INT_ZERO, BIG_INT_ONE, BIG_DEC_ZERO } from "../constants";

export function getTotal(): Total {
  const id = "1";
  let total = Total.load(id);

  if (total == null) {
    total = new Total(id);
    total.stakedAmount = BIG_DEC_ZERO;
    total.harvestedAmount = BIG_DEC_ZERO;
    total.accountsCount = BIG_INT_ZERO;
    total.transactionsCount = BIG_INT_ZERO;
    total.stakeEventsCount = BIG_INT_ZERO;
    total.unstakeEventsCount = BIG_INT_ZERO;
    total.harvestEventsCount = BIG_INT_ZERO;
  }

  return total;
}

export function updateTotal(
  decimalAmount: BigDecimal,
  newAccountFlg: boolean,
  newTransactionFlg: boolean,
  eventType: string
): void {
  const total = getTotal();

  if (newAccountFlg) {
    total.accountsCount = total.accountsCount.plus(BIG_INT_ONE);
  }

  if (newTransactionFlg) {
    total.transactionsCount = total.transactionsCount.plus(BIG_INT_ONE);
  }

  if (eventType === "STAKE") {
    total.stakedAmount = total.stakedAmount.plus(decimalAmount);
    total.stakeEventsCount = total.stakeEventsCount.plus(BIG_INT_ONE);
  } else if (eventType === "UNSTAKE") {
    total.stakedAmount = total.stakedAmount.minus(decimalAmount);
    total.unstakeEventsCount = total.unstakeEventsCount.plus(BIG_INT_ONE);
  } else if (eventType === "HARVEST") {
    total.harvestedAmount = total.harvestedAmount.plus(decimalAmount);
    total.harvestEventsCount = total.harvestEventsCount.plus(BIG_INT_ONE);
  }

  total.save();
}
