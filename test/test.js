var assert = require('assert');
const { exec } = require('child_process');
var should = require('should');


describe('grep', function() {

	describe('Usage', function() {

		it('should return usage text when arguments is not present', function() {

			exec('node grep', (err, stdout, stderr) => {
				if (err) {
					// node couldn't execute the command
					return;
				}

				// the *entire* stdout and stderr (buffered)
				// console.log(`stdout: ${stdout}`);
				// console.log(`stderr: ${stderr}`);

				let output = stdout.replace('\n', '');
				assert.equal(output, "Usage: grep [-icR] [pattern] [file]");

			});

		});

		it('should return usage text when wrong number of arguments', function() {

			exec('node grep -a b c d', (err, stdout, stderr) => {
				if (err) {
					// node couldn't execute the command
					return;
				}

				// the *entire* stdout and stderr (buffered)
				// console.log(`stdout: ${stdout}`);
				// console.log(`stderr: ${stderr}`);

				let output = stdout.replace('\n', '');
				assert.equal(output, "Wrong number of arguments, Usage: grep [-icR] [pattern] [file]");

			});

		});

	});

	describe('Text search', function() {

		it('should return search results when pattern and file is present', function() {

			exec('node grep "printing" "filesToSearch/file1.txt"', (err, stdout, stderr) => {
				if (err) {
					return;
				}

				let output = stdout.replace('\n', '');
				assert.equal(output, "Lorem Ipsum is simply dummy text of the printing and typesetting industry.");

			});

		});

		it('should not return search results using case senisitive pattern when -i option is not there', function() {

			exec('node grep "Printing" "filesToSearch/file1.txt"', (err, stdout, stderr) => {
				if (err) {
					return;
				}

				let output = stdout.replace('\n', '');
				assert.equal(output, "");

			});

		});

		it('should return search results using case senisitive pattern when -i option is there', function() {

			exec('node grep -i "Printing" "filesToSearch/file1.txt"', (err, stdout, stderr) => {
				if (err) {
					return;
				}

				let output = stdout.replace('\n', '');
				assert.equal(output, "Lorem Ipsum is simply dummy text of the printing and typesetting industry.");

			});

		});

		it('should return search results recursively when -r option and folder name is there', function() {

			exec('node grep -r "dolor" "filesToSearch"', (err, stdout, stderr) => {
				if (err) {
					return;
				}

				let output = stdout.replace(/\n/g, '');

				let textToMatch1 = 'fldrFile1.txt: The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.';
				let textToMatch2 = 'subFldrFile1.txt: The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.';

				output.indexOf(textToMatch1).should.equal(19);
				output.indexOf(textToMatch2).should.equal(161);

			});

		});

		it('should not return search results when -r option is there but the folder name is wrong', function(){

			exec('node grep -r "dolor" "filesToSearch/file1.txt"', (err, stdout, stderr) => {
				let output = stdout.replace('\n', '');
				(output).should.be.exactly("Error: not able to find directory");
			});

		});

		it('should return search results recursively and ignores case for matching when -ri option is there', function() {

			exec('node grep -ri "Dolor" "filesToSearch"', (err, stdout, stderr) => {
				if (err) {
					return;
				}

				let output = stdout.replace(/\n/g, '');

				let textToMatch1 = 'fldrFile1.txt: The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.';
				let textToMatch2 = 'subFldrFile1.txt: The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.';

				output.indexOf(textToMatch1).should.equal(19);
				output.indexOf(textToMatch2).should.equal(161);

			});

		});

	});

	describe('Count of the lines that match a pattern', function() {

		it('should return count when -c option is there', function(){

			exec('node grep -c "Lorem Ipsum" "filesToSearch/file1.txt"', (err, stdout, stderr) => {
				let output = stdout.replace('\n', '');
				(output).should.be.exactly('4');
			});

		});

		it('should return count and ignores case when -ic option is there', function(){

			exec('node grep -ic "Lorem ipsum" "filesToSearch/file1.txt"', (err, stdout, stderr) => {
				let output = stdout.replace('\n', '');
				(output).should.be.exactly('4');
			});

		});

		it('should return count recursively when -cr option is there', function(){

			exec('node grep -cr "Lorem Ipsum" "filesToSearch"', (err, stdout, stderr) => {

				let arrRes = stdout.split("\n");
				let arrElem = [];

				arrRes.forEach(function(element) {
					elem = element.split(': ');
					arrElem.push(elem[1]);
				});

				(arrElem[0]).should.be.exactly('4');
				(arrElem[1]).should.be.exactly('2');
				(arrElem[2]).should.be.exactly('5');
				(arrElem[3]).should.be.exactly('5');
				(arrElem[4]).should.be.exactly('5');

			});

		});

		it('should return count recursively and ignores case when -icr option is there', function(){

			exec('node grep -icr "lorem ipsum" "filesToSearch"', (err, stdout, stderr) => {

				let arrRes = stdout.split("\n");
				let arrElem = [];

				arrRes.forEach(function(element) {
					elem = element.split(': ');
					arrElem.push(elem[1]);
				});

				(arrElem[0]).should.be.exactly('4');
				(arrElem[1]).should.be.exactly('2');
				(arrElem[2]).should.be.exactly('5');
				(arrElem[3]).should.be.exactly('5');
				(arrElem[4]).should.be.exactly('5');

			});

		});


	});


});	