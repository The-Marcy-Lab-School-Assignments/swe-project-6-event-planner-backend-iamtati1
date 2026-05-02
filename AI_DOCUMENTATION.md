**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

I used AI throughout this project to help develop ***seeded data*** entries for better organization, correctness, and optimization. This data was important because I needed to interact with it consistently across my API endpoints (events, users, and RSVPs).

One specific issue I ran into was understanding why my *authenticated requests* were failing even when my login route was successful. For example, I was able to log in using:

```
curl -i -X POST http://localhost:8080/api/auth/login \
-c cookies.txt ...
```

and I received a valid session cookie (session and session.sig). However, when I tried to create or delete an event or RSVP, I kept getting errors like:

"You must be logged in to do that."
or unexpected 500 errors from the backend.

AI helped me realize that ***authentication*** in curl depends on properly storing and re-sending cookies using `-c cookies.txt` and `-b cookies.txt`, and that every protected request must reuse that session file. This helped me understand session persistence instead of repeatedly logging in.


I also used AI to help me write correct ***SQL queries*** in my `eventModel.js`, especially when building my `list()` function. I learned how to correctly ***join tables and aggregate data*** so the frontend receives the correct shape.

For example, instead of only returning `user_id, I improved my query to include:

`users.username`,
`COUNT(rsvps.rsvp_id) AS rsvp_count`

This taught me how to use:

`JOIN`s to combine related tables (events, users, rsvps)
`COUNT()` for aggregation
`LEFT JOIN` to ensure events still show even without RSVPs

This was a major step in understanding how backend data is shaped specifically for frontend needs.

AI also helped me understand the ***full backend workflow*** when testing with curl. I learned how to mentally trace a request through the system:
```
CLIENT (curl)
  ↓
ROUTE MATCHING
  ↓
MIDDLEWARE (auth, validation)
  ↓
CONTROLLER
  ↓
MODEL (SQL)
  ↓
DATABASE
  ↓
RESPONSE BACK
```
This helped me debug more efficiently by identifying exactly where a request was failing instead of guessing.

AI guided me to ask myself key ***debugging*** questions:

1. Am I hitting the correct endpoint?
2. Does the request reach my server?
3. Is authentication middleware blocking the request?
4. Does the controller actually execute?
5. Are model functions correctly named and called?
6. What does the response actually look like?

Using this process helped me understand not just whether my API worked, but ***why*** it worked or failed at each layer, which is closer to real-world software engineering testing.

Overall, AI helped me strengthen my understanding of backend development, including:

- databases and SQL design
- controllers, models, and API structure
- authentication and session handling
- debugging with curl and API contracts

It also helped me refine my code by identifying small but important issues like incorrect function names (e.g., delete vs remove), missing validation, and inconsistent error handling.

The biggest takeaway was learning how to think like a ***backend engineer***: not just fixing errors, but understanding where in the system the failure occurs and how each layer depends on the next.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

Before using any AI suggestions, I first made sure I understood the backend request flow and how my project was structured.

 I studied the order of operations in my application from the route, to middleware, to controller, to model, and finally the database.

 This helped me identify where an issue might be occurring if something broke, so I could narrow down problems through process of elimination instead of guessing.

I also reviewed my project files carefully so I understood what each one was responsible for (***controllers handling logic, models handling database queries, and routes connecting endpoints***). With this structure in mind, I could evaluate whether the AI’s suggestions made sense in the correct layer of the application.

To check correctness, I used frequent `console.log()` statements throughout my code to trace execution. This helped me confirm whether controller functions were actually running and if data was reaching the model correctly.

Additionally, I compared **AI responses** with what I learned in class and the official Marcy Lab documentation. If something didn’t match my understanding of how the system should behave, or if the output didn’t align with the API contract or expected behavior, I treated it as incorrect or something that needed further exploration.

Finally, I relied heavily on real testing using curl. If the response didn’t match expected success or error cases (such as ***200, 201, 400, 401, 403, or 404***), I used that as direct feedback to determine whether the AI suggestion was actually valid or needed adjustment.

**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

In several cases, the AI’s suggestions gave me a correct direction but didn’t exactly match how my project was structured. 

For example, when I was fixing my `RSVP` ***delete*** functionality, AI initially described a generic “delete function,” but my actual code used a ***remove*** method in my model. 

This helped me realize that while the logic was correct, I still needed to adapt it to my own naming conventions and file structure.

This showed me that I understood the ***underlying*** backend concepts well enough to recognize when AI output was too generic or didn’t fully fit my system.

 Instead of copying answers directly, I could adjust them based on how my ***routes, controllers, and models*** were actually designed. It also reinforced that I was learning to ***debug*** and ***design*** independently, not just follow instructions.

**4. What did you learn from using AI in this way?**

I learned that AI can be used as both a learning tool and an assistant to help manage the complexity of a larger project. In a full-stack application, it’s easy to lose track of what’s ***working***, what’s ***breaking***, and where each issue is coming from. 

AI helped me keep track of patterns in my code and gave me reminders about what was working and what wasn’t, which made debugging less overwhelming.

I also learned that AI is most helpful when it ***doesn’t just give answers***, but instead guides me through the process. 
When I was testing my backend with curl, it helped me understand what the commands were doing and how to think through each step instead of just giving me the solution.

Overall, I learned I can use AI as a support system for smaller tasks like ***explaining errors, clarifying concepts***, or helping me ***debug*** so I can focus more on solving the larger problem and understanding my code more deeply.
