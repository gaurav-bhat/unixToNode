const fs = require('fs'),
	  readline = require('readline');

var recursive = require("recursive-readdir");

// To install packages run: npm install

// Commands available:
// node grep : gives usage options
// node grep "Lorem Ipsum" "filesToSearch/file1.txt" : Search in a file
// node grep -i "lorem Ipsum" "filesToSearch/file1.txt" : Ignores, case for matching
// node grep -c "Lorem Ipsum" "filesToSearch/file1.txt" : This prints only a count of the lines that match a pattern
// node grep -ic "lorem Ipsum" "filesToSearch/file1.txt"
// node grep -r "Lorem Ipsum" "filesToSearch" : Recursive search
// node grep -ir "lorem Ipsum" filesToSearch
// node grep -irc "lorem Ipsum" filesToSearch

// Run tests with: npm test

function grepMain() {

	let argLen = process.argv.length;

	// The first element will be process.execPath
	// The second element will be the path to the JavaScript file being executed
	// The remaining elements will be any additional command line arguments
	if(argLen <= 2) {
		console.log("Usage: grep [-icR] [pattern] [file]");
		return;
	} else if (argLen > 5) {
		console.log("Wrong number of arguments, Usage: grep [-icR] [pattern] [file]");
		return;
	}

	var argPromise = new Promise(function(resolve, reject) {
		
		let options = '';

		process.argv.forEach((val, index) => {

		  //console.log(`${index}: ${val}`);

		  if(argLen === 4) {

		  	if(index === 2)
		  		pattern = val;
		  	else
		  		fileLoc = val;

		  } else if (argLen === 5) {

		  	if(index === 2)
		  		options = val;
		  	else if(index === 3)
		  		pattern = val;
		  	else
		  		fileLoc = val;

		  }

		  if (index === argLen-1) {
		  	argObj = {
				'options': options,
				'pattern': pattern,
				'fileLoc': fileLoc
		  	}

		  	resolve(argObj);
		  }

		});

	});

	argPromise.then(function(argObj) {

		// Print promise object
		//console.log(argObj);

		let options = argObj.options;
		let pattern = argObj.pattern;
		let fileLoc = argObj.fileLoc;

		if (options.indexOf('r') > 0) {

			recursive(fileLoc, function (err, files) {

				if(err){
					console.log('Error: not able to find directory');
					process.exit(1);
				};

				// `files` is an array of file paths
				//console.log(files);

				(async function loop() {
					for (let i = 0; i < files.length; i++) {
						await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
						print(files[i]);
					}
				})();

			});

		} else {
			print(fileLoc);
		}

		function print(fileLoc) {

			const fileStream = fs.createReadStream(fileLoc);

			fileStream.on('error', function(err) {
				if(err) {
					console.log('Invalid argument: ' + err);
					process.exit(1);
				}
			});

			const rd = readline.createInterface({
			    input: fileStream,
			    output: process.stdout,
			    terminal: false
			});

			let countOfMatchedLines = 0;

			rd.on('line', function(line) {

				if(options != '') {

					let flgOpt = '';

					if (options[0] != "-") {
						console.log('Invalid options!');
						process.exit(1);
					}

					if(options.indexOf('i') > 0) {

						flgOpt = 'i';

						let lowerLine = line.toLowerCase();
						let lowerPattern = pattern.toLowerCase();

						if(lowerLine.includes(lowerPattern)){

							if(options.indexOf('r') > 0) {

								if(options.indexOf('c') <= 0) {
									console.log(fileLoc + ': ' + line + '\n');
								}
								
							} else if(options.indexOf('c') <= 0) {

								console.log(line);

							} 

						}		
					}

					if(options.indexOf('c') > 0) {

						if(flgOpt=='i') {
							line = line.toLowerCase();
							pattern = pattern.toLowerCase();
						}

						if(line.includes(pattern)){
							countOfMatchedLines++;
						}				
					}

					if(options.indexOf('r') > 0 && flgOpt != 'i' && options.indexOf('c') <= 0) {

						if(line.includes(pattern)){
							console.log(fileLoc + ': ' + line + '\n');
						}

					}

				} else {

					if(line.includes(pattern)){
						console.log(line);
					}	

				}

			});

			rd.on('close', function(line) {

				if(countOfMatchedLines>0) {
					
					if(options.indexOf('r') > 0) {
						console.log(fileLoc +': ' + countOfMatchedLines);
					} else {
						console.log(countOfMatchedLines);
					}

				}

			});

		}
		
	});

}

grepMain();