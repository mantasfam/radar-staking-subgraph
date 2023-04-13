import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  TokensHarvested,
  TokensStaked,
  TokensUnstaked,
  TokensUnstakingTriggered
} from "../generated/Contract/Contract"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createTokensHarvestedEvent(
  owner: Address,
  amount: BigInt
): TokensHarvested {
  let tokensHarvestedEvent = changetype<TokensHarvested>(newMockEvent())

  tokensHarvestedEvent.parameters = new Array()

  tokensHarvestedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  tokensHarvestedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokensHarvestedEvent
}

export function createTokensStakedEvent(
  owner: Address,
  amount: BigInt
): TokensStaked {
  let tokensStakedEvent = changetype<TokensStaked>(newMockEvent())

  tokensStakedEvent.parameters = new Array()

  tokensStakedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  tokensStakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokensStakedEvent
}

export function createTokensUnstakedEvent(
  owner: Address,
  amount: BigInt
): TokensUnstaked {
  let tokensUnstakedEvent = changetype<TokensUnstaked>(newMockEvent())

  tokensUnstakedEvent.parameters = new Array()

  tokensUnstakedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  tokensUnstakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokensUnstakedEvent
}

export function createTokensUnstakingTriggeredEvent(
  owner: Address,
  cooldownSeconds: BigInt
): TokensUnstakingTriggered {
  let tokensUnstakingTriggeredEvent = changetype<TokensUnstakingTriggered>(
    newMockEvent()
  )

  tokensUnstakingTriggeredEvent.parameters = new Array()

  tokensUnstakingTriggeredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  tokensUnstakingTriggeredEvent.parameters.push(
    new ethereum.EventParam(
      "cooldownSeconds",
      ethereum.Value.fromUnsignedBigInt(cooldownSeconds)
    )
  )

  return tokensUnstakingTriggeredEvent
}
