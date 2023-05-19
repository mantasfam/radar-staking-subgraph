import { Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { ActivityEvent } from "../../generated/schema";

export function createEvent(
  txHash: Bytes,
  logId: BigInt,
  decimalAmount: BigDecimal,
  eventType: String
): ActivityEvent {
  let id = txHash
    .toHexString()
    .concat("-")
    .concat(logId.toString());

  let event = new ActivityEvent(id);
  event.transaction = txHash.toHexString();
  event.eventType = eventType;
  event.amount = decimalAmount;
  event.save();

  return event;
}
