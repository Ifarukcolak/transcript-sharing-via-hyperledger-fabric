const { Contract } = require('fabric-contract-api');

class Transactipt extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const TranscriptSample = {
            'IdentityNumber': '23532674932',
            'UniversityName': 'Istanbul Technical University',
            'UniversityId': '150160518',
            'Department': 'Computer Engineering',
            'Name': '\u0130smet Faruk',
            'Surname': 'Çolak',
            'Period': '2018/2019 Spring',
            'BirthDate': '15/05/1995',
            'BirthPlace': 'Band\u0131rma',
            'FatherName': 'Süleyman',
            'RegistryDate': '01.01.2020',
            'RegistryType': 'Transfer by Central R.S.',
            'Lectures': [
                {
                    'LectureCode': 'BLG 242E',
                    'Title': 'Logic Circuits Laboratory',
                    'CRD': '1.0',
                    'GRD': 'AA',
                    'LecturePeriod': '2018-2019 Spring'
                },
                {
                    'LectureCode': 'BLG 311',
                    'Title': 'Formal Languages and Automata',
                    'CRD': '3.0',
                    'GRD': 'BB',
                    'LecturePeriod': '2018-2019 Fall'
                }
            ]
        };
        TranscriptSample.docType = 'transcript';
        //const car ={'carName':'testCar'};
        //await ctx.stub.putState('CAR1',Buffer.from(JSON.stringify(car)));
        await ctx.stub.putState(TranscriptSample.IdentityNumber, Buffer.from(JSON.stringify(TranscriptSample)));
        console.info('Sample Transactipt is added to the ledger');
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryTranscript(ctx, identityNumber) {
        const transcriptAsBytes = await ctx.stub.getState(identityNumber); // get the transcript from chaincode state
        if (!transcriptAsBytes || transcriptAsBytes.length === 0) {
            throw new Error(`${identityNumber} does not exist`);
        }
        console.log(transcriptAsBytes.toString());
        return transcriptAsBytes.toString();
    }

    async createTranscript(ctx, IdentityNumber, UniversityName, UniversityId, Department,
        Name, Surname, Period, BirthDate, BirthPlace, FatherName, RegistryDate, RegistryType, Lectures) {
        console.info('============= START : Create Transcript ===========');

        const transcript = {
            IdentityNumber,
            docType: 'transcript',
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
    async getHistoryForStudent(ctx, identityNumber, isHistory) {
        console.info('getting history for key: ' + identityNumber);
        let iterator = await ctx.stub.getHistoryForKey(identityNumber);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
                const obj = JSON.parse(res.value.value.toString('utf8'));
                result.push(obj);
            }
            res = await iterator.next();
        }
        await iterator.close();
        return result;
    }
    async updateLectures(ctx, identityNumber, lectures) {
        console.info('============= START : updateLectures ===========');

        const transcriptModelAsBytes = await ctx.stub.getState(identityNumber); // get the transcript from chaincode state
        if (!transcriptModelAsBytes || transcriptModelAsBytes.length === 0) {
            throw new Error(`${identityNumber} does not exist`);
        }
        const transcript = JSON.parse(transcriptModelAsBytes.toString());
        if (!Object.prototype.toString.call(lectures) === '[object Array]')
            lectures = JSON.parse(lectures);

        if (!Object.prototype.toString.call(transcript.Lectures) === '[object Array]')
            transcript.Lectures = JSON.parse(transcript.Lectures);

        for (let element of lectures) {
            transcript.Lectures.push(element);
        }

        await ctx.stub.putState(identityNumber, Buffer.from(JSON.stringify(transcript)));
        console.info('============= END : updateLectures ===========');
    }
}

module.exports = Transactipt
