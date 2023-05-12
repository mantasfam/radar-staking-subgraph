import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Day } from "../../generated/schema";
import { getTotal } from "./total";
import { BIG_INT_ZERO, BIG_INT_ONE, BIG_DEC_ZERO } from "../constants";

export function updateDay(
  timestamp: BigInt,
  decimalAmount: BigDecimal,
  newTransactionFlg: bool,
  eventType: String
): Day {
  const dayId = timestamp.toI32() / 86400;
  let dayStartTimestamp = dayId * 86400; // rounded

  const total = getTotal();

  let day = Day.load(dayId.toString());
  if (day === null) {
    day = new Day(dayId.toString());
    day.timestamp = dayStartTimestamp;
    day.date = new Date(timestamp.toI64() * 1000).toISOString().substring(0, 10);
    day.dayStakedAmount = BIG_DEC_ZERO;
    day.daylUnstakedAmount = BIG_DEC_ZERO;
    day.dayHarvestAmount = BIG_DEC_ZERO;
    day.dayTransactionsCount = BIG_INT_ZERO;
    day.dayStakeEventsCount = BIG_INT_ZERO;
    day.dayUnstakeEventsCount = BIG_INT_ZERO;
    day.dayHarvestEventsCount = BIG_INT_ZERO;
  }

  day.stakedAmount = total.stakedAmount;
  day.harvestedAmount = total.harvestedAmount;
  day.accountsCount = total.accountsCount;
  day.transactionsCount = total.transactionsCount;
  day.stakeEventsCount = total.stakeEventsCount;
  day.unstakeEventsCount = total.unstakeEventsCount;
  day.harvestEventsCount = total.harvestEventsCount;

  if (newTransactionFlg) {
    day.dayTransactionsCount = day.dayTransactionsCount.plus(BIG_INT_ONE);
  }

  if (eventType === "STAKE") {
    day.dayStakedAmount = day.dayStakedAmount.plus(decimalAmount);
    day.dayStakeEventsCount = day.dayStakeEventsCount.plus(BIG_INT_ONE);
  } else if (eventType === "UNSTAKE") {
    day.daylUnstakedAmount = day.daylUnstakedAmount.plus(decimalAmount);
    day.dayUnstakeEventsCount = day.dayUnstakeEventsCount.plus(BIG_INT_ONE);
  } else if (eventType === "HARVEST") {
    day.dayHarvestAmount = day.dayHarvestAmount.plus(decimalAmount);
    day.dayHarvestEventsCount = day.dayHarvestEventsCount.plus(BIG_INT_ONE);
  }

  day.save();

  return day;
}
