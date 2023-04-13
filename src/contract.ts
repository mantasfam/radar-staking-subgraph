import {
  OwnershipTransferred as OwnershipTransferredEvent,
  TokensHarvested as TokensHarvestedEvent,
  TokensStaked as TokensStakedEvent,
  TokensUnstaked as TokensUnstakedEvent,
  TokensUnstakingTriggered as TokensUnstakingTriggeredEvent
} from "../generated/Contract/Contract"
import {
  OwnershipTransferred,
  TokensHarvested,
  TokensStaked,
  TokensUnstaked,
  TokensUnstakingTriggered
} from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensHarvested(event: TokensHarvestedEvent): void {
  let entity = new TokensHarvested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensStaked(event: TokensStakedEvent): void {
  let entity = new TokensStaked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensUnstaked(event: TokensUnstakedEvent): void {
  let entity = new TokensUnstaked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensUnstakingTriggered(
  event: TokensUnstakingTriggeredEvent
): void {
  let entity = new TokensUnstakingTriggered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.cooldownSeconds = event.params.cooldownSeconds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
