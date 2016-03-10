package todoback

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._
import todoback.Commons._

class ToDoTests extends Simulation {

	
    object PreReq {
    	
    	val preReqPost = exec(deleteCleanup)
			.exec(http("the api root responds to a POST with the todo which was posted to it")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"a todo"}""")).asJSON
			.check(jsonPath("$..title").is("a todo")))


		val preReqDeleteRespond = exec(deleteCleanup)
			.exec(http("create_todo")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"a todo"}""")).asJSON
			.check(jsonPath("$..title").is("a todo")))
			.exec(http("the api root responds successfully to a DELETE")
			.delete("/")
			.headers(headers_2)
			.check(status.is(200),substring("title").count.is(0)))


		val preReqDeleteJson = exec(deleteCleanup)
			.exec(http("create_todo")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"a todo"}""")).asJSON
			.check(jsonPath("$..title").is("a todo")))
			.exec(http("after a DELETE the api root responds to a GET with a JSON representation of an empty array")
			.delete("/")
			.headers(headers_2)
			.check(status.is(200),substring("title").count.is(0)))		
    }

    object StoringNewTodos{
    	
    	val postRootUrl = exec(deleteCleanup)
			.exec(http("adds a new todo to the list of todos at the root url")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"walk the dog"}""")).asJSON
			.check(jsonPath("$..title").is("walk the dog")))

    	val todoNotCompleted = exec(deleteCleanup)
			.exec(http("sets up a new todo as initially not completed")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"blah"}""")).asJSON
			.check(jsonPath("$..completed").is("false")))

    	val todoHasNewUrl = exec(deleteCleanup)
			.exec(http("sets up a new todo as initially not completed")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"blah"}""")).asJSON
			.check(jsonPath("$..url").ofType[String]))			
    }

    object WorkingExistingTodo{
    	
    	val navListTodo = exec(deleteCleanup)
    		.exec(http("Post delete get")
			.get("/")
			.headers(headers_2))
    		.pause(2 seconds)
			.exec(http("create_todo")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""[{"title":"todo the first"}]""")).asJSON
			.check(jsonPath("$..completed").is("false")))
			.pause(2 seconds)
			.exec(http("create_todo")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"todo the second"}""")).asJSON
			.check(jsonPath("$..completed").is("false")))
			.exec(http("get_url")
			.get("/")
			.headers(headers_2)
			.check(jsonPath("$[0]..url").saveAs("todoUrl")))
			.pause(629 milliseconds)
			.exec(http("can navigate from a list of todos to an individual todo via urls")
			.get("${todoUrl}")
			.headers(headers_2)
			.check(status.is(200),jsonPath("$..url").is("${todoUrl}")))
 		
 		val patchTitle = exec(deleteCleanup)
			.exec(http("create_todo")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"initial title"}""")).asJSON
			.check(jsonPath("$..completed").is("false")))
			.exec(http("get_url")
			.get("/")
			.headers(headers_2)
			.check(jsonPath("$[0]..url").saveAs("patchUrl")))
			.exec(http("can change the todo's title by PATCHing to the todo's url")
			.patch("${patchUrl}")
			.headers(headers_2)
			.body(StringBody("""{"title":"bathe the cat"}""")).asJSON
			.check(status.is(200),jsonPath("$..title").is("bathe the cat")))

 		val patchCompletedness = exec(deleteCleanup)
			.exec(http("create_todo")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"initial title"}""")).asJSON
			.check(jsonPath("$..completed").is("false")))
			.exec(http("get_url")
			.get("/")
			.headers(headers_2)
			.check(jsonPath("$[0]..url").saveAs("completednessUrl")))
			.exec(http("can change the todo's completedness by PATCHing to the todo's url")
			.patch("${completednessUrl}")
			.headers(headers_2)
			.body(StringBody("""{"completed":"true"}""")).asJSON
			.check(status.is(200),jsonPath("$..completed").is("true")))

 		val patchPersistence = exec(deleteCleanup)
			.exec(http("create_todo")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"initial title"}""")).asJSON
			.check(jsonPath("$..completed").is("false")))
			.exec(http("get_url")
			.get("/")
			.headers(headers_2)
			.check(jsonPath("$[0]..url").saveAs("persistedUrl")))
			.exec(http("Update Todo")
			.patch("${persistedUrl}")
			.headers(headers_2)
			.body(StringBody("""{"completed":"true", "title":"bathe the cat"}""")).asJSON
			.check(status.is(200),jsonPath("$..completed").is("true"),jsonPath("$..title").is("bathe the cat")))
			.exec(http("changes to a todo are persisted and show up when re-fetching the todo")
			.get("${persistedUrl}")
			.headers(headers_2)
			.check(status.is(200),jsonPath("$..completed").is("true"),jsonPath("$..title").is("bathe the cat")))			

		val patchDelete = exec(deleteCleanup)
			.exec(http("create_todo")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"title":"initial title"}""")).asJSON
			.check(jsonPath("$..completed").is("false")))
			.exec(http("get_url")
			.get("/")
			.headers(headers_2)
			.check(jsonPath("$[0]..url").saveAs("deleteUrl")))
			.exec(http("can delete a todo making a DELETE request to the todo's url")
			.delete("${deleteUrl}")
			.headers(headers_2)
			.check(status.is(200),substring("title").count.is(0)))			
    }

    object TrackingToDo{

 		val todoOrder = exec(deleteCleanup)
			.exec(http("can create a todo with an order field")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"order":523}""")).asJSON
			.check(status.is(200),jsonPath("$..order").is("523")))

 		val changeOrder = exec(deleteCleanup)
			.exec(http("create_todo")
			.post("/")
			.headers(headers_2)
			.body(StringBody("""{"order":10}""")).asJSON
			.check(jsonPath("$..order").is("10")))
			.exec(http("get_url")
			.get("/")
			.headers(headers_2)
			.check(jsonPath("$[0]..url").saveAs("changeOrderUrl")))
			.exec(http("can PATCH a todo to change its order")
			.patch("${changeOrderUrl}")
			.headers(headers_2)
			.body(StringBody("""{"order":95}""")).asJSON
			.check(status.is(200),jsonPath("$..order").is("95")))
			.exec(http("remembers changes to a todo's order")
			.get("${changeOrderUrl}")
			.headers(headers_2)
			.check(status.is(200),jsonPath("$..order").is("95")))			
		
    }


    val preReqTests = scenario("preReqTests").exec(PreReq.preReqPost, PreReq.preReqDeleteRespond, PreReq.preReqDeleteJson)
    val storeTodoTests = scenario("storeTodoTests").exec(StoringNewTodos.postRootUrl, StoringNewTodos.todoNotCompleted, StoringNewTodos.todoHasNewUrl)
    val workTodoTests = scenario("workTodoTests").exec(WorkingExistingTodo.navListTodo,WorkingExistingTodo.patchTitle, WorkingExistingTodo.patchCompletedness, WorkingExistingTodo.patchPersistence,WorkingExistingTodo.patchDelete)
    val trackTodoTests = scenario("trackTodoTests").exec(TrackingToDo.todoOrder ,TrackingToDo.changeOrder)

	setUp(
		preReqTests.inject(nothingFor(6 seconds),atOnceUsers(1)),
		storeTodoTests.inject(nothingFor(8 seconds), atOnceUsers(1)),
		workTodoTests.inject(atOnceUsers(1)),
		trackTodoTests.inject(nothingFor(3 seconds),atOnceUsers(1))
		).protocols(httpProtocol)
}