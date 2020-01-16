const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

	async initLedger(ctx) {
		console.info('============= START : Initialize Ledger ===========');
		const TranscriptSample = {
			'IdentityNumber': '23532674932',
			'UniversityName': 'Istanbul Technical University',
			'UniversityId': '150160518',
			'Department': 'Computer Engineering',
			'Name': 'İsmet Faruk',
			'Surname': 'Çolak',
			'Period': '2018/2019 Spring',
			'BirthDate': '15/05/1995',
			'BirthPlace': 'Bandırma',
			'FatherName': 'Süleyman',
			'RegistryDate': '01.01.2020',
			'RegistryType': 'Transfer by Central R.S.',
			'Lectures': [
				{
					'LectureCode': 'BLG 242E',
					'Title': 'Logic Circuits Laboratory',
					'CRD': '1.0',
					'GRD': 'AA'
				},
				{
					'LectureCode': 'BLG 311',
					'Title': 'Formal Languages and Automata',
					'CRD': '3.0',
					'GRD': 'BB'
				}
			]
		}
		await ctx.stub.putState(TranscriptSample.IdentityNumber, Buffer.from(JSON.stringify(TranscriptSample)));
		console.info('Sample Transactipt is added to the ledger');
		//}
		//console.info('============= END : Initialize Ledger ===========');
	}

	async queryTranscript(ctx, identityNumber) {
		const transcriptAsBytes = await ctx.stub.getState(identityNumber); // get the transcript from chaincode state
		if (!transcriptAsBytes || transcriptAsBytes.length === 0) {
			throw new Error(`${carNumber} does not exist`);
		}
		console.log(transcriptAsBytes.toString());
		return transcriptAsBytes.toString();
	}

	async createTranscript(ctx, IdentityNumber, UniversityName, UniversityId, Department,
		Name, Surname, Period, BirthDate, BirthPlace, FatherName, RegistryDate, RegistryType, Lectures) {
		console.info('============= START : Create Transcript ===========');

		const transcript = {
			IdentityNumber,
			UniversityName,
			UniversityId,
			Department,
			Name,
			Surname,
			Period,
			BirthDate,
			BirthPlace,
			FatherName,
			RegistryDate,
			RegistryType,
			Lectures
		};

		await ctx.stub.putState(IdentityNumber, Buffer.from(JSON.stringify(transcript)));
		console.info('============= END : Create Transcript ===========');
	}

	async queryAllTranscripts(ctx) {
		const startKey = '11111111111';
		const endKey = '99999999999';
		const allResults = [];
		for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
			const strValue = Buffer.from(value).toString('utf8');
			let record;
			try {
				record = JSON.parse(strValue);
			} catch (err) {
				console.log(err);
				record = strValue;
			}
			allResults.push({ Key: key, Record: record });
		}
		console.info(allResults);
		return JSON.stringify(allResults);
	}
	async getAllResults(iterator, isHistory) {
		let allResults = [];
		while (true) {
			let res = await iterator.next();

			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));

				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					jsonRes.IsDelete = res.value.is_delete.toString();
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			if (res.done) {
				console.log('end of data');
				await iterator.close();
				console.info(allResults);
				return allResults;
			}
		}
	}

	async getHistoryForStudent(ctx, identityNumber) {

		console.info('- start getHistoryForStudent: %s\n', identityNumber);

		let resultsIterator = await ctx.stub.getHistoryForKey(identityNumber);
		let results = await getAllResults(resultsIterator, true);

		return Buffer.from(JSON.stringify(results));
	}

	async updateLectures(ctx, identityNumber, lectures) {
		console.info('============= START : updateLectures ===========');

		const transcriptModelAsBytes = await ctx.stub.getState(identityNumber); // get the car from chaincode state
		if (!transcriptModelAsBytes || transcriptModelAsBytes.length === 0) {
			throw new Error(`${identityNumber} does not exist`);
		}
		const transcript = JSON.parse(transcriptModelAsBytes.toString());
		for (let element of lectures) {
			transcript.Lectures.push(element)
		}
		await ctx.stub.putState(identityNumber, Buffer.from(JSON.stringify(transcript)));
		console.info('============= END : updateLectures ===========');
	}


}

module.exports = FabCar