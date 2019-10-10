const fs = require('fs');

var users = JSON.parse(fs.readFileSync('./data/user.json', 'utf8'));
var projects = JSON.parse(fs.readFileSync('./data/project.json', 'utf8'));

//DataBase Settings
const pgp = require('pg-promise')({
	// Initialization Options
});

// Preparing the connection details:
const cn = 'postgres://postgres:root@localhost:5432/cs2102_project';
let db = pgp(cn);



function getRandomInt(base, high) {
	return Math.floor(Math.random() * high) + base;
}

function getRandom() {
	return Math.random() > 0.5 ? 1 : 0;
}
function getRandomDate(start, end) {
	return new Date(start.getTime() + getRandomInt(1,end) * (24 * 60 * 60 * 1000));
}
/*
function getProjectDate() {
	var createDate = randomDate(new Date(2001, 1, 1), new Date(2018, 10, 8));
	var startDate = randomDate(createDate, new Date(2019, 10, 8));
	var endDate = randomDate(startDate, new Date(2020, 10, 8));
	var arr = new Array();
	arr.push(startDate);
	arr.push(endDate);
	arr.push(createDate);
	return arr;
} */
function getStartDate(createDate) {
	var date = getRandomDate(createDate, 6);
	date.setMinutes(0);
	date.setSeconds(0);
	return date;
}
function getCreateDate() {
	var date = new Date(2018,getRandomInt(1, 12),getRandomInt(1,28));
	date.setMinutes(0);
	date.setSeconds(0);
	return date;
}
function getEndDate(date, numDays) {
	return new Date(date.getTime() + (numDays * (24 * 60 * 60 * 1000)));
}
function getPledgingDate(date,numDays) {
	return new Date(date.getTime() + (numDays * (24 * 60 * 60 * 1000)));
}
function getVoteDate(date, numDays) {
	return new Date(date.getTime() + (numDays * (24 * 60 * 60 * 1000)));
}

function getReportDate(date, numDays) {
	return new Date(date.getTime() + (numDays * (24 * 60 * 60 * 1000)));
}
function getHandleDate(date, numDays) {
	return new Date(date.getTime() + (numDays * (24 * 60 * 60 * 1000)));
}

function getCommentDate(date, numDays) {
	return new Date(date.getTime() + (numDays * (24 * 60 * 60 * 1000)));
}
async function insertUser(role, name, password) {
	await db.any(
		`INSERT INTO USER_ACC (userRole, userName, hashedPassword) VALUES(
			'${role}',
			'${name}',
			'${password}'
		);`
	)
}

async function insertProject(i, name, description, amount, owner, projectDate) {
	var pic = (i + 1) <= 20 ? (i + 1) + '.jpg' : null;
	if(pic != null) {
		await db.any(
			`INSERT INTO PROJECT (projectName, projectDescription, targetAmount, imageFileName, projectOwner, startDate, endDate, isBanned, createTime) VALUES(
				'${name}',
				'${description}',
				'${amount}',
				'${pic}',
				'${owner}',
				'${projectDate[0].getTime()}',
				'${projectDate[1].getTime()}',
				'${false}',
				'${projectDate[2].getTime()}'
			);`
		)
	} else {
		await db.any(
			`INSERT INTO PROJECT (projectName, projectDescription, targetAmount, projectOwner, startDate, endDate, isBanned, createTime) VALUES(
				'${name}',
				'${description}',
				'${amount}',
				'${owner}',
				'${projectDate[0].getTime()}',
				'${projectDate[1].getTime()}',
				'${false}',
				'${projectDate[2].getTime()}'
			);`
		);
	}

}
async function updateProject() {
	await db.any(
		`UPDATE PROJECT
		SET isBanned = true
		WHERE id = 1 OR id = 2;`);
}
async function insertPledging(amount, pledgeTime, projectId, userName, isRefunded) {
	await db.any(
		`INSERT INTO PLEDGING_PLEDGES VALUES(
			'${amount}',
			'${pledgeTime}',
			'${projectId}',
			'${userName}',
			'${isRefunded}'
		);`
	);
}

async function cleanData() {
	console.log("Cleaning Old Data...")
	let clean_script = fs.readFileSync('../db/cleanup.sql', 'utf8');
	console.log("Adding Tables and Triggers")
	let add_script = fs.readFileSync('../db/init.sql', 'utf8');

	await db.any(clean_script);
	await db.any(add_script);
}

