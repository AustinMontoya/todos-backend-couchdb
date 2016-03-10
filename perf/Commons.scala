package todoback

import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

object Commons {

	val targetUrl = System.getProperty("targeturl")
	val headers_2 = Map("Origin" -> "http://todobackend.com")

    val httpProtocol = http
		.baseURL("http://"+targetUrl+":3000")
		.acceptHeader("text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8") // Here are the common headers
		.doNotTrackHeader("1")
		.acceptLanguageHeader("en-US,en;q=0.5")
		.acceptEncodingHeader("gzip, deflate")
		.userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0")
		.inferHtmlResources()

	def deleteCleanup = exec(http("cleanup_delete")
		.delete("/")
		.headers(headers_2))

}