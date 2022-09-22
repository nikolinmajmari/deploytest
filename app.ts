// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 80 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually
  // without awaiting the function
  serveHttp(conn);
}
async function serveHttp(conn: Deno.Conn) {
  // This "upgrades" a network connection into an HTTP connection.
  const httpConn = Deno.serveHttp(conn);
  // Each request sent over the HTTP connection will be yielded as an async
  // iterator from the HTTP connection.
  for await (const requestEvent of httpConn) {
    // The native HTTP server uses the web standard `Request` and `Response`
    // objects.
    const path = new URL(requestEvent.request.url);
    var resource = (path.pathname=="/")?"/index.html":path.pathname;
    // try{
       
        var contentType;
        if(resource.includes(".html")){
            contentType = "text/html";
        }else if(resource.includes(".css")){
            contentType = "text/css";
        }else if(resource.includes(".js")){
            contentType = "application/javascript";
        }else {
            contentType = "image/jpeg";
        }
        resource = Deno.cwd()+"/public"+resource;
        console.log(resource);
        var fileContent = await Deno.readFile(resource);
        requestEvent.respondWith(
          new Response(fileContent, {
            status: 200,
            headers:{
                "Content-Type":contentType
            }
          }),
        );
    // }catch(e){
    //     throw e;
    //     requestEvent.respondWith(
    //         new Response(
    //             "Not Found",
    //             {
    //                 status:404
    //             }
    //         )
    //     )
    // }
  }
}