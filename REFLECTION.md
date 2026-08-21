# Reflection

## AI Study Planner

Building AI Study Planner was challenging because the project required more than simply creating pages and connecting an AI model. The application needed to handle real user interactions, accessibility, errors, testing, and deployment while keeping the architecture simple.

The hardest part was integrating AI functionality in a meaningful way. Instead of using AI only as a chatbot, I implemented both an AI Study Planner and an AI Study Assistant. The assistant can also use a structured study progress tool so that progress-related responses are based on the student's actual tasks and subjects rather than generated guesses.

Another challenging part was making the application resilient. I had to consider empty states, validation errors, AI errors, streaming states, retry behavior, and task completion and deletion. Automated testing also helped identify issues that were not obvious during manual testing. For example, the task completion and deletion tests exposed a persistence problem that I fixed before the final test run. The final test suite completed successfully with 18/18 tests passing.

Accessibility was another important part of the project. I improved semantic structure, form labels, keyboard navigation, focus states, accessible error messages, and dynamic AI status information. Lighthouse and WAVE audits helped identify areas that needed improvement and gave me a way to verify the changes.

If I were building the project again, I would plan the data architecture earlier. The current version uses browser localStorage because it keeps the application small and simple, but a production product would benefit from authentication and a cloud database so that students could access their study data across devices.

One thing I learned that surprised me was how much work is required after the main features are implemented. Testing, accessibility, error handling, performance, deployment, and documentation are not separate from building the product—they are part of actually shipping it. The project showed me that a feature that works during development is not necessarily production-ready until it has been tested and documented.

Overall, this project helped me understand the complete frontend development workflow: planning features, building components, integrating AI, handling failures, testing behavior, improving accessibility and performance, deploying the application, and documenting the final product.