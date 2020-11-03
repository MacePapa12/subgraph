import { BigInt } from '@graphprotocol/graph-ts';
import { Approval, LogRebase, Transfer } from '../generated/debase/debase';
import { User } from '../generated/schema';

export function handleApproval(event: Approval): void {}

export function handleLogRebase(event: LogRebase): void {}

export function handleTransfer(event: Transfer): void {
	let instance = User.load(event.transaction.from.toHex());

	if (instance == null) {
		instance = newUser(event.transaction.from.toHex(), event.transaction.from.toHex());
	}

	instance.balance = instance.balance.minus(event.params.value);
	instance.timeStamp = event.block.timestamp;
	instance.block = event.block.number;
	instance.save();
}

function newUser(id: string, address: string): User {
	let user = new User(id);
	user.address = address;
	user.balance = BigInt.fromI32(0);
	return user;
}
