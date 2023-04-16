import { BigInt } from "@graphprotocol/graph-ts";
import { Day } from "../../generated/schema";
import { BIG_INT_ZERO, BIG_INT_ONE } from "../constants";

export function updateDay(
  timestamp: BigInt,
  eventType: String,
  amount: BigInt,
  newTransaction: bool
): Day {
  let dayID = timestamp.toI32() / 86400; // rounded
  let dayStartTimestamp = dayID * 86400;
  let day = Day.load(dayID.toString());
  if (day === null) {
    let previousDay = Day.load((dayID - 1).toString());
    day = new Day(dayID.toString());
    day.timestamp = dayStartTimestamp;
    day.date = new Date(timestamp.toI64()).toISOString();
    if (previousDay === null) {
      day.currentStakeAmount = BIG_INT_ZERO;
      day.totalHarvestAmount = BIG_INT_ZERO;
    } else {
      day.currentStakeAmount = previousDay.currentStakeAmount;
      day.totalHarvestAmount = previousDay.totalHarvestAmount;
    }
    day.totalDayStakedAmount = BIG_INT_ZERO;
    day.totalDaylUnstakedAmount = BIG_INT_ZERO;
    day.totalDayHarvestAmount = BIG_INT_ZERO;
    day.totalTransactions = BIG_INT_ZERO;
  }

  if (eventType === "STAKE") {
    day.totalDayStakedAmount = day.totalDayStakedAmount.plus(amount);
  } else if (eventType === "UNSTAKE") {
    day.totalDaylUnstakedAmount = day.totalDayStakedAmount.plus(amount);
  } else if (eventType === "HARVEST") {
    day.totalDayHarvestAmount = day.totalDayStakedAmount.plus(amount);
  }
  if (newTransaction) {
    day.totalTransactions = day.totalTransactions.plus(BIG_INT_ONE);
  }

  day.save();

  return day;
}
