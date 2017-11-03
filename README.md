# Real world data access using knex
## sequel of knex tutorial - last part

## Course content
- Project setup
- Querying data
- Modifying data

## 1 Project setup
This is mostly revision of the previou parts of the tutorial. We will first start by git init, npm init, installing npm packages to copying previous files and many more previous steps. 

1. `npm init`
2. `npm install --save knex bluebird prettyjson`
3. Copy knexfile.js and display.js from previous part of tutorial 
4. Create instance of knex that could be used throughout the application. Create a new file 'db.js' at root and then write the following code into it. 

	```
	//export knex instance so that it could be used throuhout the application
	const config = require("./knexfile");
	const knex = require("knex")(config.development);

	module.exports = knex;
	```
5. Now start creating applications entry point that is 'app.js'. Here we will just whether db is connected successfully by getting count of movies. Start by writing following code 
	
	```
	const db = require("./db");
	const display = require("./display");
			
	display.clear();

	db("movie").count().then(function(result) {
    	display.write(result, "pretty");
    }).catch(function(err) {
    	display.write(err);
    }).finally(function() {
    	db.destroy();
  	 });

	```
here we are getting our knex instance with 'db.js' file we created earlier and rest is code from our first module. 
6. Run the application by running `node app.js` from terminal, you will get count to 8.
7. Now create repository code that will deal with data access from the person table. Create a file 'person-repo.js' inside 'repo' folder that is in root of the project. The content of the file is following
	
	```
	const promise = require("bluebird");
	const db = require("../db");

	//should return bluebird promise

	module.exports = {};

	```  	
	This is just a skeleton code for returning 'bluebird' promise. 
8. Perform the same action above for a new file 'movie-repo.js' inside 'repo' folder. 

The files from the last two steps will create skeleton for our next module that is querying the data.

## 2 Querying Data
Lets assume our application ui requires all kind of ratings at once so we have to send all the ratings in a list so we require a function for that work named `listRatings()`, similarly we need some more queries like `listTags()` and `listPeople(search text)`. 

1. Lets start by writing down a function that returns all the tags in 'movie' 	database

	In the 'movie_repo.js' file, inside the exports field make a property method 	similar to the shown below.

	```
	module.exports = {
		listTags: function(){
		}
	}
	```

	Now we will start logic to get tags from inside the function

	We need 'tagname as text' to make it more generic and 'id'. As told in the 	instruction it should return a bluebird promise. The code to attain that is 	written below which is self explainatory

	```
	return db.select('name as text', 'id').from('tag').then();
	```
	similarly create for `listRatings()` function inside the same 'movie_repo.js' 	file. 

	Then to test whether the code is running fine or not go to app.js file and in 	that modify function to process query from `movie_repo.listTags()` and 	`moovie_repo.listRatings()`. The final code of 'movie_repo.js' and 'app.js' is 	given below

	**movie-repo.js**

	```
	const promise = require("bluebird");
	const db = require("../db");

	//should return bluebird promise

	module.exports = {
  	//listTags function
  	listTags: function() {
   	 return db
   	   .select("name as text", "id")
   	   .from("tag")
   	   .then();
  	},
  	listRatings: function() {
   	 return db
   	   .select("name as text", "id")
   	   .from("rating")
   	   .then();
  	}
	};

	```

	**app.js**

	```
	const db = require("./db");
	const display = require("./display");
	const mRepo = require("./repo/movie-repo");

	display.clear();

	mRepo
  	.listRatings()
  	.then(function(result) {
   	 display.write(result, "pretty");
  	})
  	.catch(function(err) {
   	 display.write(err);
  	})
  	.finally(function() {
   	 db.destroy();
  	});
	```

	change listRatings() to listTags() will give tags. 

	**commit**
 	
2. In this step we will create `listPerson(search text)` function inside the 'person-repo.js' file, We will create a function inside the exports statement with the code given below
	```
	listPersons: function(searchText){
		return db('person').where('name', 'like', '%'+searchText +'%')
		.select('name as text', 'id').orderBy('name').then();
	}
	```
	
You could call this code similar to earlier code with searchText as parameter. use 'ca' it will result in 5 records.

**commit**