async function addData() {

	//Reset Database
	await cleanData();

	var len = projects.length;
	var targetAmounts = new Array(len);
	for (let i = 0; i < len; i++) {
		targetAmounts[i] = getRandomInt(10000, 100000);
	}

	var projectDate = new Array(len);
	for (let i = 0; i < len; i++) {
		projectDate[i] = new Array(3);
		projectDate[i][2] = getCreateDate();
		projectDate[i][0] = getStartDate(projectDate[i][2]);
		projectDate[i][1] = getEndDate(projectDate[i][0], getRandomInt(1,90));
	}

	for (let i = 0; i < users.length; i++) {
		let currentUser = users[i];
		await insertUser(currentUser.role, currentUser.name, currentUser.password);
	}

	console.log("Added Users");

	for(let i = 0; i < 6; i++) {
		await insertProject(i, projects[i].name, projects[i].description, targetAmounts[i], users[i % 2].name, projectDate[i]);
	}
	for (let i = 6; i < len; i++) {
		await insertProject(i, projects[i].name, projects[i].description, targetAmounts[i], users[getRandomInt(2, users.length - 2)].name, projectDate[i]);
	}

	console.log("Added Projects");

	var projectTable = await db.any('SELECT * FROM Project;');
	var nextPledingDate;
	var currentDate = new Date();
	var startDate;
	var endDate;
	for (let i = 0; i < len; i++) {
		startDate = projectDate[i][0];
		endDate = projectDate[i][1];
		if(startDate > currentDate) {
			continue;
		}
		var amount = 0;
		var limit = Math.random() > 0.5 ? 2 : 1;
		var pledgingDate = startDate;
		for(let j = 0; j < limit; j++) {
			nextPledingDate = getPledgingDate(pledgingDate, getRandomInt(1,10));
			pledgingDate = nextPledingDate;
			if(pledgingDate > endDate) {
				break;
			}
			var isfundable = getRandom() == 0 ? false : true;
			var pledgeAmount = 0;
			for(let k = 0; k < 10; k++) {
				pledgeAmount = getRandomInt(0, 100000);
				if((amount + pledgeAmount) <= targetAmounts[i]) {
					amount += pledgeAmount;
					await insertPledging(
						pledgeAmount,
						pledgingDate.getTime(),
						projectTable[i].id,
						users[i % users.length].name,
						isfundable
					)
					break;
				}

			}
		}
		if(i % 3 == 0 && targetAmounts[i] > amount) {
			nextPledingDate = getPledgingDate(pledgingDate, getRandomInt(1,10));
			if (nextPledingDate < endDate) {
				var isfundable = getRandom() == 0 ? false : true;
				await insertPledging(
					targetAmounts[i] - amount,
					nextPledingDate.getTime(),
					projectTable[i].id,
					users[i % users.length].name,
					isfundable
				)
			}
		}
	}

	console.log("Added Pledges");
    
	for (let i = 0; i < len; i++) {
		var hasreport = getRandom() == 0 ? false : true;
		if(hasreport) {
			var reportDate = getReportDate(projectDate[i][0], getRandomInt(1,30));
			var handlerDate = getHandleDate(reportDate, getRandomInt(1,30));
			var isHandled = getRandom() == 0 ? false : true;
			if(isHandled) {
				await db.any(`INSERT INTO project_report VALUES(
					'${users[i % users.length].name}',
					'${projectTable[i].id}',
					'project report description',
					'${users[getRandomInt(1, 2)].name}',
					'this is description from the handler',
					'${reportDate.getTime()}',
					'${handlerDate.getTime()}');`);
			} else {
				await db.any(`INSERT INTO project_report (userName, projectId, description, reportTime)
					VALUES(
					'${users[i % users.length].name}',
					'${projectTable[i].id}',
					'project report description',
					'${reportDate.getTime()}');`);
			}
		} 
	}

	console.log("Added Project Reports");


	var tags = ["Earth", "Environment", "Social", "Health", "Beauty",
		"Hiking", "Gaming", "Nature", "Gardening", "Equality",
		"Economic", "Friendship", "Space", "Walking", "Running",
		"Water", "Sky", "Clouds", "Shopping", "Jogging"]

	for (let i = 0; i < len; i++) {
		await db.any(`INSERT INTO tagged_to_tag VALUES(
			'${tags[i % tags.length]}',
			'${projectTable[i].id}');`);
	}

	console.log("Added Project Tags");

	var comments = [
	"Whilst this may theoretically answer the question, it would be preferable to include the essential parts of the answer here, and provide the link for reference.",
	"nice project",
	"This is really a comment, not an answer. With a bit more rep, you will be able to post comments. For the moment I have added the comment for you, and I am flagging this post for deletion.",
	"I will follow up for this project",
	"Please use the Post answer button only for actual answers. You should modify your original question to add additional information.",
	"I will vote for this project",
	"cool project",
	"I love this project",
	"I think this project need help!",
	"I would like to denote 100 dollar for this project"]
	for(let i = 0; i <10; i++) {
		var time = getCommentDate(projectDate[i][0], getRandomInt(1,25));
		await db.any(`INSERT INTO PROJECT_COMMENT VALUES(
			'${users[getRandomInt(2, users.length - 2)].name}',
			'${projectTable[i].id}',
			'${time.getTime()}',
			'${comments[i % comments.length]}');`);
	}
	updateProject();
	console.log("Added Project Comment");
}

addData();