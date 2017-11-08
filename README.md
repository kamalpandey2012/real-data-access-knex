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
 	
2. In this step we will create `listPerson(search text)` function inside the 	'person-repo.js' file, We will create a function inside the exports statement 	with the code given below
		```
		listPersons: function(searchText){
			return db('person').where('name', 'like', '%'+searchText +'%')
			.select('name as text', 'id').orderBy('name').then();
		}
		```
	
	You could call this code similar to earlier code with searchText as parameter. 	use 'ca' it will result in 5 records.

	**commit**

	Now try to run above code in production environment. It will result an empty 	array because postgres is matching the query with lowercase keywords. To solve 	the problem there are various work arounds we will use knex raw query method 	with the following code
	```
	.whereRaw("LOWER(name) like '%' || LOWER(?)|| '%'", searchText)
	```

	change only the where query to whereRaw query. This will solve the problem with 	production database (Before running these steps make sure your have seeded your 	database

3. Now create a `getMovie()` function that will take movie_id as an argument and will return movie object of given id. 
	
	```
	function getMovie(movie_id) {
  		return db("movie as m")
   	 		.join("person as p", "p.id", "m.director_id")
   	 		.select("m.*", "p.name as director")
   	 		.where("m.id", movie_id)
   	 		.first()
   	 		.then();
	}
	```
	In this code we are asking knex to get 'movie' table with alias of 'm' and join the result with 'person' table with alias of 'p' which has person.id column matching the m.director_id column, where m.id is equal to movie_id provided, the query return an array and we know that this query will return only one field so we are converting array to object by getting only first result.
	
4. List the tags of a specific movie. we will create a function `listTagsFor(movie_id)` inside the movie-repo.js file. 
 
 ```
 function listTagsFor(movie_id) {
  return db("tag as t")
    .select("t.id", "t.name as text")
    .joinRaw(
      "JOIN tag_movie tm ON tm.tag_id = t.id AND tm.movie_id=?",
      movie_id
    )
    .then();
}
 ```
5. List all actors for a specific movie. 
 
 ```
 function listActorsFor(movie_id) {
  return db("person as p")
    .select(db.raw("p.id, p.firstname ||' '||p.lastname as text"))
    .joinRaw(
      "JOIN actor_movie am ON am.person_id = p.id AND am.movie_id=?",
      movie_id
    )
    .then();
 ``` 
 
 Now we have all required operations for a movie data we will combine them to get the full movie api

6. List all elements of movie
	
	```
	function getMovieFull(movie_id) {
  const pMovie = this.getMovie(movie_id),
    pTag = this.listTagsFor(movie_id),
    pActor = this.listActorsFor(movie_id);

  return promise.all([pMovie, pTag, pActor]).then(function(results) {
    	let movie = results[0];
    	movie.tags = results[1];
    	movie.actors = results[2];
    	return movie;
  });
}
```

here we have used promise.all method to get result all the three queries. 

7. List all movies according to query filter expression that will be like `{pgNum:1,pgSize: 10, sort:'releaseyr DESC'}`
	
	Below is the code to solve this problem
	
	```
	function listMovies(qf) {
  const result = {},
    sort = qf.sort,
    pg_size = Math.min(qf.pgSize, 10),
    offset = (qf.pgNum - 1) * pg_size;

  return db("movie as m")
    .select("m.id", "m.title", "m.releaseyr", "m.runtime", "m.lastplaydt",
      "r.name as rating"
    )
    .join("rating as r", "r.id", "m.rating_id")
    .limit(pg_size)
    .offset(offset)
    .then();
}
``` 
Here one thing is remaining as you can see the sort query is not escaped. To escape the sort query we have to create a `db-util.js` file

```
module.exports = {
  parseSortString: parseSortString
};

function parseSortString(sortString, defaultSort) {
  let s = sortString || defaultSort || "";
  const result = {
    column: "",
    direction: "asc"
  };
  s = s.split(" ");
  if (s.length < 1) {
    return null;
  }
  result.column = s[0];
  if (!result.column) {
    return null;
  }
  if (s.length === 1) {
    return result;
  }
  if (s[1].toLowerCase() == "desc") {
    result.direction = "desc";
  }

  return result;
}
```
Now change sort function of 'movie-repo.js' file 

```
function listMovies(qf) {
  const result = {},
    sort = util.parseSortString(qf.sort, "m.id"),
    pg_size = Math.min(qf.pgSize, 10),
    offset = (qf.pgNum - 1) * pg_size;
  return db("movie")
    .count("* as total")
    .then(function(rows) {
      result.total = rows[0].total;
    })
    .then(function() {
      return db("movie as m")
        .select(
          "m.id",
          "m.title",
          "m.releaseyr",
          "m.runtime",
          "m.lastplaydt",
          "r.name as rating"
        )
        .join("rating as r", "r.id", "m.rating_id")
        .limit(pg_size)
        .offset(offset)
        .then();
    })
    .then(function(rows) {
      result.pgSize = pg_size;
      result.items = rows;
      return result;
    });
}
```
in app.js file

```

const qf = {
  pgSize: 2,
  pgNum: 1,
  sort: "title"
};

...

mRepo.listMovies(qf).then()....
```

**commit**

## 3 Modifying Data
Now we know how to retrive data lets take our focus on modifying data. Now we will focus our attention on insertion, updation and deletion of data, out of these three steps deletion is most simple one. Lets write code for deleting data.

### Deleting 
 We will ask knex to work with the movie table and look at record where 'id' matches the 'movieId' we are passing then we will call the 'del()' function and execute it using the 'then()' promise interface. The code is given below

```
delete: function(){
	return db('movie').where('id', movieId).del().then();
}
``` 
thats a simple function that will do the work of deleting from 'movie' table it will also delete from associated 'actor' and 'tag' table. Let's check whether it works.

modify 'app.js' file code. 

```
...

mRepo
  .deleteMovie(8).then(func...)...
  
```
This will return '1' if successfull otherwise 0

**commit**

### Adding new person record
Let's add 'person' in record with 'firstname', 'lastname', and 'name' (display name) as fields. Lets add the person record with this data 

```
var edward = {firstname: 'Edward', lastname: 'Zwick', name: 'Edward Zwick'};

```

To do this add this create function 'add' in your 'person-repo.js' file. Our goal is to add new person record to the person table with return of id of the person added. We will ask knex to 'insert' person and return 'id'. 

```
function add(person){
	return db('person').insert(person, 'id').then();
}
```
In my case it return 'id' 42.

### Adding a Movie to database
In case of adding or updating same type of data will be sent to the server. Let's assume we are getting data in format given below

```
const movie = {
id: 0, //new movie
rating_id: 4, //R
director_id: 42, // Edward Zwick
actors: [16], //ken watanabe
tags: [2, 7], //Action , Drama
title: 'The last samurai',
releaseyr: 2003,
score: 10,
runtime: 154,
lastplaydt: '2015-10-20',
overview: 'An American security advisor embrases the Samurai culture, he was hired to destroy the Samurai lands'
};
```

Now add function 'add' to the 'movie-repo.js'. 

```
function add(m){ ...};
```

We will first get the 'actors' and 'tags' array from the movie object 

```
let actors = m.actors;
let tags = m.tags;
```
Then we have to remove the properties that we don't require in the original movie record 

```
delete m.actors;
delete m.tags;

delete m.id; // as we don't want to store movie record with id '0'
```

We will use knex transaction as various linking operations have to be performed as a single unit. 

```
return db.transactions(function(trx){
 ...
})
};
```

We will ask 'trx' transction to insert 'm' into the 'movie' table returning the 'ids' (the id's of movies inserted) field

```
return trx.insert(m, 'id').into('movie).then(function(ids){
 ...

});
```

As it is visible that the insert operation is returning the array of 'ids' of the newly created 'movie' record. (In my case the number of record in table is 6 so it will return 7)

Now it's time to add actors record into the linked table 'actor_novie' but it is required to convert this data into a specific format. For example if we pass 'actor_id' (first parameter), [16] (second parameter), 'movie_id' (third parameter) and 7 (fourth parameter, returned by insert operation) to the function it should return 

```
[
{ actor_id: 16, movie_id: 9 }
] 

```

this is required format for inserting into the many to many relation table using knex. 

Lets create this function into the 'util.js' file.

```
function idToMMObjArr(arrFieldName, idArray, otherFieldName, otherId){
return idArray.map(function(o){
     let x = {};
     x[arrFieldName] = o;
     x[otherFieldName] = otherId
     return x;
    });
}
```
Here what we doing in the 'idToMMObjArr' (id to many to many object array) function, We are using 'array.map' function which will iterate over each value of array and create a corresponding 'x' object which uses brackets operator for creating dynamic keys from the arguments of the function. 

Now use this function into the callback function of insert method of knex transaction 

```
let actors = util.idToMMObjArr('person_id', actors, 'movie_id': ids[0])
```

we will do same thing for array of 'tags'. For example [2,7] will be converted to 

```
[
	{tag_id: 2, movie_id: 9},
	{tag_id: 7, movie_id: 9}
]
```

Now use it in same 'insert' method

```
let tags = util.idToMMObjArr('tag_id', tags, 'movie_id', ids[0]);
```

Now back to main code of our add function. after performing the above operation on the array we will insert the object we created with the object array into the 'actor-movie' table by 

```
return trx.insert(actors).into('actor_movie');
```

When the above operation completes we will add 'tags' to the 'tag_movie' table by `return trx.insert('tags).into('tag_movie')` then finally we are returning the 'id' of the movie inserted. Lets test it works by using the usual steps. 

The complete code of the function is given below

```
function add(m) {
  let tags = m.tags;
  let actors = m.actors;

  delete m.tags;
  delete m.actors;
  delete m.id;

  return db.transaction(function(trx) {
    return trx
      .insert(m, "id")
      .into("movie")
      .then(function(ids) {
        m.id = ids[0];
        actors = util.idToMMObjArr("person_id", actors, "movie_id", movieId);
        tags = util.idToMMObjArr("tag_id", tags, "movie_id", movieId);
        return trx.insert(actors).into("actor_movie");
      })
      .then(function() {
        return trx.insert(tags).into("tag_movie");
      })
      .then(function() {
        return m.id;
      });
  });
}
```
### Updating the movie record
The final operation is of updating the movie. The object which we will use to update the movie will be similar to the one we have used in adding the movie. Lets make some changes to the previous object so that we can use it to update

We will add 'Edward Zwich' as one more actor to the 'movie', change 'tags' from 'action' and 'drama' to 'martial arts' and 'drama' and finally change the title to 'The Last Samurai !!!'. The final object will be 

```
const movie = {
id: 0, 
rating_id: 4, 
director_id: 42, 
actors: [16, 42], //change 
tags: [12, 7], //Martial Arts , Drama
title: 'The last samurai !!!', //change
releaseyr: 2003,
score: 10,
runtime: 154,
lastplaydt: '2015-10-20',
overview: 'An American security advisor embrases the Samurai culture, he was hired to destroy the Samurai lands'
};
```

Updating the movie is very simple but updating it's relation with actors and tags will require some work. We'll need to compare the actor and tag IDs currently associated with 'movie' with the 'movie object' we are getting as input, if the ids are currently present we need to update them and delete those which are not present.

We will add two functions one is to get 'tags' associated with the movie other one is to get the actors associated with that movie. 

```
function getTagIDsFor(movieID){
	return db('tag_movie').pluck('tag_id').where('movie_id', movieID).then();
}

function getActorIDsFor(movieID){
	return db('actor_movie').pluck('person_id').where('movie_id', movieID).then();
}
```

**Pluck** function pluks the specific column from each row in the results set and resolves to an array of plucked values. The 'getActorIDsFor' function does the same thing with actor table and returns an array of person. So these functions will help us to get current person and tag IDs associated with a movie.

Now we will create a new utility function 'getManyToManyDelta' which compares the new IDs with the existing IDs and gives back the object containing the information of what to add and what to remove. 

Its first parameter ('newIDs') will be array of new IDs,such as the tags array on the input array. 

The second argument is for an array of current IDs which we get from calling 'getTagIDsFor(movieID)'.

The third parameter is 'variableFieldName' is the name of the property that corresponds to each element in the array of IDs, in this case it would be 'tag_id'.

The fourth parameter is the constFieldName is the name of the property on the many-to-many that is constant for this relation, in this case it will be 'movie_id'.
 
and finally 'constantID' that is the value of constant property. Its quite difficult to find any good names for these kind of fields but if you get one please share with me also. Now lets write code of this function

```
function getManyToManyDelta(newIDs, currentIDs, variableFieldName, constFieldName, constantID ){
	let i, ii, add =[], delete=[], x;
	for(i=0; ii= newIDs.length; i<ii; i++){
		if(currentIDs.indexOf(newIDs[i]) ==-1){
			x = {};
			x[variableFieldName] = newIDs[i];
			x[constFieldName] = newIDs[i];
			add.push(x);
		}
	}
	
	for(i=0; ii=currentIDs.length; i<ii; i++){
		if(newIDs.indexOf(currentIDs[i]) == -1){
			del.push(currentIDs[i];
		}
	}
	return {del:del, add:add}
	
}
```
This will return the 




  
   

	
