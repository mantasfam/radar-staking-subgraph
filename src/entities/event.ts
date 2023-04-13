import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { Event } from "../../generated/schema";

export function createEvent(
  txHash: Bytes,
  logId: BigInt,
  eventType: string,
  amount: BigInt
): Event {
  let id = txHash
    .toHexString()
    .concat("-")
    .concat(logId.toString());

  let event = new Event(id);
  event.transaction = txHash.toHexString();
  event.eventType = eventType;
  event.amount = amount;
  event.save();

  return event;
}
