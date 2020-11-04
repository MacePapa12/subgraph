import { BigInt } from '@graphprotocol/graph-ts';
import { Transfer } from '../generated/debase/debase';
import { User, UserCounter, TransferCounter, TotalSupply } from '../generated/schema';

export function handleTransfer(event: Transfer): void {
	let day = event.block.timestamp.div(BigInt.fromI32(60 * 60 * 24));

	let userFrom = User.load(event.params.from.toHex());
	if (userFrom == null) {
		userFrom = newUser(event.params.from.toHex(), event.params.from.toHex());
	}
	userFrom.balance = userFrom.balance.minus(event.params.value);
	userFrom.transactionCount = userFrom.transactionCount + 1;
	userFrom.blockNumber = event.block.number;
	userFrom.save();

	let userTo = User.load(event.params.to.toHex());
	if (userTo == null) {
		userTo = newUser(event.params.to.toHex(), event.params.to.toHex());

		// UserCounter
		let userCounter = UserCounter.load('singleton');
		if (userCounter == null) {
			userCounter = new UserCounter('singleton');
			userCounter.count = 1;
		} else {
			userCounter.count = userCounter.count + 1;
		}
		userCounter.save();
		userCounter.id = day.toString();
		userCounter.save();
	}
	userTo.balance = userTo.balance.plus(event.params.value);
	userTo.transactionCount = userTo.transactionCount + 1;
	userTo.blockNumber = event.block.number;
	userTo.save();

	// Transfer counter total and historical
	let transferCounter = TransferCounter.load('singleton');
	if (transferCounter == null) {
		transferCounter = new TransferCounter('singleton');
		transferCounter.count = 0;
		transferCounter.totalTransferred = BigInt.fromI32(0);
	}
	transferCounter.count = transferCounter.count + 1;
	transferCounter.totalTransferred = transferCounter.totalTransferred.plus(event.params.value);
	transferCounter.save();
	transferCounter.id = day.toString();
	transferCounter.save();
}

function newUser(id: string, address: string): User {
	let user = new User(id);
	user.address = address;
	user.balance = BigInt.fromI32(0);
	user.transactionCount = 0;
	user.blockNumber = BigInt.fromI32(0);
	return user;
}

// import { BigInt } from '@graphprotocol/graph-ts';
// import { Transfer, debase } from '../generated/debase/debase';
// import { User, UserCounter, TransferCounter } from '../generated/schema';

// export function handleTransfer(event: Transfer): void {
// 	let day = event.block.timestamp.div(BigInt.fromI32(60 * 60 * 24));
// 	let blockNumber = event.block.number;

// 	let userFrom = User.load(event.params.from.toHex() + blockNumber.toString());
// 	if (userFrom == null) {
// 		userFrom = newUser(event.params.from.toHex() + blockNumber.toString(), event.params.from.toHex());
// 	}
// 	userFrom.balance = userFrom.balance.minus(event.params.value);
// 	userFrom.transactionCount = userFrom.transactionCount + 1;
// 	userFrom.save();

// 	let userTo = User.load(event.params.to.toHex());
// 	if (userTo == null) {
// 		userTo = newUser(event.params.to.toHex(), event.params.to.toHex());

// 		// UserCounter
// 		let userCounter = UserCounter.load('singleton');
// 		if (userCounter == null) {
// 			userCounter = new UserCounter('singleton');
// 			userCounter.count = 1;
// 		} else {
// 			userCounter.count = userCounter.count + 1;
// 		}
// 		userCounter.save();
// 		userCounter.id = day.toString();
// 		userCounter.save();
// 	}
// 	userTo.balance = userTo.balance.plus(event.params.value);
// 	userTo.transactionCount = userTo.transactionCount + 1;
// 	userTo.save();

// 	// Transfer counter total and historical
// 	let transferCounter = TransferCounter.load('singleton');
// 	if (transferCounter == null) {
// 		transferCounter = new TransferCounter('singleton');
// 		transferCounter.count = 0;
// 		transferCounter.totalTransferred = BigInt.fromI32(0);
// 	}
// 	transferCounter.count = transferCounter.count + 1;
// 	transferCounter.totalTransferred = transferCounter.totalTransferred.plus(event.params.value);
// 	transferCounter.save();
// 	transferCounter.id = day.toString();
// 	transferCounter.save();
// }

// function newUser(id: string, address: string): User {
// 	let user = new User(id);
// 	user.address = address;
// 	user.balance = BigInt.fromI32(0);
// 	user.transactionCount = 0;
// 	user.blockNumber = BigInt.fromI32(0);
// 	return user;
// }
