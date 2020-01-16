module.exports.gpaCalculator = (model) => {
    const letterPointTable = {
        "Letters": [
            {
                "name": "AA",
                "point": 4
            },
            {
                "name": "BA",
                "point": 3.5
            },
            {
                "name": "BB",
                "point": 3
            },
            {
                "name": "CB",
                "point": 2.5
            },
            {
                "name": "CC",
                "point": 2
            },
            {
                "name": "DC",
                "point": 1.5
            },
            {
                "name": "DD",
                "point": 1
            },
            {
                "name": "FF",
                "point": 0
            }
        ]
    }
    console.log('gpaCalculator process is started.')
    model.forEach(model => {
        if (!Array.isArray(model.Lectures))
            model.Lectures = JSON.parse(model.Lectures);
        //calculate GPA for each model
        let totalLectureCredit = 0, totalPoint = 0
        let totalElementCount = model.Lectures.length
        let usedLectureCode = ["XXX 999E"]

        while (totalElementCount >= 1) {
            let lecture = model.Lectures[totalElementCount - 1];
            let point = 0
            let isUsed = false

            usedLectureCode.forEach(lectureCode => {
                if (lecture.LectureCode.substring(0, 7) == lectureCode.substring(0, 7)) {
                    console.log(lecture.LectureCode, 'is used')
                    isUsed = true
                    return;
                }
            })

            if (isUsed) {
                totalElementCount -= 1
                continue
            }

            usedLectureCode.push(lecture.LectureCode);

            letterPointTable.Letters.forEach(letter => {
                if (lecture.GRD == letter.name)
                    point = letter.point
            })

            totalLectureCredit += parseInt(lecture.CRD)
            totalPoint += parseInt(lecture.CRD) * point
            totalElementCount -= 1
        }
        model.GPA = totalPoint / totalLectureCredit;

        //calculate GPA for each period
        lecturePeriodList = []

        model.Lectures.forEach(lecture => {
            let isUsed = false
            lecturePeriodList.forEach(usedPeriod => {
                if (lecture.LecturePeriod == usedPeriod)
                    isUsed = true
            })

            if (!isUsed) {
                lecturePeriodList.push(lecture.LecturePeriod)
            }
        });

        lecturePeriodList.forEach(lectPeriod => {
            lectList = []
            model.Lectures.forEach(lecture => {
                if (lecture.LecturePeriod == lectPeriod) {
                    lectList.push([lecture.LectureCode, lecture.CRD, lecture.GRD]);
                }
            });
            let gpa = calculateGPA(lectPeriod, lectList,letterPointTable);

            model.Lectures.forEach(lecture => {
                if (lecture.LecturePeriod == lectPeriod) {
                    lecture.GPA = gpa;
                }
            });
        })

    })

    return model;
}

function calculateGPA(period, lectureList,letterPointTable) {
    let totalLectureCredit = 0, totalPoint = 0
    lectureList.forEach(lecture => {
        letterPointTable.Letters.forEach(letter => {
            if (lecture[2] == letter.name)
                point = letter.point
        })

        totalLectureCredit += parseInt(lecture[1]) //get lecture credit
        totalPoint += parseInt(lecture[1]) * point
    })
    console.log(period , totalPoint / totalLectureCredit);
    return totalPoint / totalLectureCredit;
}


// const { gpaCalculator } = require('./gpa-calculator')

// let model = gpaCalculator(JSON.parse(JSON.parse(JSON.stringify("[{\"BirthDate\":\"15/05/1995\",\"BirthPlace\":\"Bandırma\",\"Department\":\"Computer Engineering\",\"FatherName\":\"Süleyman\",\"IdentityNumber\":\"23532674932\",\"Lectures\":[{\"CRD\":\"1.0\",\"GRD\":\"AA\",\"LectureCode\":\"BLG 242E\",\"LecturePeriod\":\"2018-2019 Spring\",\"Title\":\"Logic Circuits Laboratory\"},{\"CRD\":\"3.0\",\"GRD\":\"BB\",\"LectureCode\":\"BLG 311\",\"LecturePeriod\":\"2018-2019 Fall\",\"Title\":\"Formal Languages and Automata\"},{\"LectureCode\":\"BLG 242\",\"Title\":\"Logic Circuits Laboratory\",\"CRD\":\"1.0\",\"GRD\":\"BB\",\"LecturePeriod\":\"2019-2020 Spring\"},{\"LectureCode\":\"BLG 311E\",\"Title\":\"Formal Languages and Automata\",\"CRD\":\"3.0\",\"GRD\":\"AA\",\"LecturePeriod\":\"2019-2020 Spring\"}],\"Name\":\"İsmet Faruk\",\"Period\":\"2018/2019 Spring\",\"RegistryDate\":\"01.01.2020\",\"RegistryType\":\"Transfer by Central R.S.\",\"Surname\":\"Çolak\",\"UniversityId\":\"150160518\",\"UniversityName\":\"Istanbul Technical University\",\"docType\":\"transcript\"},{\"IdentityNumber\":\"23532674932\",\"UniversityName\":\"Istanbul Technical University\",\"UniversityId\":\"150160518\",\"Department\":\"Computer Engineering\",\"Name\":\"İsmet Faruk\",\"Surname\":\"Çolak\",\"Period\":\"2018/2019 Spring\",\"BirthDate\":\"15/05/1995\",\"BirthPlace\":\"Bandırma\",\"FatherName\":\"Süleyman\",\"RegistryDate\":\"01.01.2020\",\"RegistryType\":\"Transfer by Central R.S.\",\"Lectures\":[{\"LectureCode\":\"BLG 242E\",\"Title\":\"Logic Circuits Laboratory\",\"CRD\":\"1.0\",\"GRD\":\"AA\",\"LecturePeriod\":\"2018-2019 Spring\"},{\"LectureCode\":\"BLG 311\",\"Title\":\"Formal Languages and Automata\",\"CRD\":\"3.0\",\"GRD\":\"BB\",\"LecturePeriod\":\"2018-2019 Fall\"}],\"docType\":\"transcript\"}]"))))
// console.log(JSON.stringify(model))
